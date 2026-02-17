"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PersonaCard } from "@/components/persona/PersonaCard";
import { useUser } from "@/lib/user-context";
import { PERSONA_SEEDS } from "@/lib/personas";

// Build emoji lookup from seed data
const personaEmojis: Record<string, string> = Object.fromEntries(
  PERSONA_SEEDS.map((p) => [p.name, p.avatarEmoji])
);

interface Persona {
  id: string;
  name: string;
  inspirationSource: string;
  tone: string;
  unlockLevel: number;
  category: string;
  teaserLine: string;
  isUnlocked: boolean;
  depths: { depthLevel: number; description: string; unlockLevel: number }[];
}

export default function PersonasPage() {
  const { user } = useUser();
  const router = useRouter();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const res = await fetch("/api/personas");
      if (res.ok) {
        const data = await res.json();
        setPersonas(data.personas);
      }
    } catch (error) {
      console.error("Fetch personas error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (personaId: string) => {
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
      console.error("Start chat error:", error);
    }
  };

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Mentors</h1>
        <p className="text-sm text-[var(--muted)]">
          Unlock new mentors as you level up. Currently Level {user?.level || 1}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-[var(--card)] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {personas.map((persona, i) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PersonaCard
                name={persona.name}
                teaserLine={persona.teaserLine}
                avatarEmoji={personaEmojis[persona.name] || "🤖"}
                category={persona.category}
                unlockLevel={persona.unlockLevel}
                userLevel={user?.level || 1}
                isUnlocked={persona.isUnlocked}
                onClick={() => startChat(persona.id)}
              />

              {/* Depth levels */}
              {persona.isUnlocked && persona.depths.length > 0 && (
                <div className="ml-12 mt-2 mb-3 space-y-1">
                  {persona.depths.map((depth) => {
                    const unlocked =
                      depth.unlockLevel <= (user?.level || 1);
                    return (
                      <div
                        key={depth.depthLevel}
                        className={`flex items-center gap-2 text-xs ${
                          unlocked
                            ? "text-primary-400"
                            : "text-[var(--muted)]/50"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            unlocked
                              ? "gradient-primary"
                              : "bg-[var(--border)]"
                          }`}
                        />
                        <span>{depth.description}</span>
                        {!unlocked && (
                          <span className="text-[var(--muted)]/30">
                            (Lvl {depth.unlockLevel})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--muted)]/60 text-center mt-8">
        All personas are AI-generated characters inspired by public
        philosophies. No real-person impersonation.
      </p>
    </div>
  );
}
