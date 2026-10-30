export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  /** Set when the assistant response failed; rendered as an inline alert. */
  error?: string;
  /** Visitor's thumbs up / down on an assistant reply (stored locally only) */
  feedback?: Feedback;
}

export type Feedback = "up" | "down";

export type ResponseStyle = "normal" | "concise" | "explanatory" | "formal";

/** Main-area screens reachable from the sidebar */
export type View = "chat" | "projects" | "stack" | "customize";

/** Claude's Chat / Cowork toggle: "interview" answers in first person as Dishant */
export type ChatMode = "chat" | "interview";

/** Reply language from the account menu; "auto" answers in the visitor's language */
export type ReplyLanguage = "auto" | "en" | "hi" | "es" | "fr" | "de";

/** Composer settings sent with every request (Claude's model / style / thinking controls). */
export interface ChatOptions {
  model: string;
  style: ResponseStyle;
  inDepth: boolean;
  mode: ChatMode;
  language: ReplyLanguage;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  /** Incognito chat: never persisted or listed in the sidebar */
  temporary?: boolean;
}
