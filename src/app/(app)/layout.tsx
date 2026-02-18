"use client";

import { UserContext, type UserData } from "@/lib/user-context";

const defaultUser: UserData = {
  id: "local-user",
  name: "User",
  email: "user@mentra.app",
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  intent: null,
  onboarded: true,
  xpProgress: { level: 1, currentLevelXP: 0, nextLevelXP: 100, progress: 0 },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={{ user: defaultUser, refreshUser: async () => {} }}>
      <main className="min-h-screen">
        {children}
      </main>
    </UserContext.Provider>
  );
}
