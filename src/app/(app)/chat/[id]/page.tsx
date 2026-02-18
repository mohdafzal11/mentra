"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Info, Sparkles } from "lucide-react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { PERSONA_SEEDS } from "@/lib/personas";
import { chatStore, type StoredMessage } from "@/lib/chat-store";
import Link from "next/link";

const personaEmojis: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.avatarEmoji])
);
const personaCategories: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.category])
);
const personaInspirations: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.inspirationSource])
);
const personaOpeningMessages: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.openingMessage])
);
const personaAvatarUrls: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.filter((p) => p.avatarUrl).map((p) => [p.name, p.avatarUrl!])
);

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [personaName, setPersonaName] = useState<string | null>(null);
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const chat = chatStore.getChat(chatId);
    if (!chat) {
      router.push("/personas");
      return;
    }
    setPersonaName(chat.personaName);

    if (chat.messages.length === 0) {
      const openingMsg = personaOpeningMessages[chat.personaName];
      if (openingMsg) {
        chatStore.addMessage(chatId, "assistant", openingMsg);
        setMessages([{
          role: "assistant",
          content: openingMsg,
          createdAt: new Date().toISOString(),
        }]);
      } else {
        setMessages([]);
      }
    } else {
      setMessages(chat.messages);
    }

    setLoading(false);
  }, [chatId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (isStreaming || !personaName) return;

    chatStore.addMessage(chatId, "user", content);
    const userMsg: StoredMessage = {
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingContent("");

    const chat = chatStore.getChat(chatId);
    if (chat && !chat.title) {
      const title = content.length > 50 ? content.substring(0, 47) + "..." : content;
      chatStore.updateTitle(chatId, title);
    }

    try {
      const allMessages = chatStore.getChat(chatId)?.messages || [];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaName,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
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

            if (data.type === "content") {
              fullContent += data.content;
              setStreamingContent(fullContent);
            }

            if (data.type === "done") {
              chatStore.addMessage(chatId, "assistant", fullContent);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: fullContent,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingContent("");
              setIsStreaming(false);
            }

            if (data.type === "error") {
              chatStore.addMessage(chatId, "assistant", data.content);
              setMessages((prev) => [
                ...prev,
                {
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

  if (!personaName) return null;

  const emoji = personaEmojis[personaName] || "🤖";
  const avatarUrl = personaAvatarUrls[personaName] || "";
  const category = personaCategories[personaName] || "";
  const inspiration = personaInspirations[personaName] || "";

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="relative z-10 glass-strong border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          {/* Back button */}
          <Link
            href="/personas"
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 flex items-center justify-center transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 text-purple-500 group-hover:text-purple-700 transition-colors" />
          </Link>

          {/* Persona avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-purple-200/60 shadow-sm shadow-purple-200/30">
              {avatarUrl ? (
                <img src={avatarUrl} alt={personaName} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center text-xl">
                  {emoji}
                </div>
              )}
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
          </div>

          {/* Persona info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground truncate">
                {personaName}
              </h2>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            </div>
            <p className="text-[11px] font-medium text-purple-500 capitalize truncate">
              {category} personality
            </p>
          </div>

          {/* Info button */}
          <button
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 flex items-center justify-center transition-all duration-200 group"
          >
            <Info className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
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
              <div className="px-4 py-2.5 bg-purple-50 border-t border-purple-100 text-xs text-purple-600 font-medium max-w-3xl mx-auto">
                <span className="opacity-70">AI persona inspired by</span>{" "}
                {inspiration}
                <span className="opacity-70">. Does not represent any real individual. For reflection &amp; entertainment only.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-5">
          {messages.map((msg, i) => (
            <ChatMessage
              key={`${msg.createdAt}-${i}`}
              content={msg.content}
              role={msg.role}
              personaEmoji={emoji}
              personaName={personaName}
              personaAvatarUrl={avatarUrl}
            />
          ))}

          {isStreaming && streamingContent && (
            <ChatMessage
              content={streamingContent}
              role="assistant"
              personaEmoji={emoji}
              personaName={personaName}
              personaAvatarUrl={avatarUrl}
              isStreaming
            />
          )}

          {isStreaming && !streamingContent && (
            <TypingIndicator personaEmoji={emoji} personaAvatarUrl={avatarUrl} />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 glass-strong border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <ChatInput
            onSend={sendMessage}
            disabled={isStreaming}
            placeholder={`Message ${personaName}...`}
          />
        </div>
      </div>
    </div>
  );
}
