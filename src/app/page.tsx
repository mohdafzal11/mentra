"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Flame,
  Target,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Bollywood Mentor Chats",
    description:
      "Chat with iconic personalities — from filmy romantics to cricket chachas. All inspired by desi culture.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Level Up Your Life",
    description:
      "Earn XP like a video game, unlock deeper conversations, and grow through every chat.",
  },
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Build Daily Streaks",
    description:
      "Develop a reflection habit. Morning chai + MimChat = unstoppable growth routine.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Complete Quests",
    description:
      "Structured conversations for confidence, career, and inner peace. Like side quests for real life.",
  },
];

const mentorPreviews = [
  { emoji: "🎬", name: "Raj", tag: "Motivation" },
  { emoji: "🤗", name: "Munna Bhai", tag: "Humor" },
  { emoji: "💃", name: "Geet", tag: "Confidence" },
  { emoji: "🎓", name: "Prof. Virus", tag: "Wisdom" },
  { emoji: "👑", name: "Rani", tag: "Empowerment" },
  { emoji: "🏏", name: "Cricket Chacha", tag: "Life Lessons" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Bollywood-themed background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/[0.03] rounded-full blur-3xl hidden lg:block" />
        {/* Filmy decorations */}
        <div className="absolute top-20 right-10 text-6xl opacity-[0.03] rotate-12 hidden xl:block select-none">🎬🎬🎬</div>
        <div className="absolute bottom-32 left-10 text-6xl opacity-[0.03] -rotate-12 hidden xl:block select-none">🎭🎭🎭</div>
        <div className="absolute top-1/2 right-20 text-5xl opacity-[0.03] hidden xl:block select-none">🏏</div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight">MimChat</span>
              <span className="text-[10px] text-[var(--muted)] leading-tight hidden sm:block">
                Filmy wisdom, real growth
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm text-[var(--muted)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-base">🎬</span>
            <span>Bollywood wisdom meets real-life growth</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Chat with India&apos;s
            <br />
            <span className="gradient-text">filmy-est mentors</span>
          </h1>

          <p className="text-lg lg:text-xl text-[var(--muted)] mb-8 max-w-lg mx-auto leading-relaxed">
            From Munna Bhai&apos;s jaadu ki jhappi to Raj&apos;s filmy advice —
            get life wisdom with a Bollywood twist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Shuru Karte Hain!
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                I have an account
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mentor preview strip */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex -space-x-2">
            {mentorPreviews.map((m) => (
              <motion.div
                key={m.name}
                className="w-11 h-11 rounded-full bg-[var(--card)] border-2 border-[var(--background)] flex items-center justify-center text-lg cursor-default"
                title={`${m.name} — ${m.tag}`}
                whileHover={{ scale: 1.2, zIndex: 10 }}
              >
                {m.emoji}
              </motion.div>
            ))}
          </div>
          <div className="text-sm text-[var(--muted)]">
            <span className="text-foreground font-medium">6 desi mentors</span>{" "}
            ready to chat
          </div>
        </motion.div>

        {/* Features grid — 4 columns on desktop */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-16 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-5 rounded-2xl glass hover:border-primary-500/20 transition-all group hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white mb-3 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-shadow">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-16 mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[
            { value: "6", label: "Desi Mentors" },
            { value: "8", label: "Quests" },
            { value: "3", label: "Depth Levels" },
            { value: "∞", label: "Filmy Dialogues" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl lg:text-2xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-xs text-[var(--muted)]/60 text-center mt-12 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          All personas are AI-generated characters inspired by Bollywood culture
          and public personalities. They do not represent any real individuals.
          For entertainment and reflection only.
        </motion.p>
      </main>
    </div>
  );
}
