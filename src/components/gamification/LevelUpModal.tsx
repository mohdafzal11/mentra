"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { Star, Sparkles } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, newLevel, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-[90%] max-w-sm p-8 rounded-3xl glass-strong text-center"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full gradient-primary"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 6) * 80,
                  y: Math.sin((i * Math.PI * 2) / 6) * 80,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                style={{
                  left: "50%",
                  top: "30%",
                }}
              />
            ))}

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-8 h-8 text-xp-gold" />
            </motion.div>

            <h2 className="text-xl font-bold gradient-text mb-2">Level Up!</h2>

            <motion.div
              className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl gradient-primary shadow-lg shadow-primary-500/30"
              animate={{
                boxShadow: [
                  "0 10px 25px rgba(217, 70, 239, 0.3)",
                  "0 10px 40px rgba(217, 70, 239, 0.5)",
                  "0 10px 25px rgba(217, 70, 239, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-white" />
                <span className="text-3xl font-bold text-white">
                  {newLevel}
                </span>
              </div>
            </motion.div>

            <p className="text-[var(--muted)] text-sm mb-6">
              {newLevel >= 15
                ? "You've entered the inner circle. Deepest wisdom awaits."
                : newLevel >= 5
                  ? "New depths unlocked. Your mentors will speak more freely."
                  : "Keep going! New personas and wisdom await."}
            </p>

            <Button onClick={onClose} className="w-full">
              Continue Journey
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
