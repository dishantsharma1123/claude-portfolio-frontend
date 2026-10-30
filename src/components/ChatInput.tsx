"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { primeSpeech, useSpeechRecognition } from "@/lib/speech";
import type { ChatOptions } from "@/lib/types";
import { MicIcon, WaveformIcon } from "./ComposerIcons";
import { ComposerLeftTools, ModelPicker, ModeToggle } from "./ComposerTools";

interface ChatInputProps {
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  /** Where the composer menus open; "bottom" on the home screen */
  menuPlacement?: "top" | "bottom";
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  /** True while another response is in flight (e.g. in a different chat) */
  disabled?: boolean;
  placeholder: string;
  autoFocus?: boolean;
  /** Opens full-screen voice mode; the button shows while the composer is empty */
  onVoiceMode?: () => void;
}

/** Appends dictated text to whatever was already typed */
function joinText(base: string, spoken: string): string {
  if (!spoken) return base;
  if (!base.trim()) return spoken;
  return /\s$/.test(base) ? `${base}${spoken}` : `${base} ${spoken}`;
}

const MAX_HEIGHT = 240;

export function ChatInput({
  options,
  onOptionsChange,
  menuPlacement = "top",
  onSend,
  onStop,
  isStreaming,
  disabled = false,
  placeholder,
  autoFocus = false,
  onVoiceMode,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dictationBaseRef = useRef("");
  const speech = useSpeechRecognition();

  // Latest props for the recognition callbacks, which outlive the render that started them
  const sendStateRef = useRef({ onSend, disabled, isStreaming });
  useEffect(() => {
    sendStateRef.current = { onSend, disabled, isStreaming };
  });

  // Speech streams into the composer; when the speaker pauses, recognition ends
  // and the question is sent automatically (tapping the mic again sends early).
  const toggleDictation = () => {
    if (speech.listening) {
      speech.stop();
      return;
    }
    setMicError(null);
    dictationBaseRef.current = value;
    speech.start({
      continuous: false,
      onInterim: (t) => setValue(joinText(dictationBaseRef.current, t)),
      onFinal: (t) => {
        const text = joinText(dictationBaseRef.current, t);
        const { onSend: send, disabled: busy, isStreaming: streaming } = sendStateRef.current;
        if (busy || streaming) {
          // Keep the transcript so it can be sent once the current reply finishes
          setValue(text);
          setMicError("A reply is still in progress. Press send when it finishes.");
          return;
        }
        send(text);
        setValue("");
      },
      onError: setMicError,
      onEnd: () => textareaRef.current?.focus(),
    });
  };

  const openVoiceMode = () => {
    speech.abort();
    primeSpeech(); // unlock speech synthesis on iOS while still inside the tap
    onVoiceMode?.();
  };

  // Auto-grow the textarea with its content, up to MAX_HEIGHT
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  // Only autofocus on devices with a mouse, so phones don't pop the keyboard
  useEffect(() => {
    if (autoFocus && window.matchMedia("(pointer: fine)").matches) textareaRef.current?.focus();
  }, [autoFocus]);

  const hasText = value.trim().length > 0;
  const canSend = hasText && !disabled && !isStreaming;
  // Like Claude.ai: an empty composer offers voice mode where the send button sits
  const showVoiceMode = !hasText && !!onVoiceMode && speech.supported;

  const submit = () => {
    if (!canSend) return;
    speech.abort();
    onSend(value);
    setValue("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds a newline; ignore Enter while composing (IME)
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border-[0.5px] border-[#D9D6CC] bg-white shadow-[0_0.25rem_1.25rem_rgba(0,0,0,0.035)] transition-[border-color,box-shadow] hover:border-[#CCC9BE] focus-within:border-[#BFBBAF] focus-within:shadow-[0_0.25rem_1.25rem_rgba(0,0,0,0.075)]"
    >
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="block w-full resize-none bg-transparent px-4 pt-4 text-[16px] leading-6 text-claude-text placeholder:text-claude-faint focus:outline-none"
        style={{ maxHeight: MAX_HEIGHT }}
      />
      {micError && (
        <p role="alert" className="px-4 pt-1 text-[13px] text-[#9A3412]">
          {micError}
        </p>
      )}
      <div className="flex items-center gap-2 px-3 pb-3 pt-2">
        <ComposerLeftTools options={options} onOptionsChange={onOptionsChange} placement={menuPlacement} />
        <ModeToggle options={options} onOptionsChange={onOptionsChange} />
        <div className="flex-1" />
        <ModelPicker options={options} onOptionsChange={onOptionsChange} placement={menuPlacement} />
        {speech.supported && (
          <button
            type="button"
            onClick={toggleDictation}
            aria-label={speech.listening ? "Stop dictation" : "Dictate"}
            aria-pressed={speech.listening}
            title={speech.listening ? "Stop dictation" : "Dictate"}
            className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
              speech.listening
                ? "mic-listening bg-claude-accent/15 text-claude-button"
                : "text-claude-muted hover:bg-claude-hover hover:text-claude-text"
            }`}
          >
            <MicIcon />
          </button>
        )}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop response"
            className="flex size-8 items-center justify-center rounded-lg bg-claude-button text-white transition-colors hover:bg-claude-button-hover"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          </button>
        ) : showVoiceMode ? (
          <button
            type="button"
            onClick={openVoiceMode}
            disabled={disabled}
            aria-label="Use voice mode"
            title="Use voice mode"
            className="flex size-8 items-center justify-center rounded-lg bg-claude-text text-white transition-colors hover:bg-claude-body disabled:cursor-not-allowed disabled:opacity-40"
          >
            <WaveformIcon />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="flex size-8 items-center justify-center rounded-lg bg-claude-button text-white transition-colors hover:bg-claude-button-hover disabled:cursor-not-allowed disabled:bg-claude-button/40"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
