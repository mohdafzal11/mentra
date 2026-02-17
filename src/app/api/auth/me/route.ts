import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getXPProgress, awardXP, XP_REWARDS, checkPersonaUnlocks } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const xpProgress = getXPProgress(user.xp);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        intent: user.intent,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak: user.longestStreak,
        onboarded: user.onboarded,
        xpProgress,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { intent, onboarded } = body;

    const updateData: Record<string, unknown> = {};
    if (intent) updateData.intent = intent;
    if (onboarded !== undefined) updateData.onboarded = onboarded;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Award onboarding XP
    if (onboarded && !user.onboarded) {
      await awardXP(user.id, XP_REWARDS.ONBOARDING_COMPLETE, "onboarding");
      await checkPersonaUnlocks(user.id, updatedUser.level);
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
