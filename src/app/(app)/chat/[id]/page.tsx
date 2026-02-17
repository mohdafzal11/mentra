"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Info } from "lucide-react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { emitXPEvent } from "@/components/gamification/XPPopup";
import { useUser } from "@/lib/user-context";
import { PERSONA_SEEDS } from "@/lib/personas";
import Link from "next/link";

// Build emoji lookup from seed data
const personaEmojis: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.avatarEmoji])
);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface ChatData {
  id: string;
  title: string | null;
  persona: {
    id: string;
    name: string;
    category: string;
    teaserLine: string | null;
    inspirationSource: string;
  };
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { refreshUser } = useUser();
  const chatId = params.id as string;

  const [chat, setChat] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/chat/${chatId}`);
      if (!res.ok) {
        router.push("/chat");
        return;
      }
      const data = await res.json();
      setChat(data.chat);
      setMessages(data.messages);
    } catch {
      router.push("/chat");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (isStreaming) return;

    // Optimistically add user message
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, content }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));

            if (data.type === "xp_update") {
              // Emit XP popup events
              if (data.messageXP > 0) {
                emitXPEvent(data.messageXP, "message");
              }
              if (data.dailyFirstXP > 0) {
                setTimeout(() => emitXPEvent(data.dailyFirstXP, "daily_first"), 300);
              }
              if (data.streakXP > 0) {
                setTimeout(() => emitXPEvent(data.streakXP, "streak"), 600);
              }
              // Refresh user data for XP bar update
              refreshUser();
            }

            if (data.type === "content") {
              fullContent += data.content;
              setStreamingContent(fullContent);
            }

            if (data.type === "done") {
              setMessages((prev) => [
                ...prev,
                {
                  id: `assistant-${Date.now()}`,
                  role: "assistant",
                  content: fullContent,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingContent("");
              setIsStreaming(false);
            }

            if (data.type === "error") {
              setMessages((prev) => [
                ...prev,
                {
                  id: `error-${Date.now()}`,
                  role: "assistant",
                  content: data.content,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingContent("");
              setIsStreaming(false);
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      console.error("Send message error:", error);
      setIsStreaming(false);
      setStreamingContent("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          className="w-8 h-8 rounded-lg gradient-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!chat) return null;

  const emoji = personaEmojis[chat.persona.name] || "🤖";

  return (
    <div className="flex flex-col h-screen md:h-screen">
      {/* Chat header */}
      <div className="glass-strong border-b border-[var(--border)] px-4 md:px-6 py-3 flex items-center gap-3">
        <Link href="/chat" className="md:hidden">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 flex items-center justify-center text-xl">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">
            {chat.persona.name}
          </h2>
          <p className="text-xs text-[var(--muted)] capitalize">
            {chat.persona.category} mentor
          </p>
        </div>
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className="text-[var(--muted)] hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Disclaimer banner */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-300">
              This is an AI persona inspired by {chat.persona.inspirationSource}
              . It does not represent or impersonate any real individual. For
              reflection and entertainment only.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
          {messages.length === 0 && !isStreaming && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="text-6xl mb-4 inline-block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {emoji}
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">
                Meet {chat.persona.name}
              </h3>
              {chat.persona.teaserLine && (
                <p className="text-sm text-[var(--muted)] italic mb-4 max-w-md mx-auto">
                  &ldquo;{chat.persona.teaserLine}&rdquo;
                </p>
              )}
              <div className="flex items-center justify-center gap-2 text-xs text-xp-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Earn XP with every conversation</span>
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              content={msg.content}
              role={msg.role}
              personaEmoji={emoji}
              personaName={chat.persona.name}
            />
          ))}

          {isStreaming && streamingContent && (
            <ChatMessage
              content={streamingContent}
              role="assistant"
              personaEmoji={emoji}
              personaName={chat.persona.name}
              isStreaming
            />
          )}

          {isStreaming && !streamingContent && (
            <TypingIndicator personaEmoji={emoji} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput
            onSend={sendMessage}
            disabled={isStreaming}
            placeholder={`Ask ${chat.persona.name}...`}
          />
        </div>
      </div>
    </div>
  );
}
