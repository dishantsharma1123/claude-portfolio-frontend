"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Chat } from "@/lib/types";
import { PencilIcon, SearchIcon } from "./ComposerIcons";
import { PlusIcon, TrashIcon } from "./SidebarIcons";

interface SidebarChatListProps {
  chats: Chat[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onOpenSearch: () => void;
}

const rowAction =
  "rounded-md p-1 text-claude-muted opacity-0 transition-opacity hover:bg-claude-border hover:text-claude-text focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";

/** Claude's "Chats and tasks" list with inline rename and delete. */
export function SidebarChatList({
  chats,
  activeId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onOpenSearch,
}: SidebarChatListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) inputRef.current?.select();
  }, [editingId]);

  const startRename = (chat: Chat) => {
    setDraft(chat.title);
    setEditingId(chat.id);
  };

  const commit = () => {
    if (editingId && draft.trim()) onRenameChat(editingId, draft);
    setEditingId(null);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <div className="mt-4 flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-4 pb-1">
        <h2 className="text-xs font-medium text-claude-muted">Chats</h2>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onNewChat}
            aria-label="New chat"
            title="New chat"
            className="rounded-md p-1 text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text"
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search chats"
            title="Search chats"
            className="rounded-md p-1 text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text"
          >
            <SearchIcon size={14} />
          </button>
        </div>
      </div>
      <ul className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-2">
        {chats.length === 0 ? (
          <li className="px-2 py-1.5 text-[13px] text-claude-faint">No conversations yet</li>
        ) : (
          chats.map((chat) => {
            const active = chat.id === activeId;
            if (editingId === chat.id) {
              return (
                <li key={chat.id} className="px-0.5 py-0.5">
                  <label htmlFor={`rename-${chat.id}`} className="sr-only">
                    Rename conversation
                  </label>
                  <input
                    id={`rename-${chat.id}`}
                    ref={inputRef}
                    value={draft}
                    maxLength={80}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKey}
                    onBlur={commit}
                    className="w-full rounded-lg border-[0.5px] border-claude-accent/50 bg-white px-2 py-1 text-[13.5px] text-claude-text focus:outline-none"
                  />
                </li>
              );
            }
            return (
              <li key={chat.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelectChat(chat.id)}
                  aria-current={active ? "page" : undefined}
                  className={`block w-full truncate rounded-lg py-1.5 pl-2 pr-14 text-left text-[13.5px] text-claude-body transition-colors ${
                    active ? "bg-claude-active" : "hover:bg-claude-hover"
                  }`}
                >
                  {chat.title}
                </button>
                <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
                  <button
                    type="button"
                    onClick={() => startRename(chat)}
                    aria-label={`Rename conversation: ${chat.title}`}
                    className={rowAction}
                  >
                    <PencilIcon size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteChat(chat.id)}
                    aria-label={`Delete conversation: ${chat.title}`}
                    className={rowAction}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
