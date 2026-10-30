"use client";

import { useState, type ReactNode } from "react";
import { MODELS, MODES, STYLES } from "@/lib/options";
import { cleanName, MAX_NAME_LENGTH } from "@/lib/settings";
import type { ChatOptions } from "@/lib/types";
import { PageShell } from "./PageShell";

interface CustomizeViewProps {
  displayName: string;
  onNameChange: (name: string) => void;
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  chatCount: number;
  onExport: () => void;
  onClearAll: () => void;
  isMobile: boolean;
  onOpenSidebar: () => void;
}

const selectClass =
  "h-9 w-full rounded-lg border-[0.5px] border-claude-border bg-white px-2.5 text-[14px] text-claude-text focus:border-claude-accent/60 focus:outline-none sm:w-60";
const secondaryButton =
  "flex h-9 items-center rounded-lg border-[0.5px] border-claude-border px-3 text-[14px] text-claude-body transition-colors hover:bg-claude-hover hover:text-claude-text disabled:cursor-not-allowed disabled:opacity-50";

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border-[0.5px] border-claude-border bg-white p-4">
      <h2 className="text-[15px] font-medium text-claude-text">{title}</h2>
      <p className="mb-4 mt-0.5 text-[13.5px] text-claude-muted">{description}</p>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
      <label htmlFor={id} className="text-[14px] text-claude-body">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Claude's "Customize" settings: visitor name, default composer options and data controls. */
export function CustomizeView({
  displayName,
  onNameChange,
  options,
  onOptionsChange,
  chatCount,
  onExport,
  onClearAll,
  isMobile,
  onOpenSidebar,
}: CustomizeViewProps) {
  const [name, setName] = useState(displayName);
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const dirty = cleanName(name) !== displayName;

  const saveName = () => {
    onNameChange(cleanName(name));
    setName(cleanName(name));
    setSaved(true);
  };

  return (
    <PageShell
      title="Customize"
      subtitle="Personalize how the portfolio assistant greets and answers you. Settings stay in this browser."
      isMobile={isMobile}
      onOpenSidebar={onOpenSidebar}
    >
      <div className="flex flex-col gap-4">
        <Section title="Profile" description="Used for the home screen greeting only. It is never sent to the server.">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveName();
            }}
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="visitor-name" className="text-[14px] text-claude-body">
                What should we call you?
              </label>
              <input
                id="visitor-name"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                autoComplete="given-name"
                placeholder="Your name"
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                className="h-9 rounded-lg border-[0.5px] border-claude-border bg-white px-2.5 text-[16px] text-claude-text placeholder:text-claude-faint focus:border-claude-accent/60 focus:outline-none sm:text-[14px]"
              />
            </div>
            <button
              type="submit"
              disabled={!dirty}
              className="flex h-9 items-center justify-center rounded-lg bg-claude-button px-3 text-[14px] text-white transition-colors hover:bg-claude-button-hover disabled:cursor-not-allowed disabled:bg-claude-button/40"
            >
              Save
            </button>
          </form>
          <p role="status" className="-mt-2 min-h-[1.25rem] text-[12.5px] text-claude-muted">
            {saved ? "Saved." : ""}
          </p>
        </Section>

        <Section title="Chat defaults" description="The same options as the composer controls, applied to new messages.">
          <Field id="default-mode" label="Mode">
            <select
              id="default-mode"
              value={options.mode}
              onChange={(e) => onOptionsChange({ ...options, mode: e.target.value as ChatOptions["mode"] })}
              className={selectClass}
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.description}
                </option>
              ))}
            </select>
          </Field>
          <Field id="default-style" label="Response style">
            <select
              id="default-style"
              value={options.style}
              onChange={(e) => onOptionsChange({ ...options, style: e.target.value as ChatOptions["style"] })}
              className={selectClass}
            >
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="default-model" label="Model">
            <select
              id="default-model"
              value={options.model}
              onChange={(e) => onOptionsChange({ ...options, model: e.target.value })}
              className={selectClass}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-center justify-between gap-3">
            <span id="default-depth-label" className="text-[14px] text-claude-body">
              In-depth answers
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={options.inDepth}
              aria-labelledby="default-depth-label"
              onClick={() => onOptionsChange({ ...options, inDepth: !options.inDepth })}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                options.inDepth ? "bg-claude-button" : "bg-claude-border"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  options.inDepth ? "translate-x-[1.375rem]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </Section>

        <Section title="Your data" description="Conversations are stored only in this browser. Incognito chats are never saved.">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onExport} disabled={chatCount === 0} className={secondaryButton}>
              Export chats ({chatCount})
            </button>
            {confirmClear ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="flex h-9 items-center rounded-lg bg-[#B42318] px-3 text-[14px] text-white transition-colors hover:bg-[#912018]"
                >
                  Delete all chats
                </button>
                <button type="button" onClick={() => setConfirmClear(false)} className={secondaryButton}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={chatCount === 0}
                className={`${secondaryButton} text-[#B42318] hover:text-[#912018]`}
              >
                Clear history
              </button>
            )}
          </div>
          {confirmClear && (
            <p role="alert" className="-mt-2 text-[13px] text-[#9A3412]">
              This permanently deletes {chatCount} saved {chatCount === 1 ? "conversation" : "conversations"}.
            </p>
          )}
        </Section>
      </div>
    </PageShell>
  );
}

