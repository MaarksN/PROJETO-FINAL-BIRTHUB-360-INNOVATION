// [SOURCE] BirthHub360 — Remediação Forense.html — GAP-002
import { HistoryItem, ModuleType } from "../types";

const HISTORY_KEY = 'birthhub_history';
const CHAT_HISTORY_KEY = "birthhub_chat_history";

export type ChatHistoryItem = {
    role: "user" | "model";
    text: string;
    timestamp: number;
};

export const saveHistory = (toolName: string, module: ModuleType, content: string) => {
    if (typeof window === 'undefined') return { id: '', toolName, module, content, timestamp: 0 };

    const item: HistoryItem = {
        id: Date.now().toString(),
        toolName,
        module,
        content,
        timestamp: Date.now()
    };

    const existing = getHistory();
    const updated = [item, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return item;
};

export const getHistory = (): HistoryItem[] => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
};

export const saveChatHistory = (messages: ChatHistoryItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-100)));
};

export const getChatHistory = (): ChatHistoryItem[] => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ChatHistoryItem[]) : [];
};
