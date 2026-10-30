"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface PopoverProps {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Accessible name for the panel */
  label: string;
  /** Opens above or below the trigger. The parent wrapper must be `relative`. */
  placement?: "top" | "bottom";
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
}

/** Small anchored panel that closes on outside click or Escape (disclosure pattern). */
export function Popover({
  id,
  open,
  onClose,
  label,
  placement = "bottom",
  align = "start",
  className = "",
  children,
}: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const anchor = ref.current?.parentElement;
    const onPointer = (e: PointerEvent) => {
      if (anchor && !anchor.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onClose();
      // Return focus to the trigger so keyboard users don't lose their place
      anchor?.querySelector<HTMLElement>("[aria-controls]")?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      id={id}
      role="group"
      aria-label={label}
      className={`claude-fade-in absolute z-30 min-w-[15rem] rounded-xl border-[0.5px] border-claude-border bg-white p-1.5 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.08)] ${
        placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
      } ${align === "end" ? "right-0" : "left-0"} ${className}`}
    >
      {children}
    </div>
  );
}

interface MenuItemProps {
  icon?: ReactNode;
  label: string;
  description?: string;
  /** Renders a link instead of a button */
  href?: string;
  external?: boolean;
  download?: boolean;
  onClick?: () => void;
  /** Shows a check mark and sets aria-pressed (single-choice lists) */
  selected?: boolean;
  /** Right-aligned hint: a shortcut, chevron or external-link icon */
  trailing?: ReactNode;
  disabled?: boolean;
}

export function MenuItem({
  icon,
  label,
  description,
  href,
  external,
  download,
  onClick,
  selected,
  trailing,
  disabled,
}: MenuItemProps) {
  const className =
    "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-[14px] text-claude-text transition-colors hover:bg-claude-hover focus-visible:bg-claude-hover focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";
  const content = (
    <>
      {icon && <span className="mt-0.5 shrink-0 text-claude-muted">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{label}</span>
        {description && <span className="block text-[12.5px] leading-snug text-claude-muted">{description}</span>}
      </span>
      {selected && (
        <span className="mt-0.5 shrink-0 text-claude-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
      {trailing && <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[12.5px] text-claude-muted">{trailing}</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={className}
        download={download || undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected === undefined ? undefined : selected}
      className={className}
    >
      {content}
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <p className="px-2.5 pb-1 pt-1.5 text-[12px] font-medium text-claude-muted">{children}</p>;
}

export function MenuDivider() {
  return <div role="separator" className="my-1.5 h-px bg-claude-border" />;
}
