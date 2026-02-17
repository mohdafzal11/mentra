"use client";

import { createContext, useContext } from "react";

export interface UserData {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  intent: string | null;
  onboarded: boolean;
  xpProgress: {
    level: number;
    currentLevelXP: number;
    nextLevelXP: number;
    progress: number;
  };
}

export const UserContext = createContext<{
  user: UserData | null;
  refreshUser: () => Promise<void>;
}>({ user: null, refreshUser: async () => {} });

export const useUser = () => useContext(UserContext);
