"use client";

export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface StoredChat {
  id: string;
  personaName: string;
  title: string | null;
  messages: StoredMessage[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "mimchat_chats";

function readStore(): Record<string, StoredChat> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, StoredChat>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function generateId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const chatStore = {
  getChats(): StoredChat[] {
    const store = readStore();
    return Object.values(store).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getChat(id: string): StoredChat | null {
    const store = readStore();
    return store[id] || null;
  },

  createChat(personaName: string): string {
    const store = readStore();
    const id = generateId();
    const now = new Date().toISOString();
    store[id] = {
      id,
      personaName,
      title: null,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    writeStore(store);
    return id;
  },

  addMessage(chatId: string, role: "user" | "assistant", content: string) {
    const store = readStore();
    const chat = store[chatId];
    if (!chat) return;
    chat.messages.push({
      role,
      content,
      createdAt: new Date().toISOString(),
    });
    chat.updatedAt = new Date().toISOString();
    writeStore(store);
  },

  updateTitle(chatId: string, title: string) {
    const store = readStore();
    const chat = store[chatId];
    if (!chat) return;
    chat.title = title;
    writeStore(store);
  },

  deleteChat(chatId: string) {
    const store = readStore();
    delete store[chatId];
    writeStore(store);
  },
};
