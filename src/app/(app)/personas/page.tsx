"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { PersonaCard } from "@/components/persona/PersonaCard";
import { PERSONA_SEEDS } from "@/lib/personas";
import { chatStore } from "@/lib/chat-store";

export default function PersonasPage() {
  const router = useRouter();

  const startChat = (personaName: string) => {
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
          Meet Your Mentor ✨
        </h2>
        <p className="text-sm font-semibold gradient-text tracking-wide">
          AI trained on their personality
        </p>
        <p className="text-xs text-[var(--muted)] mt-1.5 tracking-wide font-medium">
          remembers you &amp; grows closer
        </p>
      </motion.div>

      {/* Persona list */}
      <div className="space-y-3">
        {PERSONA_SEEDS.map((persona, i) => (
          <motion.div
            key={persona.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <PersonaCard
              name={persona.name}
              teaserLine={persona.teaserLine}
              avatarEmoji={persona.avatarEmoji}
              avatarUrl={persona.avatarUrl}
              category={persona.category}
              unlockLevel={1}
              userLevel={1}
              isUnlocked={true}
              onClick={() => startChat(persona.name)}
            />
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] text-center mt-10">
        All personas are AI-generated characters inspired by public
        philosophies. No real-person impersonation.
      </p>
    </div>
  );
}
