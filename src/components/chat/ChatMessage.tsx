"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  personaEmoji?: string;
  personaName?: string;
  personaAvatarUrl?: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  content,
  role,
  personaEmoji,
  personaName,
  personaAvatarUrl,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl overflow-hidden border border-purple-200/60 shadow-sm shadow-purple-100/40 flex items-center justify-center mt-1">
          {personaAvatarUrl ? (
            <img src={personaAvatarUrl} alt={personaName || ""} className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center text-base">
              {personaEmoji || "🤖"}
            </div>
          )}
        </div>
      )}

      <div className={cn("max-w-[80%] md:max-w-[70%]", isUser ? "items-end" : "items-start")}>
        {!isUser && personaName && (
          <span className="text-[11px] font-semibold text-purple-500 ml-1 mb-1 block">
            {personaName}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "gradient-primary text-white rounded-br-md shadow-md shadow-purple-500/20"
              : "bg-white border border-[var(--border)] rounded-bl-md text-foreground shadow-[0_2px_8px_rgba(124,58,237,0.04)]"
          )}
        >
          <div className="whitespace-pre-wrap break-words">{content}</div>
          {isStreaming && (
            <motion.span
              className="inline-block w-1.5 h-4 ml-1 rounded-sm gradient-primary"
              animate={{ opacity: [1, 0.3] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
