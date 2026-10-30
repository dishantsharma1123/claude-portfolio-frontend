"use client";

import { useEffect, useRef, useState } from "react";
import type { Chat, ChatOptions, Feedback } from "@/lib/types";
import { ChatInput } from "./ChatInput";
import { GhostIcon } from "./ComposerIcons";
import { EmptyState } from "./EmptyState";
import { MessageBubble } from "./MessageBubble";
import { VoiceMode } from "./VoiceMode";

interface ChatInterfaceProps {
  chat: Chat | null;
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  isStreaming: boolean;
  isBusy: boolean;
  isMobile: boolean;
  /** Visitor name from Customize, used in the home greeting */
  displayName: string;
  /** Incognito: the next chat (or the open one) is never saved */
  incognito: boolean;
  onToggleIncognito: () => void;
  onSend: (text: string) => void;
  onStop: () => void;
  onRetry: (messageId: string) => void;
  onFeedback: (messageId: string, feedback: Feedback | null) => void;
  onOpenSidebar: () => void;
  onNewChat: () => void;
}

export default function ChatInterface({
  chat,
  options,
  onOptionsChange,
  isStreaming,
  isBusy,
  isMobile,
  displayName,
  incognito,
  onToggleIncognito,
  onSend,
  onStop,
  onRetry,
  onFeedback,
  onOpenSidebar,
  onNewChat,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Follow the stream unless the user has scrolled up to read
  const stickToBottom = useRef(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const messages = chat?.messages ?? [];
  const lastContent = messages[messages.length - 1]?.content;

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    stickToBottom.current = true;
    scrollToBottom();
  }, [chat?.id, messages.length]);

  useEffect(() => {
    if (stickToBottom.current) scrollToBottom();
  }, [lastContent]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const hasMessages = messages.length > 0;
  const openVoice = () => setVoiceOpen(true);

  // Full-screen voice overlay; stays mounted across the home → chat transition
  const voiceMode = voiceOpen && (
    <VoiceMode
      onClose={() => setVoiceOpen(false)}
      onSend={onSend}
      isStreaming={isStreaming}
      isBusy={isBusy}
      lastMessage={messages[messages.length - 1]}
    />
  );

  const header = (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-transparent px-3">
      {isMobile && (
        <HeaderButton label="Open sidebar" onClick={onOpenSidebar}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </HeaderButton>
      )}
      {hasMessages ? (
        <h1 className="min-w-0 flex-1 truncate px-1 text-[14px] font-medium text-claude-body">
          {chat?.title}
        </h1>
      ) : (
        <div className="flex-1" />
      )}
      {hasMessages && incognito && (
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-claude-sidebar px-2.5 py-1 text-[12.5px] text-claude-muted">
          <GhostIcon size={14} />
          Incognito · not saved
        </span>
      )}
      {!hasMessages && (
        // Claude's top-right ghost: toggles incognito for the next chat
        <button
          type="button"
          onClick={onToggleIncognito}
          aria-pressed={incognito}
          aria-label="Incognito chat"
          title={incognito ? "Incognito on: this chat won't be saved" : "Start an incognito chat"}
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
            incognito
              ? "bg-claude-text text-white hover:bg-claude-body"
              : "text-claude-muted hover:bg-claude-hover hover:text-claude-text"
          }`}
        >
          <GhostIcon size={18} />
        </button>
      )}
      {isMobile && hasMessages && (
        <HeaderButton label="New chat" onClick={onNewChat}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </HeaderButton>
      )}
    </header>
  );

  // Same fragment slot in both views, so voice mode isn't remounted when the
  // first message switches the screen from home to the conversation.
  return (
    <>
      {hasMessages ? conversation() : home()}
      {voiceMode}
    </>
  );

  function home() {
    return (
      <div className="flex h-full flex-col">
        {header}
        <EmptyState
          displayName={displayName}
          incognito={incognito}
          options={options}
          onOptionsChange={onOptionsChange}
          onSend={onSend}
          onStop={onStop}
          isStreaming={isStreaming}
          isBusy={isBusy}
          onVoiceMode={openVoice}
        />
      </div>
    );
  }

  function conversation() {
    return (
    <div className="flex h-full flex-col">
      {header}

      <div ref={scrollRef} onScroll={handleScroll} className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-12 pt-4 sm:px-6">
          {messages.map((m, i) => {
            const isLast = i === messages.length - 1;
            return (
              <MessageBubble
                key={m.id}
                message={m}
                isLast={isLast}
                isStreaming={isStreaming && isLast && m.role === "assistant"}
                onRetry={() => onRetry(m.id)}
                onFeedback={(feedback) => onFeedback(m.id, feedback)}
              />
            );
          })}
        </div>
      </div>

      {/* Fade content out above the composer, like Claude.ai */}
      <div className="relative shrink-0 px-3 pb-safe sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-claude-bg to-transparent"
        />
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput
            placeholder="Reply to Claude…"
            options={options}
            onOptionsChange={onOptionsChange}
            onSend={onSend}
            onStop={onStop}
            isStreaming={isStreaming}
            disabled={isBusy}
            autoFocus
            onVoiceMode={openVoice}
          />
          <p className="py-2 text-center text-[12px] text-claude-faint">
            Claude can make mistakes. Please double-check responses.
          </p>
        </div>
      </div>
    </div>
    );
  }
}

function HeaderButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-claude-body transition-colors hover:bg-claude-hover"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}
