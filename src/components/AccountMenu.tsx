"use client";

import { useEffect, useId, useRef, useState } from "react";
import { EMAIL } from "@/lib/profile";
import type { DemoAccount } from "@/lib/demoAccounts";
import type { ChatOptions, View } from "@/lib/types";
import { ChevronDownIcon } from "./ComposerIcons";
import { AccountMenuPanel, type AccountPage } from "./AccountMenuPanel";
import { DemoAvatar } from "./DemoIdentity";

interface AccountMenuProps {
  displayName: string;
  demoAccount: DemoAccount | null;
  /** False when the desktop sidebar is collapsed to the icon rail */
  expanded: boolean;
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  onNavigate: (view: View) => void;
  /** Starts a fresh chat with this question */
  onAsk: (prompt: string) => void;
  onResetSession: () => void;
  /** A reply is streaming, so "ask" items are disabled */
  busy: boolean;
}

/** "Jane Doe" → "JD"; falls back to "G" for guests */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "G";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

/**
 * Claude's account button at the bottom of the sidebar ("Name · Free ⌄") and
 * the menu it opens, retargeted at the portfolio. The panel is positioned
 * against the nearest `relative` ancestor (the sidebar footer), so it spans
 * the full sidebar width like Claude's.
 */
export function AccountMenu({ displayName, demoAccount, expanded, ...panelProps }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<AccountPage>("main");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const close = (returnFocus = false) => {
    setOpen(false);
    setPage("main");
    if (returnFocus) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setPage("main");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setPage("main");
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = displayName || "Guest";

  return (
    <div ref={rootRef} className={expanded ? "min-w-0 flex-1" : ""}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="true"
        aria-label={`Account menu for ${name}`}
        title={expanded ? undefined : name}
        className={`flex w-full min-w-0 items-center gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-claude-hover ${
          open ? "bg-claude-hover" : ""
        }`}
      >
        {demoAccount ? <DemoAvatar key={demoAccount.id} account={demoAccount} /> : <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-claude-active text-[11px] font-medium text-claude-body"
        >
          {initials(displayName)}
        </span>}
        {expanded && (
          <>
            <span className="min-w-0 flex-1 truncate text-[14px] text-claude-text">
              {name}
              <span className="text-claude-muted"> · {demoAccount ? "Signed in" : "Not signed in"}</span>
            </span>
            <span className={`shrink-0 text-claude-muted transition-transform ${open ? "rotate-180" : ""}`}>
              <ChevronDownIcon />
            </span>
          </>
        )}
      </button>

      {open && (
        <div
          id={id}
          role="group"
          aria-label="Account"
          className={`claude-fade-in z-30 rounded-xl border-[0.5px] border-claude-border bg-white p-1.5 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.1)] ${
            // Collapsed rail: the sidebar clips overflow, so escape it with fixed positioning
            expanded ? "absolute inset-x-2 bottom-full mb-1" : "fixed bottom-16 left-2 w-64"
          }`}
        >
          <AccountMenuPanel
            {...panelProps}
            demoAccount={demoAccount}
            email={EMAIL}
            page={page}
            onPage={setPage}
            onClose={() => close(true)}
          />
        </div>
      )}
    </div>
  );
}
