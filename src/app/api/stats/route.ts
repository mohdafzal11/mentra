import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalMessages, totalChats, questsCompleted] = await Promise.all([
      prisma.message.count({
        where: { userId: user.id, role: "user" },
      }),
      prisma.chat.count({
        where: { userId: user.id },
      }),
      prisma.userQuestProgress.count({
        where: { userId: user.id, status: "completed" },
      }),
    ]);

    return NextResponse.json({
      totalMessages,
      totalChats,
      questsCompleted,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
