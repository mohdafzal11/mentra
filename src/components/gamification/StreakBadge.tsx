"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  compact?: boolean;
}

export function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  const isHot = streak >= 7;
  const isOnFire = streak >= 30;

  return (
    <motion.div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
        isOnFire
          ? "bg-orange-500/20 border border-orange-500/30"
          : isHot
            ? "bg-amber-500/20 border border-amber-500/30"
            : "bg-[var(--card)] border border-[var(--border)]"
      }`}
      animate={
        isHot
          ? {
              boxShadow: [
                "0 0 0px rgba(251, 146, 60, 0)",
                "0 0 12px rgba(251, 146, 60, 0.3)",
                "0 0 0px rgba(251, 146, 60, 0)",
              ],
            }
          : undefined
      }
      transition={{ duration: 2, repeat: Infinity }}
    >
      <Flame
        className={`w-4 h-4 ${
          isOnFire
            ? "text-orange-400"
            : isHot
              ? "text-amber-400"
              : "text-[var(--muted)]"
        }`}
      />
      <span
        className={`text-sm font-semibold ${
          isOnFire
            ? "text-orange-300"
            : isHot
              ? "text-amber-300"
              : "text-foreground"
        }`}
      >
        {streak}
      </span>
      {!compact && (
        <span className="text-xs text-[var(--muted)]">
          {streak === 1 ? "day" : "days"}
        </span>
      )}
    </motion.div>
  );
}
