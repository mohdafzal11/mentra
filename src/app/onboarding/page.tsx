"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  Heart,
  Shield,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { PERSONA_SEEDS } from "@/lib/personas";

const intents = [
  {
    id: "growth",
    label: "Personal Growth",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Apna best version ban — like a Bollywood comeback story",
    color: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
  },
  {
    id: "career",
    label: "Career & Ambition",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Level up your career — filmy style hustle",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  },
  {
    id: "peace",
    label: "Inner Peace",
    icon: <Heart className="w-5 h-5" />,
    description: "Find calm in the chaos — All Izz Well vibes",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
  {
    id: "confidence",
    label: "Confidence",
    icon: <Shield className="w-5 h-5" />,
    description: "Main apni favourite hoon — build unshakeable self-belief",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  },
];

const starterPersonas = PERSONA_SEEDS.filter((p) => p.unlockLevel <= 1);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!selectedIntent || !selectedPersona) return;
    setLoading(true);

    try {
      // Update user intent and mark as onboarded
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: selectedIntent,
          onboarded: true,
        }),
      });

      if (res.ok) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step
                  ? "w-8 gradient-primary"
                  : "w-1.5 bg-[var(--border)]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Choose Intent */}
          {step === 0 && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">
                  What brings you here?
                </h1>
                <p className="text-sm text-[var(--muted)]">
                  This helps us personalize your journey
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {intents.map((intent) => (
                  <motion.button
                    key={intent.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      selectedIntent === intent.id
                        ? `bg-gradient-to-r ${intent.color} ring-2 ring-primary-500/50`
                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--muted)]/30"
                    }`}
                    onClick={() => setSelectedIntent(intent.id)}
                  >
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
                      {intent.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{intent.label}</h3>
                      <p className="text-xs text-[var(--muted)]">
                        {intent.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  disabled={!selectedIntent}
                  onClick={() => setStep(1)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Choose Starting Persona */}
          {step === 1 && (
            <motion.div
              key="persona"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">
                  Choose Your First Mentor
                </h1>
                <p className="text-sm text-[var(--muted)]">
                  More mentors unlock as you level up
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {starterPersonas.map((persona) => (
                  <motion.button
                    key={persona.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
                      selectedPersona === persona.name
                        ? "glass ring-2 ring-primary-500/50 border-primary-500/30"
                        : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--muted)]/30"
                    }`}
                    onClick={() => setSelectedPersona(persona.name)}
                  >
                    <div className="text-3xl">{persona.avatarEmoji}</div>
                    <div>
                      <h3 className="font-medium">{persona.name}</h3>
                      <p className="text-xs text-[var(--muted)] capitalize">
                        {persona.category}
                      </p>
                      <p className="text-sm text-[var(--muted)] mt-1 italic">
                        &ldquo;{persona.teaserLine}&rdquo;
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(0)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  disabled={!selectedPersona}
                  onClick={() => setStep(2)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Roadmap Preview */}
          {step === 2 && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Your Journey Ahead</h1>
                <p className="text-sm text-[var(--muted)]">
                  Unlock new mentors and deeper wisdom as you grow
                </p>
              </div>

              <div className="space-y-3">
                {PERSONA_SEEDS.map((persona, i) => {
                  const isUnlocked = persona.unlockLevel <= 1;
                  return (
                    <motion.div
                      key={persona.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border ${
                        isUnlocked
                          ? "glass border-primary-500/20"
                          : "bg-[var(--card)] border-[var(--border)] opacity-60"
                      }`}
                    >
                      <div className="text-2xl">{persona.avatarEmoji}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{persona.name}</h3>
                        <p className="text-xs text-[var(--muted)] italic">
                          &ldquo;{persona.teaserLine}&rdquo;
                        </p>
                      </div>
                      <div className="text-right">
                        {isUnlocked ? (
                          <span className="text-xs text-green-400">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">
                            Level {persona.unlockLevel}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                className="flex items-center justify-center gap-2 mt-6 p-3 rounded-xl glass"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-xp-gold" />
                <span className="text-sm text-xp-gold font-medium">
                  +75 XP Welcome Bonus!
                </span>
              </motion.div>

              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button onClick={handleComplete} loading={loading}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Chatting
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
