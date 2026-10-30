"use client";

import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  subtitle?: string;
  isMobile: boolean;
  onOpenSidebar: () => void;
  children: ReactNode;
}

/** Shared layout for the non-chat sidebar pages (Projects, Tech stack, Customize). */
export function PageShell({ title, subtitle, isMobile, onOpenSidebar, children }: PageShellProps) {
  return (
    <div className="flex h-full flex-col">
      {isMobile && (
        <header className="flex h-14 shrink-0 items-center px-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            className="flex size-10 items-center justify-center rounded-lg text-claude-body transition-colors hover:bg-claude-hover"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </header>
      )}
      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="claude-fade-in mx-auto w-full max-w-3xl px-4 pb-12 pt-6 sm:px-6 sm:pt-12">
          <h1 className="font-serif text-[28px] font-light text-claude-text sm:text-[32px]">{title}</h1>
          {subtitle && <p className="mb-6 mt-1 text-[14px] text-claude-muted">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
