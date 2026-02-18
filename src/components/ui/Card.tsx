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
        "rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 shadow-sm",
        hover && "cursor-pointer hover:border-primary-500/40 hover:shadow-md transition-all",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
