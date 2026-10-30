"use client";

import { useId, useState } from "react";
import { MODELS, MODES, STYLES } from "@/lib/options";
import { EMAIL, LEETCODE_URL, LINKEDIN_URL, RESUME_URL } from "@/lib/profile";
import type { ChatOptions } from "@/lib/types";
import {
  AddIcon,
  ChevronDownIcon,
  ClockIcon,
  CodeIcon,
  FileTextIcon,
  LinkedInIcon,
  MailIcon,
  SlidersIcon,
} from "./ComposerIcons";
import { MenuDivider, MenuItem, MenuLabel, Popover } from "./Popover";

type Menu = "attach" | "style" | "model" | null;

interface ComposerToolsProps {
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  /** Where menus open relative to the composer */
  placement: "top" | "bottom";
}

const toolButton =
  "flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg border-[0.5px] border-claude-border px-1.5 text-claude-muted transition-colors hover:bg-claude-hover hover:text-claude-text";

/**
 * Claude's composer controls, repurposed for the portfolio:
 * "+" shares Dishant's resume and links, the sliders pick a response style,
 * the clock toggles in-depth answers (Claude's extended thinking), and the
 * model picker chooses which backend model answers.
 */
export function ComposerLeftTools({ options, onOptionsChange, placement }: ComposerToolsProps) {
  const [menu, setMenu] = useState<Menu>(null);
  const baseId = useId();
  const close = () => setMenu(null);
  const toggle = (m: Menu) => setMenu((cur) => (cur === m ? null : m));
  const styleActive = options.style !== "normal";

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={() => toggle("attach")}
          aria-label="Resume and links"
          aria-expanded={menu === "attach"}
          aria-controls={`${baseId}-attach`}
          className={toolButton}
        >
          <AddIcon />
        </button>
        <Popover id={`${baseId}-attach`} open={menu === "attach"} onClose={close} label="Resume and links" placement={placement}>
          <MenuItem icon={<FileTextIcon />} label="Download resume" description="PDF" href={RESUME_URL} download onClick={close} />
          <MenuItem icon={<LinkedInIcon />} label="LinkedIn profile" href={LINKEDIN_URL} external onClick={close} />
          <MenuItem icon={<MailIcon />} label="Email Dishant" href={`mailto:${EMAIL}`} onClick={close} />
          <MenuItem icon={<CodeIcon />} label="LeetCode profile" href={LEETCODE_URL} external onClick={close} />
        </Popover>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => toggle("style")}
          aria-label="Response style"
          aria-expanded={menu === "style"}
          aria-controls={`${baseId}-style`}
          className={`${toolButton} ${styleActive ? "border-claude-accent/40 bg-claude-accent/10 text-claude-button" : ""}`}
        >
          <SlidersIcon />
          {styleActive && (
            <span className="pr-0.5 text-[13px]">{STYLES.find((s) => s.id === options.style)?.name}</span>
          )}
        </button>
        <Popover id={`${baseId}-style`} open={menu === "style"} onClose={close} label="Response style" placement={placement}>
          <MenuLabel>Use style</MenuLabel>
          {STYLES.map((s) => (
            <MenuItem
              key={s.id}
              label={s.name}
              description={s.description}
              selected={options.style === s.id}
              onClick={() => {
                onOptionsChange({ ...options, style: s.id });
                close();
              }}
            />
          ))}
        </Popover>
      </div>

      <button
        type="button"
        onClick={() => onOptionsChange({ ...options, inDepth: !options.inDepth })}
        aria-pressed={options.inDepth}
        aria-label="In-depth answers"
        title="In-depth answers"
        className={`${toolButton} ${options.inDepth ? "border-claude-accent/40 bg-claude-accent/10 text-claude-button" : ""}`}
      >
        <ClockIcon />
        {options.inDepth && <span className="pr-0.5 text-[13px]">In-depth</span>}
      </button>
    </div>
  );
}

/**
 * Claude's "Chat / Cowork" segmented toggle. "Interview" makes the assistant
 * answer in first person, as Dishant would in a job interview.
 */
export function ModeToggle({ options, onOptionsChange }: Omit<ComposerToolsProps, "placement">) {
  return (
    <div role="group" aria-label="Conversation mode" className="flex h-8 items-center rounded-lg bg-claude-sidebar p-0.5">
      {MODES.map((m) => {
        const active = options.mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onOptionsChange({ ...options, mode: m.id })}
            aria-pressed={active}
            title={m.description}
            className={`h-7 rounded-md px-2 text-[13px] transition-colors ${
              active
                ? "bg-white text-claude-text shadow-[0_0.5px_2px_rgba(0,0,0,0.12)]"
                : "text-claude-muted hover:text-claude-text"
            }`}
          >
            {m.name}
          </button>
        );
      })}
    </div>
  );
}

export function ModelPicker({ options, onOptionsChange, placement }: ComposerToolsProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const current = MODELS.find((m) => m.id === options.model) ?? MODELS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Model: ${current.name}`}
        className="flex h-8 items-center gap-1 rounded-lg px-2 text-[13.5px] text-claude-body transition-colors hover:bg-claude-hover"
      >
        <span className="max-w-[9rem] truncate">{current.name}</span>
        <ChevronDownIcon />
      </button>
      <Popover id={id} open={open} onClose={() => setOpen(false)} label="Choose model" placement={placement} align="end">
        <MenuLabel>Model</MenuLabel>
        {MODELS.map((m) => (
          <MenuItem
            key={m.id}
            label={m.name}
            description={m.description}
            selected={options.model === m.id}
            onClick={() => {
              onOptionsChange({ ...options, model: m.id });
              setOpen(false);
            }}
          />
        ))}
        <MenuDivider />
        <p className="px-2.5 py-1 text-[12px] text-claude-faint">Falls back to the other model if one is unavailable.</p>
      </Popover>
    </div>
  );
}
