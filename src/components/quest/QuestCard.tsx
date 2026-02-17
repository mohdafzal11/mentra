"use client";

import { motion } from "framer-motion";
import { Target, CheckCircle, Zap, Clock } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  title: string;
  description: string;
  type: string;
  xpReward: number;
  status: "available" | "active" | "completed";
  onStart?: () => void;
  onOpen?: () => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  reflection: <Clock className="w-4 h-4" />,
  decision: <Target className="w-4 h-4" />,
  confidence: <Zap className="w-4 h-4" />,
  daily: <CheckCircle className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  reflection: "text-blue-400 bg-blue-500/10",
  decision: "text-amber-400 bg-amber-500/10",
  confidence: "text-purple-400 bg-purple-500/10",
  daily: "text-green-400 bg-green-500/10",
};

export function QuestCard({
  title,
  description,
  type,
  xpReward,
  status,
  onStart,
  onOpen,
}: QuestCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-2xl border p-4 transition-all",
        status === "completed"
          ? "bg-green-500/5 border-green-500/20"
          : "bg-[var(--card)] border-[var(--border)] hover:border-primary-500/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center",
            typeColors[type] || typeColors.daily
          )}
        >
          {typeIcons[type] || typeIcons.daily}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "font-medium text-sm",
                status === "completed"
                  ? "text-green-400 line-through"
                  : "text-foreground"
              )}
            >
              {title}
            </h3>
            <span className="text-xs text-xp-gold font-medium">
              +{xpReward} XP
            </span>
          </div>

          <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
            {description}
          </p>

          <div className="mt-3">
            {status === "available" && (
              <Button size="sm" onClick={onStart}>
                Start Quest
              </Button>
            )}
            {status === "active" && (
              <Button size="sm" variant="secondary" onClick={onOpen}>
                Continue
              </Button>
            )}
            {status === "completed" && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <CheckCircle className="w-3.5 h-3.5" /> Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
