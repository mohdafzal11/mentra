import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  buildSystemPrompt,
  streamChat,
  truncateMessages,
} from "@/lib/openrouter";
import {
  awardXP,
  updateStreak,
  checkDailyFirstMessage,
  XP_REWARDS,
} from "@/lib/gamification";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId, content } = await request.json();

    if (!chatId || !content || typeof content !== "string" || content.length > 4000) {
      return new Response("Invalid request", { status: 400 });
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId: user.id },
      include: { persona: true },
    });

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Save user message
    await prisma.message.create({
      data: {
        chatId,
        userId: user.id,
        role: "user",
        content,
      },
    });

    // Update streak
    const streakResult = await updateStreak(user.id);

    // Check daily first message
    let dailyFirstXP = 0;
    const isFirstMessage = await checkDailyFirstMessage(user.id);
    if (isFirstMessage) {
      await awardXP(user.id, XP_REWARDS.FIRST_DAILY_MESSAGE, "daily_first");
      dailyFirstXP = XP_REWARDS.FIRST_DAILY_MESSAGE;
    }

    // Award message XP
    const messageXPResult = await awardXP(
      user.id,
      XP_REWARDS.MESSAGE_SENT,
      "message",
      { chatId }
    );

    // Build system prompt based on user level
    const systemPrompt = await buildSystemPrompt(
      chat.personaId,
      user.level,
      user.name,
      user.intent
    );

    // Get chat history
    const history = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const messages = truncateMessages(
      [
        { role: "system" as const, content: systemPrompt },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      user.level
    );

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        // Send XP data as first chunk
        const xpData = JSON.stringify({
          type: "xp_update",
          messageXP: XP_REWARDS.MESSAGE_SENT,
          dailyFirstXP,
          streakXP: streakResult.streakBonusXP,
          streak: streakResult.streak,
          totalXP: messageXPResult.newXP,
          level: messageXPResult.newLevel,
          leveledUp: messageXPResult.leveledUp,
        });
        controller.enqueue(
          encoder.encode(`data: ${xpData}\n\n`)
        );

        try {
          await streamChat(
            messages,
            user.level,
            (chunk) => {
              fullResponse += chunk;
              const data = JSON.stringify({ type: "content", content: chunk });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            },
            async () => {
              // Save assistant message
              await prisma.message.create({
                data: {
                  chatId,
                  role: "assistant",
                  content: fullResponse,
                  xpAwarded: XP_REWARDS.MESSAGE_SENT,
                },
              });

              // Update chat title if it's the first exchange
              if (history.length <= 1) {
                const title =
                  content.length > 50
                    ? content.substring(0, 47) + "..."
                    : content;
                await prisma.chat.update({
                  where: { id: chatId },
                  data: { title },
                });
              }

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
              );
              controller.close();
            }
          );
        } catch (error) {
          console.error("Stream error:", error);
          const errMsg = JSON.stringify({
            type: "error",
            content: "I'm having trouble thinking right now. Please try again.",
          });
          controller.enqueue(encoder.encode(`data: ${errMsg}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

// Create a new chat
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { personaId } = await request.json();
    if (!personaId) {
      return new Response("personaId required", { status: 400 });
    }

    // Verify persona is unlocked for user
    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
    });

    if (!persona) {
      return new Response("Persona not found", { status: 404 });
    }

    if (persona.unlockLevel > user.level) {
      // Check if user has explicit unlock
      const unlock = await prisma.userPersonaUnlock.findUnique({
        where: { userId_personaId: { userId: user.id, personaId } },
      });
      if (!unlock) {
        return new Response("Persona locked", { status: 403 });
      }
    }

    const chat = await prisma.chat.create({
      data: {
        userId: user.id,
        personaId,
      },
      include: { persona: true },
    });

    return Response.json({ chat });
  } catch (error) {
    console.error("Create chat error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
