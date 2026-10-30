"use client";

import { useEffect, type ReactNode } from "react";
import type { Chat, ChatOptions, View } from "@/lib/types";
import { DEMO_SIGN_IN_PATH, type DemoAccount } from "@/lib/demoAccounts";
import { AccountMenu } from "./AccountMenu";
import { DemoSignInMark } from "./DemoIdentity";
import { CodeIcon, DownloadIcon, FolderIcon, SearchIcon, ShapesIcon, ToolboxIcon } from "./ComposerIcons";
import { SidebarChatList } from "./SidebarChatList";
import { PanelIcon, PlusIcon } from "./SidebarIcons";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  chats: Chat[];
  activeId: string | null;
  view: View;
  displayName: string;
  /** Persona chosen on the demo sign-in page, or null for a guest */
  demoAccount: DemoAccount | null;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onNavigate: (view: View) => void;
  onOpenSearch: () => void;
  onExport: () => void;
  /** Opens the real claude.ai-style "Code" link: Dishant's LeetCode */
  codeUrl: string;
  // Account menu (Claude's "Name · Free ⌄" button)
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  onAsk: (prompt: string) => void;
  onResetSession: () => void;
  busy: boolean;
}

// Claude's Projects / Artifacts / Code / Customize, retargeted at the portfolio
const NAV: { view: Exclude<View, "chat">; label: string; icon: ReactNode }[] = [
  { view: "projects", label: "Projects", icon: <FolderIcon /> },
  { view: "stack", label: "Tech stack", icon: <ShapesIcon /> },
  { view: "customize", label: "Customize", icon: <ToolboxIcon /> },
];

const navRow =
  "flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-[14px] text-claude-body transition-colors hover:bg-claude-hover hover:text-claude-text";

export default function Sidebar({
  isOpen,
  isMobile,
  chats,
  activeId,
  view,
  displayName,
  demoAccount,
  onToggle,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onNavigate,
  onOpenSearch,
  onExport,
  codeUrl,
  options,
  onOptionsChange,
  onAsk,
  onResetSession,
  busy,
}: SidebarProps) {
  // Mobile drawer always shows full content; desktop collapses to an icon rail.
  const expanded = isOpen || isMobile;

  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, isOpen, onToggle]);

  const position = isMobile
    ? `fixed inset-y-0 left-0 w-72 shadow-xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`
    : expanded
      ? "w-72"
      : "w-14";

  return (
    <>
      {isMobile && (
        <div
          aria-hidden="true"
          onClick={onToggle}
          className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      )}

      <aside
        aria-label="Sidebar"
        aria-hidden={isMobile && !isOpen ? true : undefined}
        className={`z-50 flex h-full shrink-0 flex-col overflow-hidden border-r-[0.5px] border-claude-border bg-claude-sidebar transition-[width,transform] duration-300 ease-out ${position} ${
          isMobile && !isOpen ? "invisible" : ""
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-2">
          {expanded && (
            <button
              type="button"
              onClick={onNewChat}
              aria-label="Claude, go to home"
              title="Home"
              className="ml-1 rounded-md px-1 font-serif text-[22px] font-medium tracking-tight text-claude-text transition-opacity hover:opacity-80"
            >
              Claude
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label={isMobile ? "Close sidebar" : expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="flex size-9 items-center justify-center rounded-lg text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text"
          >
            <PanelIcon />
          </button>
        </div>

        <nav aria-label="Main" className="flex flex-col gap-0.5 px-2">
          <button
            type="button"
            onClick={onNewChat}
            title={expanded ? undefined : "New chat"}
            className="group flex h-10 w-full items-center gap-3 rounded-lg px-1.5 text-[14px] font-medium text-claude-text transition-colors hover:bg-claude-hover"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-claude-button text-white transition-transform group-hover:scale-105">
              <PlusIcon />
            </span>
            <span className={expanded ? "truncate" : "sr-only"}>New chat</span>
          </button>
          {NAV.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              aria-current={view === item.view ? "page" : undefined}
              title={expanded ? undefined : item.label}
              className={`${navRow} ${view === item.view ? "bg-claude-active text-claude-text" : ""}`}
            >
              <span className="shrink-0 text-claude-muted">{item.icon}</span>
              <span className={expanded ? "truncate" : "sr-only"}>{item.label}</span>
            </button>
          ))}
          <a href={codeUrl} target="_blank" rel="noopener noreferrer" title={expanded ? undefined : "Code"} className={navRow}>
            <span className="shrink-0 text-claude-muted">
              <CodeIcon />
            </span>
            <span className={expanded ? "flex min-w-0 flex-1 items-center justify-between" : "sr-only"}>
              <span className="truncate">Code</span>
              {expanded && (
                <span className="rounded-full border-[0.5px] border-claude-border px-2 py-0.5 text-[11px] text-claude-muted">
                  LeetCode
                </span>
              )}
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>

        {expanded ? (
          <SidebarChatList
            chats={chats}
            activeId={view === "chat" ? activeId : null}
            onNewChat={onNewChat}
            onSelectChat={onSelectChat}
            onDeleteChat={onDeleteChat}
            onRenameChat={onRenameChat}
            onOpenSearch={onOpenSearch}
          />
        ) : (
          <div className="flex-1" />
        )}

        {/* `relative` anchors the account menu so it spans the sidebar width */}
        <div className="relative shrink-0 border-t-[0.5px] border-claude-border p-2 pb-safe">
          {!demoAccount && (
            <a
              href={DEMO_SIGN_IN_PATH}
              title={expanded ? undefined : "Sign in"}
              className={`mb-1.5 flex h-9 items-center justify-center gap-2 rounded-lg bg-claude-button text-[14px] font-medium text-white transition-colors hover:bg-claude-button-hover ${
                expanded ? "w-full px-3" : "mx-auto w-9"
              }`}
            >
              <DemoSignInMark />
              <span className={expanded ? "" : "sr-only"}>Sign in</span>
            </a>
          )}
          <div className={`flex items-center gap-0.5 ${expanded ? "" : "flex-col"}`}>
            <AccountMenu
              displayName={displayName}
              demoAccount={demoAccount}
              expanded={expanded}
              options={options}
              onOptionsChange={onOptionsChange}
              onNavigate={onNavigate}
              onAsk={onAsk}
              onResetSession={onResetSession}
              busy={busy}
            />
            <button
              type="button"
              onClick={onExport}
              disabled={chats.length === 0}
              aria-label="Export chats as Markdown"
              title="Export chats"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              <DownloadIcon />
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search chats"
              title="Search chats (Ctrl+K)"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
