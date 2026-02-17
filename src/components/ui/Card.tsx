"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={cn(
        "rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5",
        hover && "cursor-pointer hover:border-primary-500/30 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
