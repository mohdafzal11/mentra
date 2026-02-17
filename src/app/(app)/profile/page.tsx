"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Target,
  MessageCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { XPBar } from "@/components/gamification/XPBar";
import { useUser } from "@/lib/user-context";
import { formatDistanceToNow } from "date-fns";

interface XPLogEntry {
  id: string;
  amount: number;
  source: string;
  createdAt: string;
}

const sourceLabels: Record<string, string> = {
  message: "Message",
  daily_first: "First Daily Message",
  streak: "Streak Bonus",
  quest: "Quest Completed",
  onboarding: "Welcome Bonus",
  level_up: "Level Up Bonus",
};

const sourceIcons: Record<string, React.ReactNode> = {
  message: <MessageCircle className="w-3.5 h-3.5" />,
  daily_first: <Calendar className="w-3.5 h-3.5" />,
  streak: <Flame className="w-3.5 h-3.5" />,
  quest: <Target className="w-3.5 h-3.5" />,
  onboarding: <Sparkles className="w-3.5 h-3.5" />,
  level_up: <TrendingUp className="w-3.5 h-3.5" />,
};

export default function ProfilePage() {
  const { user } = useUser();
  const [xpLogs, setXpLogs] = useState<XPLogEntry[]>([]);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalChats: 0,
    questsCompleted: 0,
  });

  useEffect(() => {
    fetchXPData();
    fetchStats();
  }, []);

  const fetchXPData = async () => {
    try {
      const res = await fetch("/api/xp");
      if (res.ok) {
        const data = await res.json();
        setXpLogs(data.recentLogs);
      }
    } catch (error) {
      console.error("Fetch XP error:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Profile header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/30"
          animate={{
            boxShadow: [
              "0 10px 25px rgba(217, 70, 239, 0.3)",
              "0 10px 40px rgba(217, 70, 239, 0.4)",
              "0 10px 25px rgba(217, 70, 239, 0.3)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {user.name[0].toUpperCase()}
        </motion.div>
        <h1 className="text-xl font-bold">{user.name}</h1>
        <p className="text-sm text-[var(--muted)]">{user.email}</p>
        {user.intent && (
          <span className="inline-block mt-2 px-3 py-1 rounded-full glass text-xs text-primary-400 capitalize">
            {user.intent} path
          </span>
        )}
      </motion.div>

      {/* XP Progress */}
      <motion.div
        className="p-5 rounded-2xl glass mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Progress</h2>
          <span className="text-sm font-bold text-xp-gold">{user.xp} XP</span>
        </div>
        <XPBar
          currentXP={user.xpProgress.currentLevelXP}
          nextLevelXP={user.xpProgress.nextLevelXP}
          progress={user.xpProgress.progress}
          level={user.level}
        />
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          className="p-4 rounded-2xl glass text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-2xl font-bold">{user.streak}</p>
          <p className="text-xs text-[var(--muted)]">Streak</p>
        </motion.div>
        <motion.div
          className="p-4 rounded-2xl glass text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MessageCircle className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats.totalMessages}</p>
          <p className="text-xs text-[var(--muted)]">Messages</p>
        </motion.div>
        <motion.div
          className="p-4 rounded-2xl glass text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats.questsCompleted}</p>
          <p className="text-xs text-[var(--muted)]">Quests</p>
        </motion.div>
      </div>

      {/* Longest streak */}
      <motion.div
        className="flex items-center justify-between p-4 rounded-2xl glass mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="text-sm">Longest Streak</span>
        </div>
        <span className="text-sm font-bold">
          {user.longestStreak} {user.longestStreak === 1 ? "day" : "days"}
        </span>
      </motion.div>

      {/* Recent XP activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-sm font-medium text-[var(--muted)] mb-3">
          Recent XP Activity
        </h2>
        <div className="space-y-2">
          {xpLogs.length === 0 ? (
            <p className="text-sm text-[var(--muted)]/50 text-center py-8">
              No XP earned yet. Start chatting!
            </p>
          ) : (
            xpLogs.map((log, i) => (
              <motion.div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.03 }}
              >
                <div className="w-8 h-8 rounded-lg bg-xp-gold/10 flex items-center justify-center text-xp-gold">
                  {sourceIcons[log.source] || (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm">
                    {sourceLabels[log.source] || log.source}
                  </span>
                  <p className="text-xs text-[var(--muted)]">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span className="text-sm font-bold text-xp-gold">
                  +{log.amount}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
