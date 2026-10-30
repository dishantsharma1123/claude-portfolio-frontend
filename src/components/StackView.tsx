"use client";

import { SKILL_GROUPS } from "@/lib/portfolio";
import { ChatBubbleIcon } from "./ComposerIcons";
import { PageShell } from "./PageShell";

interface StackViewProps {
  onAsk: (prompt: string) => void;
  disabled: boolean;
  isMobile: boolean;
  onOpenSidebar: () => void;
}

/** Claude's "Artifacts" slot, repurposed as an interactive tech stack overview. */
export function StackView({ onAsk, disabled, isMobile, onOpenSidebar }: StackViewProps) {
  return (
    <PageShell
      title="Tech stack"
      subtitle="Tools and technologies from Dishant's resume. Click a skill to ask about it."
      isMobile={isMobile}
      onOpenSidebar={onOpenSidebar}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {SKILL_GROUPS.map((g) => (
          <section key={g.label} className="rounded-xl border-[0.5px] border-claude-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[14px] font-medium text-claude-text">{g.label}</h2>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onAsk(g.prompt)}
                aria-label={`Ask about ${g.label}`}
                title={`Ask about ${g.label}`}
                className="rounded-md p-1 text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChatBubbleIcon size={14} />
              </button>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onAsk(`What has Dishant done with ${item}?`)}
                    className="rounded-full border-[0.5px] border-claude-border bg-claude-bg px-2.5 py-1 text-[13px] text-claude-body transition-colors hover:border-claude-accent/50 hover:bg-claude-accent/10 hover:text-claude-button disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
