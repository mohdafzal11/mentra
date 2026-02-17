"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  progress: number;
  level: number;
  compact?: boolean;
}

export function XPBar({
  currentXP,
  nextLevelXP,
  progress,
  level,
  compact = false,
}: XPBarProps) {
  return (
    <div className={cn("w-full", compact ? "space-y-1" : "space-y-2")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center justify-center w-7 h-7 rounded-lg gradient-primary text-white text-xs font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {level}
          </motion.div>
          {!compact && (
            <span className="text-xs text-[var(--muted)]">Level {level}</span>
          )}
        </div>
        <span className="text-xs text-[var(--muted)]">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>

      <div className="relative h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress * 100, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 xp-shimmer rounded-full" />
      </div>
    </div>
  );
}
