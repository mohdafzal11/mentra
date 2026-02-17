"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface XPEvent {
  id: string;
  amount: number;
  source: string;
}

export function XPPopup() {
  const [events, setEvents] = useState<XPEvent[]>([]);

  // Listen for custom XP events
  useEffect(() => {
    const handler = (e: CustomEvent<XPEvent>) => {
      setEvents((prev) => [...prev, e.detail]);
      setTimeout(() => {
        setEvents((prev) => prev.filter((ev) => ev.id !== e.detail.id));
      }, 2000);
    };

    window.addEventListener("xp-awarded" as string, handler as EventListener);
    return () =>
      window.removeEventListener(
        "xp-awarded" as string,
        handler as EventListener
      );
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-strong shadow-lg"
          >
            <span className="text-xp-gold font-bold text-sm">
              +{event.amount} XP
            </span>
            <span className="text-xs text-[var(--muted)]">
              {formatSource(event.source)}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatSource(source: string): string {
  const labels: Record<string, string> = {
    message: "Message sent",
    daily_first: "First today!",
    streak: "Streak bonus",
    quest: "Quest complete",
    onboarding: "Welcome bonus",
    level_up: "Level up!",
  };
  return labels[source] || source;
}

// Helper to dispatch XP events from anywhere
export function emitXPEvent(amount: number, source: string) {
  window.dispatchEvent(
    new CustomEvent("xp-awarded", {
      detail: {
        id: `${Date.now()}-${Math.random()}`,
        amount,
        source,
      },
    })
  );
}
