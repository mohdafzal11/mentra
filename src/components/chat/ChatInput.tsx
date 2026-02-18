"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Share your thoughts...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = message.trim() && !disabled;

  return (
    <div
      className={cn(
        "bg-white border rounded-2xl p-2 transition-all duration-300",
        "shadow-[0_2px_12px_rgba(124,58,237,0.04)]",
        "focus-within:shadow-[0_4px_20px_rgba(124,58,237,0.10)]",
        "focus-within:border-purple-300",
        "border-[var(--border)]"
      )}
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-[var(--muted)]/60 px-3 py-2 max-h-[120px]"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSubmit}
          disabled={!canSend}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            canSend
              ? "gradient-primary text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/30"
              : "bg-purple-50 text-purple-300 border border-purple-100"
          )}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
