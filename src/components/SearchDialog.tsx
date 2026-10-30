"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Chat } from "@/lib/types";
import { SearchIcon } from "./ComposerIcons";

interface SearchDialogProps {
  chats: Chat[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

/** Returns a short snippet around the first match, or null if the chat doesn't match */
function match(chat: Chat, q: string): string | null {
  if (!q) return chat.messages.find((m) => m.role === "assistant")?.content.slice(0, 90) ?? "";
  if (chat.title.toLowerCase().includes(q)) return chat.messages[0]?.content.slice(0, 90) ?? "";
  for (const m of chat.messages) {
    const i = m.content.toLowerCase().indexOf(q);
    if (i !== -1) {
      const start = Math.max(0, i - 30);
      return `${start > 0 ? "…" : ""}${m.content.slice(start, i + q.length + 60)}`;
    }
  }
  return null;
}

/** Claude's chat search (Ctrl/⌘+K): filters by title and message text. */
export function SearchDialog({ chats, onSelect, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chats.flatMap((chat) => {
      const snippet = match(chat, q);
      return snippet === null ? [] : [{ chat, snippet: snippet.replace(/\s+/g, " ") }];
    });
  }, [chats, query]);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previousFocus.current?.focus();
  }, []);

  useEffect(() => setCursor(0), [query]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      onSelect(results[cursor].chat.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/25 px-4 pt-[12vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search chats"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="claude-fade-in w-full max-w-lg overflow-hidden rounded-2xl border-[0.5px] border-claude-border bg-white shadow-[0_1rem_3rem_rgba(0,0,0,0.15)]"
      >
        <div className="flex items-center gap-2 border-b-[0.5px] border-claude-border px-4">
          <span className="text-claude-muted">
            <SearchIcon />
          </span>
          <label htmlFor="chat-search" className="sr-only">
            Search chats
          </label>
          <input
            id="chat-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats…"
            role="combobox"
            aria-expanded="true"
            aria-controls="chat-search-results"
            aria-activedescendant={results[cursor] ? `search-${results[cursor].chat.id}` : undefined}
            className="h-12 flex-1 bg-transparent text-[16px] text-claude-text placeholder:text-claude-faint focus:outline-none"
          />
          <kbd className="rounded border-[0.5px] border-claude-border px-1.5 text-[11px] text-claude-muted">Esc</kbd>
        </div>
        <ul id="chat-search-results" role="listbox" aria-label="Results" className="scrollbar-thin max-h-[50vh] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-[14px] text-claude-muted">
              {chats.length === 0 ? "No conversations yet." : "No chats match your search."}
            </li>
          ) : (
            results.map(({ chat, snippet }, i) => (
              <li
                key={chat.id}
                id={`search-${chat.id}`}
                role="option"
                aria-selected={i === cursor}
                onMouseEnter={() => setCursor(i)}
                onClick={() => onSelect(chat.id)}
                className={`cursor-pointer rounded-lg px-3 py-2 ${i === cursor ? "bg-claude-hover" : ""}`}
              >
                <p className="truncate text-[14px] text-claude-text">{chat.title}</p>
                {snippet && <p className="truncate text-[12.5px] text-claude-muted">{snippet}</p>}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
