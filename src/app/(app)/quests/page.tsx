"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Target, Sparkles } from "lucide-react";
import { QuestCard } from "@/components/quest/QuestCard";

interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  xpReward: number;
  minLevel: number;
  prompt: string;
  status: string;
}

export default function QuestsPage() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await fetch("/api/quests");
      if (res.ok) {
        const data = await res.json();
        setQuests(data.quests);
      }
    } catch (error) {
      console.error("Fetch quests error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startQuest = async (questId: string) => {
    try {
      const res = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId, action: "start" }),
      });

      if (res.ok) {
        // Create a chat for this quest with the first available persona
        const personasRes = await fetch("/api/personas");
        if (personasRes.ok) {
          const { personas } = await personasRes.json();
          const unlockedPersona = personas.find(
            (p: { isUnlocked: boolean }) => p.isUnlocked
          );
          if (unlockedPersona) {
            const chatRes = await fetch("/api/chat", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ personaId: unlockedPersona.id }),
            });
            if (chatRes.ok) {
              const { chat } = await chatRes.json();
              router.push(`/chat/${chat.id}`);
            }
          }
        }
      }
    } catch (error) {
      console.error("Start quest error:", error);
    }
  };

  const completedCount = quests.filter((q) => q.status === "completed").length;
  const totalXPEarned = quests
    .filter((q) => q.status === "completed")
    .reduce((sum, q) => sum + q.xpReward, 0);

  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Quests</h1>
        <p className="text-sm text-[var(--muted)]">
          Structured conversations for growth
        </p>
      </div>

      {/* Quest stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          className="p-4 rounded-2xl glass text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Target className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <p className="text-2xl font-bold">{completedCount}</p>
          <p className="text-xs text-[var(--muted)]">Completed</p>
        </motion.div>
        <motion.div
          className="p-4 rounded-2xl glass text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Sparkles className="w-5 h-5 text-xp-gold mx-auto mb-1" />
          <p className="text-2xl font-bold text-xp-gold">{totalXPEarned}</p>
          <p className="text-xs text-[var(--muted)]">XP Earned</p>
        </motion.div>
      </div>

      {/* Quest categories */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-[var(--card)] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Active quests */}
          {quests.filter((q) => q.status === "active").length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-[var(--muted)] mb-3">
                Active Quests
              </h2>
              <div className="space-y-2">
                {quests
                  .filter((q) => q.status === "active")
                  .map((quest, i) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <QuestCard
                        {...quest}
                        status="active"
                        onOpen={() => startQuest(quest.id)}
                      />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Available quests */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-[var(--muted)] mb-3">
              Available Quests
            </h2>
            <div className="space-y-2">
              {quests
                .filter((q) => q.status === "available")
                .map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <QuestCard
                      {...quest}
                      status="available"
                      onStart={() => startQuest(quest.id)}
                    />
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Completed quests */}
          {quests.filter((q) => q.status === "completed").length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-[var(--muted)] mb-3">
                Completed
              </h2>
              <div className="space-y-2">
                {quests
                  .filter((q) => q.status === "completed")
                  .map((quest, i) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <QuestCard {...quest} status="completed" />
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
