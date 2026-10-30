"use client";

import { LANGUAGES } from "@/lib/options";
import { LEETCODE_URL } from "@/lib/profile";
import type { ChatOptions, View } from "@/lib/types";
import { ChatBubbleIcon, ChevronLeftIcon, CodeIcon, ExternalIcon, FolderIcon, InfoIcon, ShapesIcon } from "./ComposerIcons";
import { MenuItem } from "./Popover";

/** Sub-page header with a back button (Claude's "Language ›" and "Learn more ›") */
function BackHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-0.5 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text"
    >
      <ChevronLeftIcon />
      {label}
    </button>
  );
}

export function LanguagePage({
  options,
  onOptionsChange,
  onBack,
  onClose,
}: {
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <BackHeader label="Reply language" onBack={onBack} />
      {LANGUAGES.map((l) => (
        <MenuItem
          key={l.id}
          label={l.name}
          selected={options.language === l.id}
          onClick={() => {
            onOptionsChange({ ...options, language: l.id });
            onClose();
          }}
        />
      ))}
    </>
  );
}

export function LearnPage({
  busy,
  onAsk,
  onGo,
  onBack,
  onClose,
}: {
  busy: boolean;
  onAsk: (prompt: string) => void;
  onGo: (view: View) => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <BackHeader label="Learn more" onBack={onBack} />
      <MenuItem icon={<ChatBubbleIcon />} label="About Dishant" disabled={busy} onClick={() => onAsk("Who is Dishant Sharma?")} />
      <MenuItem icon={<FolderIcon />} label="Projects" onClick={() => onGo("projects")} />
      <MenuItem icon={<ShapesIcon />} label="Tech stack" onClick={() => onGo("stack")} />
      <MenuItem
        icon={<InfoIcon />}
        label="How this portfolio works"
        disabled={busy}
        onClick={() => onAsk("How was this AI portfolio assistant built?")}
      />
      <MenuItem
        icon={<CodeIcon />}
        label="LeetCode profile"
        href={LEETCODE_URL}
        external
        trailing={<ExternalIcon />}
        onClick={onClose}
      />
    </>
  );
}

export function LogoutPage({
  demoName,
  onConfirm,
  onBack,
}: {
  /** Set when a demo persona is signed in */
  demoName?: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="p-2">
      <p className="text-[14px] font-medium text-claude-text">
        {demoName ? `Log out of ${demoName}?` : "Log out of this guest session?"}
      </p>
      <p className="mb-3 mt-1 text-[13px] leading-snug text-claude-muted">
        {demoName
          ? "Your chats stay saved with this profile in this browser and come back when you sign in as it again."
          : "You'll return to the guest session."}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-8 items-center rounded-lg bg-[#B42318] px-3 text-[13.5px] text-white transition-colors hover:bg-[#912018]"
        >
          Log out
        </button>
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 items-center rounded-lg border-[0.5px] border-claude-border px-3 text-[13.5px] text-claude-body transition-colors hover:bg-claude-hover"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
