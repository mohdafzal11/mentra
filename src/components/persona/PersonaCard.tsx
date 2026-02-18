"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonaCardProps {
  name: string;
  teaserLine: string;
  avatarEmoji: string;
  avatarUrl?: string | null;
  category: string;
  unlockLevel: number;
  userLevel: number;
  isUnlocked: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const categoryPillColors: Record<string, string> = {
  bollywood: "bg-rose-100 text-rose-700 border-rose-200",
  hollywood: "bg-sky-100 text-sky-700 border-sky-200",
  cricket: "bg-green-100 text-green-700 border-green-200",
  football: "bg-emerald-100 text-emerald-700 border-emerald-200",
  web3: "bg-amber-100 text-amber-700 border-amber-200",
};

export function PersonaCard({
  name,
  teaserLine,
  avatarEmoji,
  avatarUrl,
  category,
  unlockLevel,
  isUnlocked,
  onClick,
  selected = false,
}: PersonaCardProps) {
  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.02, y: -3 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative rounded-2xl cursor-pointer overflow-hidden flex items-stretch h-[100px] md:h-[110px]",
        "bg-gradient-to-br from-white via-white to-purple-50/40",
        "border border-[var(--border)]",
        "shadow-[0_2px_12px_rgba(124,58,237,0.06)]",
        "hover:shadow-[0_8px_30px_rgba(124,58,237,0.14)]",
        "hover:border-purple-200/80",
        "transition-all duration-500 ease-out",
        !isUnlocked && "opacity-50",
        selected && "ring-2 ring-primary-500 border-primary-500/50"
      )}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Animated gradient shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Subtle glow behind card on hover */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-400/8 to-violet-400/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-1.5">
          <Lock className="w-5 h-5 text-[var(--muted)]" />
          <span className="text-xs font-medium text-[var(--muted)]">
            Unlock at Level {unlockLevel}
          </span>
        </div>
      )}

      {/* Avatar — flush left, full height, no cropping of face */}
      <div className="relative flex-shrink-0 w-[100px] md:w-[110px]">
        <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/15 to-violet-400/15 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
        {avatarUrl ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Soft fade on right edge */}
            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent" />
          </div>
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center text-4xl">
            {avatarEmoji}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex-1 min-w-0 z-[1] p-4 flex flex-col justify-center">
        {/* Name + category pill */}
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className="font-display font-bold text-lg text-foreground truncate group-hover:text-purple-900 transition-colors duration-300">
            {name}
          </h3>
          <span
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex-shrink-0 border",
              categoryPillColors[category] || "bg-purple-100 text-purple-700 border-purple-200"
            )}
          >
            {category}
          </span>
        </div>

        {/* Teaser line */}
        <p className="text-[13px] text-[var(--muted)] line-clamp-2 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
          {teaserLine}
        </p>
      </div>

      {/* Arrow */}
      {isUnlocked && (
        <div className="relative flex-shrink-0 z-[1] flex items-center pr-4">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
            <svg
              className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-all duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
