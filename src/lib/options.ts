import type { ChatMode, ChatOptions, ReplyLanguage, ResponseStyle } from "./types";

// Must match MODELS in backend/app/main.py; the backend ignores unknown ids.
export const MODELS = [
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super",
    description: "Most capable for detailed answers",
  },
  {
    id: "cohere/north-mini-code:free",
    name: "North Mini",
    description: "Lightweight and quick",
  },
] as const;

// Must match STYLE_INSTRUCTIONS in backend/app/main.py.
export const STYLES: { id: ResponseStyle; name: string; description: string }[] = [
  { id: "normal", name: "Normal", description: "Default responses" },
  { id: "concise", name: "Concise", description: "Shorter, to-the-point answers" },
  { id: "explanatory", name: "Explanatory", description: "Explains the engineering behind his work" },
  { id: "formal", name: "Formal", description: "Polished tone for recruiters" },
];

// Must match MODE_INSTRUCTIONS in backend/app/main.py.
export const MODES: { id: ChatMode; name: string; description: string }[] = [
  { id: "chat", name: "Chat", description: "Ask about Dishant" },
  { id: "interview", name: "Interview", description: "Dishant answers in first person" },
];

// Must match LANGUAGE_INSTRUCTIONS in backend/app/main.py.
export const LANGUAGES: { id: ReplyLanguage; name: string }[] = [
  { id: "auto", name: "Auto (match your message)" },
  { id: "en", name: "English" },
  { id: "hi", name: "हिन्दी (Hindi)" },
  { id: "es", name: "Español" },
  { id: "fr", name: "Français" },
  { id: "de", name: "Deutsch" },
];

export const DEFAULT_OPTIONS: ChatOptions = {
  model: MODELS[0].id,
  style: "normal",
  inDepth: false,
  mode: "chat",
  language: "auto",
};

const STORAGE_KEY = "claude-portfolio-options";

export function loadOptions(): ChatOptions {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<ChatOptions> | null;
    if (!raw || typeof raw !== "object") return DEFAULT_OPTIONS;
    return {
      model: MODELS.some((m) => m.id === raw.model) ? (raw.model as string) : DEFAULT_OPTIONS.model,
      style: STYLES.some((s) => s.id === raw.style) ? (raw.style as ResponseStyle) : DEFAULT_OPTIONS.style,
      inDepth: raw.inDepth === true,
      mode: MODES.some((m) => m.id === raw.mode) ? (raw.mode as ChatMode) : DEFAULT_OPTIONS.mode,
      language: LANGUAGES.some((l) => l.id === raw.language)
        ? (raw.language as ReplyLanguage)
        : DEFAULT_OPTIONS.language,
    };
  } catch {
    return DEFAULT_OPTIONS;
  }
}

export function saveOptions(options: ChatOptions): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch {
    // Storage unavailable — options just won't persist.
  }
}
