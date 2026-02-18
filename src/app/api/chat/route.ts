import { NextRequest } from "next/server";
import {
  buildSystemPromptFromSeed,
  streamChat,
  truncateMessages,
} from "@/lib/openrouter";

export async function POST(request: NextRequest) {
  try {
    const { personaName, messages } = await request.json();

    if (!personaName || !messages || !Array.isArray(messages)) {
      return new Response("Invalid request", { status: 400 });
    }

    // Build system prompt from hardcoded persona data
    const systemPrompt = buildSystemPromptFromSeed(personaName);

    // Prepare messages with system prompt
    const fullMessages = truncateMessages([
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]);

    // Stream response
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamChat(
            fullMessages,
            (chunk) => {
              const data = JSON.stringify({ type: "content", content: chunk });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            },
            () => {
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
