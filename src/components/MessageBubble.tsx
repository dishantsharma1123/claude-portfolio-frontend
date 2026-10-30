"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { ClaudeLogo } from "./ClaudeLogo";
import type { Feedback, Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
  isStreaming: boolean;
  isLast: boolean;
  onRetry: () => void;
  /** Sets or clears the thumbs up / down rating for this reply */
  onFeedback: (feedback: Feedback | null) => void;
}

// Model output is untrusted: react-markdown doesn't render raw HTML by default,
// and external links open in a new tab without referrer/opener access.
const markdownComponents: Components = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

const PROSE =
  "prose max-w-none font-serif text-[16.5px] leading-[1.7] text-claude-body " +
  "prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 " +
  "prose-headings:font-serif prose-headings:text-claude-text prose-strong:font-semibold prose-strong:text-claude-text " +
  "prose-a:text-claude-button prose-a:underline-offset-2 " +
  "prose-code:rounded prose-code:bg-claude-bubble prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:text-[0.875em] " +
  "prose-code:before:content-none prose-code:after:content-none " +
  "prose-pre:rounded-xl prose-pre:bg-[#1F1E1D] prose-pre:text-[#F5F4EE] [&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0";

export function MessageBubble(props: MessageBubbleProps) {
  return props.message.role === "user" ? (
    <UserMessage content={props.message.content} />
  ) : (
    <AssistantMessage {...props} />
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="claude-fade-in flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-xl bg-claude-bubble px-4 py-2.5 text-[16px] leading-[1.6] text-claude-text sm:max-w-[75%]">
        {content}
      </div>
    </div>
  );
}

function AssistantMessage({ message, isStreaming, isLast, onRetry, onFeedback }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  // Saved with the chat in localStorage (no backend endpoint exists for ratings)
  const feedback = message.feedback ?? null;
  const [thanked, setThanked] = useState(false);
  const thanksTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasContent = message.content.trim().length > 0;

  useEffect(() => () => {
    if (thanksTimer.current) clearTimeout(thanksTimer.current);
  }, []);

  const rate = (value: Feedback) => {
    const next = feedback === value ? null : value;
    onFeedback(next);
    if (thanksTimer.current) clearTimeout(thanksTimer.current);
    setThanked(next !== null);
    if (next) thanksTimer.current = setTimeout(() => setThanked(false), 2000);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (insecure context / permissions) — ignore
    }
  };

  return (
    <div className="group claude-fade-in">
      {hasContent && (
        <div className={PROSE}>
          <ReactMarkdown components={markdownComponents}>{message.content}</ReactMarkdown>
        </div>
      )}

      {message.error && (
        <div
          role="alert"
          className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-[#F0C7BB] bg-[#FDF1ED] px-4 py-3 text-[14px] text-[#9A3412]"
        >
          <span className="min-w-0 flex-1">{message.error}</span>
          {isLast && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg border border-[#E7B3A3] bg-white px-3 py-1 text-[13px] font-medium transition-colors hover:bg-[#FFF7F4]"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Like Claude.ai: the spark sits under the latest reply — animated while
          generating, still once the reply is complete. */}
      {(isStreaming || (isLast && hasContent)) && (
        <div className={hasContent ? "mt-4" : "mt-1"} role={isStreaming ? "status" : undefined}>
          <ClaudeLogo animated={isStreaming} squeezable className="size-7" />
          {isStreaming && <span className="sr-only">Claude is responding</span>}
        </div>
      )}

      {!isStreaming && hasContent && (
        <div
          className={`mt-2 flex items-center gap-0.5 text-claude-muted transition-opacity ${
            isLast || feedback ? "opacity-100" : "md:opacity-0 md:focus-within:opacity-100 md:group-hover:opacity-100"
          }`}
        >
          <ActionButton label={copied ? "Copied" : "Copy"} onClick={copy}>
            {copied ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </ActionButton>
          <ActionButton
            label={feedback === "up" ? "Marked as helpful" : "Good response"}
            pressed={feedback === "up"}
            onClick={() => rate("up")}
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
          </ActionButton>
          <ActionButton
            label={feedback === "down" ? "Marked as unhelpful" : "Bad response"}
            pressed={feedback === "down"}
            onClick={() => rate("down")}
          >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
          </ActionButton>
          {isLast && (
            <ActionButton label="Retry" onClick={onRetry}>
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </ActionButton>
          )}
          <span role="status" className="ml-1.5 text-[12.5px] text-claude-muted">
            {thanked ? "Thanks for the feedback" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  /** For toggle buttons (feedback); omitted for plain actions */
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`flex size-8 items-center justify-center rounded-md transition-colors hover:bg-claude-hover hover:text-claude-text ${
        pressed ? "text-claude-button hover:text-claude-button" : ""
      }`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={pressed ? "currentColor" : "none"}
        fillOpacity={pressed ? 0.2 : undefined}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}
