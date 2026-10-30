"use client";

import { PROJECTS } from "@/lib/portfolio";
import { ChatBubbleIcon, FolderIcon } from "./ComposerIcons";
import { PageShell } from "./PageShell";

interface ProjectsViewProps {
  onAsk: (prompt: string) => void;
  disabled: boolean;
  isMobile: boolean;
  onOpenSidebar: () => void;
}

/** Claude's "Projects" page, listing Dishant's portfolio projects. */
export function ProjectsView({ onAsk, disabled, isMobile, onOpenSidebar }: ProjectsViewProps) {
  return (
    <PageShell
      title="Projects"
      subtitle="Things Dishant has built. Ask about any of them to go deeper."
      isMobile={isMobile}
      onOpenSidebar={onOpenSidebar}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {PROJECTS.map((p) => (
          <li
            key={p.id}
            className="flex flex-col rounded-xl border-[0.5px] border-claude-border bg-white p-4 transition-shadow hover:shadow-[0_0.25rem_1.25rem_rgba(0,0,0,0.05)]"
          >
            <div className="mb-2 flex items-center gap-2 text-claude-muted">
              <FolderIcon />
              <h2 className="font-serif text-[17px] font-medium text-claude-text">{p.name}</h2>
            </div>
            <p className="mb-3 text-[14px] text-claude-body">{p.tagline}</p>
            <ul className="mb-3 list-disc space-y-1 pl-5 text-[13.5px] text-claude-body">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <ul aria-label="Technologies" className="mb-4 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full bg-claude-sidebar px-2 py-0.5 text-[12px] text-claude-muted">
                  {s}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onAsk(p.prompt)}
              className="mt-auto flex h-8 items-center gap-1.5 self-start rounded-lg border-[0.5px] border-claude-border px-2.5 text-[13.5px] text-claude-body transition-colors hover:bg-claude-hover hover:text-claude-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChatBubbleIcon size={14} />
              Ask about this
            </button>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
