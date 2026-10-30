"use client";

import { useState } from "react";
import { RESUME_URL } from "@/lib/profile";
import type { ChatOptions } from "@/lib/types";
import { ClaudeLogo } from "./ClaudeLogo";
import { ChatInput } from "./ChatInput";
import { CloseIcon, GhostIcon, LightbulbIcon } from "./ComposerIcons";
import { ALL_PROMPTS, CATEGORIES } from "./homeSuggestions";

interface EmptyStateProps {
  displayName: string;
  incognito: boolean;
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  isBusy: boolean;
  onVoiceMode: () => void;
}

// Claude's time-aware greeting, e.g. "Up late, Dishant Sharma?"
function greeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 5) return name ? `Up late, ${name}?` : "Up late?";
  const base = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return name ? `${base}, ${name}` : base;
}

const chipClass =
  "flex h-8 items-center gap-1.5 rounded-lg border-[0.5px] border-claude-border bg-claude-bg px-2.5 text-[13.5px] text-claude-body transition-colors hover:bg-claude-hover hover:text-claude-text disabled:cursor-not-allowed disabled:opacity-50";

export function EmptyState({
  displayName,
  incognito,
  options,
  onOptionsChange,
  onSend,
  onStop,
  isStreaming,
  isBusy,
  onVoiceMode,
}: EmptyStateProps) {
  // Claude swaps the chip row for a prompt list when a category is picked
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? null;

  const send = (prompt: string) => {
    setCategoryId(null);
    onSend(prompt);
  };

  // "Claude's choice" → random portfolio question
  const surprise = () => send(ALL_PROMPTS[Math.floor(Math.random() * ALL_PROMPTS.length)]);

  return (
    <div className="scrollbar-thin flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-[12vh] pt-6">
      <div className="w-full max-w-2xl">
        {/* Claude's "Free plan · Upgrade" pill, repurposed as a resume download */}
        <div className="mb-6 flex justify-center">
          <p className="flex items-center gap-1.5 rounded-full bg-claude-sidebar px-3 py-1 text-[12.5px] text-claude-muted">
            <span>Portfolio assistant</span>
            <span aria-hidden="true">·</span>
            <a
              href={RESUME_URL}
              download
              className="font-medium text-claude-body underline-offset-2 hover:text-claude-text hover:underline"
            >
              Download resume
            </a>
          </p>
        </div>

        <h1 className="mb-8 flex items-center justify-center gap-3 text-center font-serif text-[32px] font-light leading-tight text-claude-text sm:text-[40px]">
          {incognito ? (
            <span className="text-claude-muted">
              <GhostIcon size={36} />
            </span>
          ) : (
            <ClaudeLogo squeezable className="size-8 sm:size-10" />
          )}
          <span>{incognito ? "Incognito chat" : greeting(displayName)}</span>
        </h1>
        {incognito && (
          <p className="-mt-5 mb-6 text-center text-[13.5px] text-claude-muted">
            This chat won&apos;t be saved to your history.
          </p>
        )}

        <ChatInput
          placeholder="Ask anything about Dishant…"
          options={options}
          onOptionsChange={onOptionsChange}
          menuPlacement="bottom"
          onSend={send}
          onStop={onStop}
          isStreaming={isStreaming}
          disabled={isBusy}
          onVoiceMode={onVoiceMode}
          autoFocus
        />

        {category ? (
          <div className="claude-fade-in mt-3 rounded-xl border-[0.5px] border-claude-border bg-white/60 p-1.5">
            <div className="flex items-center justify-between px-2.5 py-1">
              <p className="flex items-center gap-2 text-[13px] font-medium text-claude-muted">
                {category.icon}
                {category.label}
              </p>
              <button
                type="button"
                onClick={() => setCategoryId(null)}
                aria-label="Close suggestions"
                className="rounded-md p-1 text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text"
              >
                <CloseIcon />
              </button>
            </div>
            <ul>
              {category.prompts.map((prompt) => (
                <li key={prompt} className="border-t-[0.5px] border-claude-border first:border-t-0">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => send(prompt)}
                    className="block w-full rounded-lg px-2.5 py-2 text-left text-[14px] text-claude-body transition-colors hover:bg-claude-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={isBusy}
                onClick={() => setCategoryId(c.id)}
                className={chipClass}
              >
                <span className="text-claude-muted">{c.icon}</span>
                {c.label}
              </button>
            ))}
            <button type="button" disabled={isBusy} onClick={surprise} className={chipClass}>
              <span className="text-claude-muted">
                <LightbulbIcon />
              </span>
              Dishant AI&apos;s choice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
