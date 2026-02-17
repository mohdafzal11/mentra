"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  personaEmoji?: string;
  personaName?: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  content,
  role,
  personaEmoji,
  personaName,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 flex items-center justify-center text-lg mt-1">
          {personaEmoji || "🤖"}
        </div>
      )}

      <div className={cn("max-w-[80%] md:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        {!isUser && personaName && (
          <span className="text-[11px] text-primary-400 font-medium ml-1 mb-1 block">
            {personaName}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "gradient-primary text-white rounded-br-sm shadow-lg shadow-primary-500/10"
              : "bg-[var(--card)] border border-[var(--border)] rounded-bl-sm text-foreground"
          )}
        >
          <div className="whitespace-pre-wrap break-words">{content}</div>
          {isStreaming && (
            <motion.span
              className="inline-block w-2 h-4 ml-1 bg-foreground/50 rounded-sm"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
