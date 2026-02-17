import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/gamification";

// Get available quests
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quests = await prisma.quest.findMany({
      where: {
        isActive: true,
        minLevel: { lte: user.level },
      },
      include: {
        userProgress: {
          where: { userId: user.id },
        },
      },
      orderBy: { minLevel: "asc" },
    });

    const questsWithStatus = quests.map((quest) => ({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      type: quest.type,
      xpReward: quest.xpReward,
      minLevel: quest.minLevel,
      prompt: quest.prompt,
      status: quest.userProgress[0]?.status || "available",
      startedAt: quest.userProgress[0]?.startedAt,
      completedAt: quest.userProgress[0]?.completedAt,
    }));

    return NextResponse.json({ quests: questsWithStatus });
  } catch (error) {
    console.error("Quest fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Start or complete a quest
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questId, action } = await request.json();

    if (!questId || !action) {
      return NextResponse.json(
        { error: "questId and action required" },
        { status: 400 }
      );
    }

    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    if (action === "start") {
      const progress = await prisma.userQuestProgress.upsert({
        where: { userId_questId: { userId: user.id, questId } },
        create: { userId: user.id, questId, status: "active" },
        update: { status: "active", startedAt: new Date() },
      });

      return NextResponse.json({ progress });
    }

    if (action === "complete") {
      const progress = await prisma.userQuestProgress.update({
        where: { userId_questId: { userId: user.id, questId } },
        data: { status: "completed", completedAt: new Date() },
      });

      // Award quest XP
      const xpResult = await awardXP(user.id, quest.xpReward, "quest", {
        questId,
        questTitle: quest.title,
      });

      return NextResponse.json({
        progress,
        xpAwarded: quest.xpReward,
        ...xpResult,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Quest action error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
