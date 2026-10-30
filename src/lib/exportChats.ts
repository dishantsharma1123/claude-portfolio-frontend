import type { Chat } from "./types";

/** Renders conversations as a single Markdown document (Claude's "Export data"). */
export function chatsToMarkdown(chats: Chat[]): string {
  const sections = chats.map((chat) => {
    const date = new Date(chat.updatedAt).toLocaleString();
    const body = chat.messages
      .filter((m) => m.content.trim())
      .map((m) => `**${m.role === "user" ? "You" : "Dishant AI"}:**\n\n${m.content.trim()}`)
      .join("\n\n");
    return `## ${chat.title}\n\n_${date}_\n\n${body}`;
  });
  return `# Conversations about Dishant Sharma\n\n${sections.join("\n\n---\n\n")}\n`;
}

export function downloadText(filename: string, text: string, type = "text/markdown"): void {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
