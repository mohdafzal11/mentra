"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PERSONA_SEEDS } from "@/lib/personas";
import { chatStore, type StoredChat } from "@/lib/chat-store";
import { formatDistanceToNow } from "date-fns";

// Build emoji lookup from seed data
const personaEmojis: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.avatarEmoji])
);

export default function ChatListPage() {
  const router = useRouter();
  const [chats, setChats] = useState<StoredChat[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setChats(chatStore.getChats());
    setLoading(false);
  }, []);

  const createNewChat = (personaName: string) => {
    const chatId = chatStore.createChat(personaName);
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Premium header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-10 text-center py-4"
      >
        {/* Logo + Title row */}
        <div className="flex items-center justify-center gap-4">
          <motion.div
            className="relative"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-purple-400/30 rounded-3xl blur-3xl scale-150" />
            <Image
              src="/logo.png"
              alt="Mentra"
              width={48}
              height={48}
              className="relative w-12 h-12 object-contain drop-shadow-xl"
            />
          </motion.div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-5xl font-extrabold tracking-tight leading-none gradient-text-animated">
              Mentra
            </h1>
            <span className="text-[10px] bg-purple-600 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-widest shadow-sm">
              Beta
            </span>
          </div>
        </div>

        {/* Subtitle block */}
        <h2 className="font-display text-[1.35rem] font-semibold text-foreground/90 mb-2">
          Your Conversations
        </h2>
        <p className="text-sm font-semibold gradient-text tracking-wide">
          Continue your mentorship journey
        </p>

        <div className="mt-4">
          <Button size="sm" onClick={() => setShowNewChat(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Chat
          </Button>
        </div>
      </motion.div>

      {/* New chat persona picker */}
      <AnimatePresence>
        {showNewChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 rounded-2xl glass space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Choose a mentor</h3>
                <button
                  onClick={() => setShowNewChat(false)}
                  className="text-xs text-[var(--muted)] hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {PERSONA_SEEDS.map((persona) => (
                  <motion.button
                    key={persona.name}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => createNewChat(persona.name)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-primary-500/30 text-left transition-colors"
                  >
                    <span className="text-xl">{persona.avatarEmoji}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {persona.name}
                      </span>
                      <span className="text-xs text-[var(--muted)] ml-2 capitalize">
                        {persona.category}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white animate-pulse shadow-sm"
            />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
          <p className="text-sm text-[var(--muted)] mb-6">
            Start your first mentorship conversation
          </p>
          <Button onClick={() => setShowNewChat(true)}>
            <Plus className="w-4 h-4 mr-1" /> Start Chatting
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat, i) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                hover
                onClick={() => router.push(`/chat/${chat.id}`)}
                className="flex items-center gap-3"
              >
                <span className="text-2xl flex-shrink-0">
                  {personaEmojis[chat.personaName] || "🤖"}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">
                    {chat.title || "New conversation"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-primary-500">
                      {chat.personaName}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {formatDistanceToNow(new Date(chat.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <MessageCircle className="w-4 h-4 text-[var(--muted)] flex-shrink-0" />
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
