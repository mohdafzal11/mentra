"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Users,
  Target,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { XPBar } from "@/components/gamification/XPBar";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { XPPopup } from "@/components/gamification/XPPopup";
import { LevelUpModal } from "@/components/gamification/LevelUpModal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserContext, type UserData } from "@/lib/user-context";

const navItems = [
  { href: "/chat", icon: MessageCircle, label: "Conversations" },
  { href: "/personas", icon: Users, label: "Mentors" },
  { href: "/quests", icon: Target, label: "Quests" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();

      // Check for level up
      if (user && data.user.level > user.level) {
        setLevelUpLevel(data.user.level);
      }

      setUser(data.user);

      if (!data.user.onboarded) {
        router.push("/onboarding");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router, user]);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-10 h-10 rounded-xl gradient-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <UserContext.Provider value={{ user, refreshUser: fetchUser }}>
      <div className="min-h-screen flex">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-white/5 md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 -ml-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <Link href="/chat" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-primary-500/20">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="font-bold text-sm">MimChat</span>
            </Link>
            <StreakBadge streak={user.streak} compact />
          </div>
        </div>

        {/* Sidebar overlay (mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={cn(
            "fixed z-50 top-0 left-0 h-screen w-[260px] bg-[#0d0d14] border-r border-white/[0.06] flex flex-col",
            "md:sticky md:top-0 md:z-auto md:shrink-0",
            "transition-transform duration-300 md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          {/* Logo */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between">
            <Link href="/chat" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/25">
                <span className="text-white font-bold text-base">M</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[15px] leading-tight">MimChat</span>
                <span className="text-[11px] text-[var(--muted)] leading-tight">
                  Filmy Mentorship
                </span>
              </div>
            </Link>
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-[var(--muted)]" />
            </button>
          </div>

          {/* User card with XP */}
          <div className="mx-4 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-[var(--muted)] truncate leading-tight mt-0.5">
                  Level {user.level} &middot; {user.xp} XP
                </p>
              </div>
              <StreakBadge streak={user.streak} compact />
            </div>
            <XPBar
              currentXP={user.xpProgress.currentLevelXP}
              nextLevelXP={user.xpProgress.nextLevelXP}
              progress={user.xpProgress.progress}
              level={user.level}
              compact
            />
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[var(--muted)]/50 font-semibold px-3 mb-1.5">
              Navigate
            </p>
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-primary-500/15 to-accent-500/10 text-white border border-primary-500/20"
                      : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    active
                      ? "gradient-primary text-white shadow-md shadow-primary-500/20"
                      : "bg-white/[0.04] text-[var(--muted)]"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Logout */}
          <div className="px-3 pb-5 pt-3 border-t border-white/[0.04] mt-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] font-medium text-[var(--muted)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              Log Out
            </button>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 md:ml-0 mt-14 md:mt-0 min-h-screen">
          {children}
        </main>

        {/* XP Popup */}
        <XPPopup />

        {/* Level Up Modal */}
        <LevelUpModal
          isOpen={levelUpLevel !== null}
          newLevel={levelUpLevel || 1}
          onClose={() => setLevelUpLevel(null)}
        />
      </div>
    </UserContext.Provider>
  );
}
