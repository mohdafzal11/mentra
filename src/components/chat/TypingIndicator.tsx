"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  personaEmoji?: string;
  personaAvatarUrl?: string;
}

export function TypingIndicator({ personaEmoji, personaAvatarUrl }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex gap-3 justify-start"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl overflow-hidden border border-purple-200/60 shadow-sm shadow-purple-100/40 flex items-center justify-center mt-1">
        {personaAvatarUrl ? (
          <img src={personaAvatarUrl} alt="" className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center text-base">
            {personaEmoji || "🤖"}
          </div>
        )}
      </div>
      <div className="bg-white border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3 shadow-[0_2px_8px_rgba(124,58,237,0.04)] flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-purple-400"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
