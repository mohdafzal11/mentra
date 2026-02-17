import { prisma } from "./prisma";
import { isToday, differenceInCalendarDays } from "date-fns";

// ─── XP Configuration ────────────────────────────

export const XP_REWARDS = {
  FIRST_DAILY_MESSAGE: 50,
  MESSAGE_SENT: 10,
  MEANINGFUL_REPLY: 25,
  QUEST_COMPLETE: 100,
  STREAK_BONUS: 15, // per streak day
  ONBOARDING_COMPLETE: 75,
  LEVEL_UP_BONUS: 50,
} as const;

// Non-linear level curve: each level requires progressively more XP
// Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, etc.
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(50 * Math.pow(level - 1, 1.8));
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

export function getXPProgress(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number; // 0-1
} {
  const level = getLevelFromXP(totalXP);
  const currentLevelStart = xpRequiredForLevel(level);
  const nextLevelStart = xpRequiredForLevel(level + 1);
  const currentLevelXP = totalXP - currentLevelStart;
  const nextLevelXP = nextLevelStart - currentLevelStart;
  const progress = nextLevelXP > 0 ? currentLevelXP / nextLevelXP : 0;

  return { level, currentLevelXP, nextLevelXP, progress };
}

// ─── XP Award Engine ─────────────────────────────

export type XPSource =
  | "message"
  | "quest"
  | "streak"
  | "onboarding"
  | "daily_first"
  | "level_up";

export async function awardXP(
  userId: string,
  amount: number,
  source: XPSource,
  metadata?: Record<string, unknown>
): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const oldLevel = user.level;
  const newXP = user.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { xp: newXP, level: newLevel },
    }),
    prisma.xPLog.create({
      data: {
        userId,
        amount,
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    }),
  ]);

  // Bonus XP for leveling up
  if (leveledUp) {
    await prisma.xPLog.create({
      data: {
        userId,
        amount: XP_REWARDS.LEVEL_UP_BONUS,
        source: "level_up",
        metadata: JSON.stringify({ newLevel }),
      },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { xp: newXP + XP_REWARDS.LEVEL_UP_BONUS },
    });

    // Check for persona unlocks at new level
    await checkPersonaUnlocks(userId, newLevel);
  }

  return { newXP, newLevel, leveledUp };
}

// ─── Streak System ───────────────────────────────

export async function updateStreak(
  userId: string
): Promise<{ streak: number; isNewDay: boolean; streakBonusXP: number }> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const now = new Date();
  const lastActive = user.lastActiveAt;

  // Already active today
  if (lastActive && isToday(lastActive)) {
    return { streak: user.streak, isNewDay: false, streakBonusXP: 0 };
  }

  let newStreak: number;
  if (lastActive && differenceInCalendarDays(now, lastActive) === 1) {
    // Consecutive day - increment streak
    newStreak = user.streak + 1;
  } else if (!lastActive || differenceInCalendarDays(now, lastActive) > 1) {
    // Streak broken or first visit - reset to 1
    newStreak = 1;
  } else {
    newStreak = user.streak;
  }

  const longestStreak = Math.max(user.longestStreak, newStreak);
  const streakBonusXP =
    newStreak > 1 ? XP_REWARDS.STREAK_BONUS * Math.min(newStreak, 30) : 0;

  await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      longestStreak,
      lastActiveAt: now,
    },
  });

  if (streakBonusXP > 0) {
    await awardXP(userId, streakBonusXP, "streak", {
      streakDays: newStreak,
    });
  }

  return { streak: newStreak, isNewDay: true, streakBonusXP };
}

// ─── Daily First Message Check ───────────────────

export async function checkDailyFirstMessage(
  userId: string
): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysLog = await prisma.xPLog.findFirst({
    where: {
      userId,
      source: "daily_first",
      createdAt: { gte: today },
    },
  });

  return !todaysLog; // true if this IS the first message today
}

// ─── Persona Unlock Logic ────────────────────────

export async function checkPersonaUnlocks(userId: string, level: number) {
  const lockablePersonas = await prisma.persona.findMany({
    where: {
      unlockLevel: { lte: level },
      isActive: true,
    },
  });

  for (const persona of lockablePersonas) {
    await prisma.userPersonaUnlock.upsert({
      where: {
        userId_personaId: { userId, personaId: persona.id },
      },
      create: { userId, personaId: persona.id },
      update: {},
    });
  }
}

// ─── Get Unlocked Persona Depth ──────────────────

export function getMaxDepthForLevel(userLevel: number): number {
  if (userLevel >= 15) return 3; // Inner circle
  if (userLevel >= 5) return 2; // Deeper
  return 1; // Surface
}
