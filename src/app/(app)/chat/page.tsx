"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUser } from "@/lib/user-context";
import { formatDistanceToNow } from "date-fns";
import { PERSONA_SEEDS } from "@/lib/personas";

// Build emoji lookup from seed data
const personaEmojis: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.avatarEmoji])
);

interface ChatItem {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  persona: {
    id: string;
    name: string;
    category: string;
  };
}

interface PersonaItem {
  id: string;
  name: string;
  category: string;
  teaserLine: string;
  unlockLevel: number;
}

export default function ChatListPage() {
  const router = useRouter();
  const { user } = useUser();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [personas, setPersonas] = useState<PersonaItem[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    fetchPersonas();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chat/list");
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Fetch chats error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonas = async () => {
    try {
      const res = await fetch("/api/personas");
      if (res.ok) {
        const data = await res.json();
        setPersonas(data.personas.filter((p: PersonaItem) => p.unlockLevel <= (user?.level || 1)));
      }
    } catch (error) {
      console.error("Fetch personas error:", error);
    }
  };

  const createNewChat = async (personaId: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat/${data.chat.id}`);
      }
    } catch (error) {
      console.error("Create chat error:", error);
    }
  };

  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Conversations</h1>
          <p className="text-sm text-[var(--muted)]">
            Your mentorship journey
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNewChat(true)}>
          <Plus className="w-4 h-4 mr-1" /> New Chat
        </Button>
      </div>

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
                {personas.map((persona) => (
                  <motion.button
                    key={persona.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => createNewChat(persona.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-primary-500/30 text-left transition-colors"
                  >
                    <span className="text-xl">{personaEmojis[persona.name] || "🤖"}</span>
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
              className="h-20 rounded-2xl bg-[var(--card)] animate-pulse"
            />
          ))}
        </div>
      ) : chats.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MessageCircle className="w-12 h-12 text-[var(--muted)]/30 mx-auto mb-4" />
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
                <span className="text-2xl flex-shrink-0">{personaEmojis[chat.persona.name] || "🤖"}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">
                    {chat.title || "New conversation"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-primary-400">
                      {chat.persona.name}
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
