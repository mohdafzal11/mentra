"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaCardProps {
  name: string;
  teaserLine: string;
  avatarEmoji: string;
  category: string;
  unlockLevel: number;
  userLevel: number;
  isUnlocked: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const categoryColors: Record<string, string> = {
  motivation: "from-rose-500/20 to-pink-500/20",
  humor: "from-amber-500/20 to-yellow-500/20",
  confidence: "from-fuchsia-500/20 to-pink-500/20",
  wisdom: "from-indigo-500/20 to-blue-500/20",
  empowerment: "from-purple-500/20 to-violet-500/20",
  "life-lessons": "from-green-500/20 to-emerald-500/20",
  // Legacy categories
  leadership: "from-blue-500/20 to-indigo-500/20",
  peace: "from-green-500/20 to-emerald-500/20",
  science: "from-cyan-500/20 to-teal-500/20",
  creativity: "from-purple-500/20 to-pink-500/20",
};

const categoryBorders: Record<string, string> = {
  motivation: "border-rose-500/30",
  humor: "border-amber-500/30",
  confidence: "border-fuchsia-500/30",
  wisdom: "border-indigo-500/30",
  empowerment: "border-purple-500/30",
  "life-lessons": "border-green-500/30",
  // Legacy categories
  leadership: "border-blue-500/30",
  peace: "border-green-500/30",
  science: "border-cyan-500/30",
  creativity: "border-purple-500/30",
};

export function PersonaCard({
  name,
  teaserLine,
  avatarEmoji,
  category,
  unlockLevel,
  userLevel,
  isUnlocked,
  onClick,
  selected = false,
}: PersonaCardProps) {
  return (
    <motion.div
      whileHover={{ scale: isUnlocked ? 1.03 : 1.01 }}
      whileTap={{ scale: isUnlocked ? 0.97 : 1 }}
      className={cn(
        "relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden",
        isUnlocked
          ? `bg-gradient-to-br ${categoryColors[category] || categoryColors.wisdom} ${categoryBorders[category] || categoryBorders.wisdom}`
          : "bg-[var(--card)] border-[var(--border)] opacity-70",
        selected && "ring-2 ring-primary-500 border-primary-500/50"
      )}
      onClick={isUnlocked ? onClick : undefined}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-5 h-5 text-[var(--muted)] mx-auto mb-1" />
            <span className="text-xs text-[var(--muted)]">
              Level {unlockLevel}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-3xl">{avatarEmoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            {isUnlocked && userLevel >= 15 && (
              <Sparkles className="w-3.5 h-3.5 text-xp-gold flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5 capitalize">
            {category}
          </p>
          <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2 italic">
            &ldquo;{teaserLine}&rdquo;
          </p>
        </div>
      </div>

      {selected && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary"
          layoutId="persona-selected"
        />
      )}
    </motion.div>
  );
}
