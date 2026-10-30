import type { Chat, Message } from "./types";

const STORAGE_KEY = "claude-portfolio-chats";

/**
 * Chats are stored per account: the guest keeps the original key (so existing
 * history stays with the guest) and each demo persona gets its own key.
 */
export function chatsKey(scope: string | null): string {
  return scope ? `${STORAGE_KEY}:${scope}` : STORAGE_KEY;
}

export function createId(): string {
  // randomUUID is only available in secure contexts (https / localhost)
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function titleFrom(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  return clean.length > 40 ? `${clean.slice(0, 40).trimEnd()}…` : clean;
}

function normalizeChat(value: unknown): Chat | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as { id?: unknown; title?: unknown; messages?: unknown; updatedAt?: unknown };
  if (typeof raw.id !== "string" || !Array.isArray(raw.messages)) return null;

  const messages: Message[] = [];
  for (const item of raw.messages) {
    if (!item || typeof item !== "object") continue;
    const { id, role, content, error, feedback } = item as Partial<Message>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    // Older builds rendered the SSE terminator as message text; strip it.
    const cleaned = content.replace(/\s*\[DONE\]\s*$/i, "");
    if (!cleaned.trim() && typeof error !== "string") continue;
    messages.push({
      id: typeof id === "string" ? id : createId(),
      role,
      content: cleaned,
      ...(typeof error === "string" ? { error } : {}),
      ...(role === "assistant" && (feedback === "up" || feedback === "down") ? { feedback } : {}),
    });
  }
  if (messages.length === 0) return null;

  const firstUser = messages.find((m) => m.role === "user");
  // Keep a title the visitor renamed; otherwise derive it from the first question
  const title = typeof raw.title === "string" && raw.title.trim() ? titleFrom(raw.title) : titleFrom(firstUser?.content ?? "");
  return {
    id: raw.id,
    title,
    messages,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
  };
}

export function loadChats(scope: string | null): Record<string, Chat> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(chatsKey(scope));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const result: Record<string, Chat> = {};
    for (const value of Object.values(parsed as Record<string, unknown>)) {
      const chat = normalizeChat(value);
      if (chat) result[chat.id] = chat;
    }
    return result;
  } catch {
    return {};
  }
}

export function saveChats(scope: string | null, chats: Record<string, Chat>): void {
  try {
    // Incognito chats live in memory only
    const persistent = Object.fromEntries(Object.entries(chats).filter(([, c]) => !c.temporary));
    window.localStorage.setItem(chatsKey(scope), JSON.stringify(persistent));
  } catch {
    // Storage full or unavailable (private mode) — history just won't persist.
  }
}
