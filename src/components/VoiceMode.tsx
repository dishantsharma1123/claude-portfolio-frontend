"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cancelSpeech, speak, toSpeakable, useSpeechRecognition } from "@/lib/speech";
import type { Message } from "@/lib/types";
import { ClaudeLogo } from "./ClaudeLogo";
import { CloseIcon, MicIcon, MicOffIcon } from "./ComposerIcons";

type Phase = "listening" | "thinking" | "speaking" | "paused";

interface VoiceModeProps {
  onClose: () => void;
  onSend: (text: string) => void;
  /** True while the active chat's reply is streaming */
  isStreaming: boolean;
  /** True while any reply is in flight (sends would be ignored) */
  isBusy: boolean;
  /** Latest message in the active chat; spoken once its stream finishes */
  lastMessage: Message | undefined;
}

const STATUS: Record<Phase, string> = {
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking — tap to interrupt",
  paused: "Tap to speak",
};

/**
 * Claude-style voice mode: listen → send → read the reply aloud → listen again.
 * Uses the browser's Web Speech API (speech recognition + speech synthesis).
 */
export function VoiceMode({ onClose, onSend, isStreaming, isBusy, lastMessage }: VoiceModeProps) {
  const { start, stop, abort } = useSpeechRecognition();
  const [phase, setPhase] = useState<Phase>("paused");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sawStreamRef = useRef(false);
  const onSendRef = useRef(onSend);
  const isBusyRef = useRef(isBusy);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    onSendRef.current = onSend;
    isBusyRef.current = isBusy;
  });

  const listen = useCallback(() => {
    cancelSpeech();
    setError(null);
    setTranscript("");
    setPhase("listening");
    start({
      onInterim: setTranscript,
      onFinal: (text) => {
        setTranscript(text);
        if (isBusyRef.current) {
          setError("Please wait for the current reply to finish.");
          setPhase("paused");
          return;
        }
        sawStreamRef.current = false;
        setPhase("thinking");
        onSendRef.current(text);
      },
      onError: setError,
      // Ended without a final transcript (silence, error) → wait for a tap
      onEnd: () => setPhase((p) => (p === "listening" ? "paused" : p)),
    });
  }, [start]);

  const pause = useCallback(() => {
    abort();
    cancelSpeech();
    setPhase("paused");
  }, [abort]);

  // Start listening on open; stop everything on close
  useEffect(() => {
    closeRef.current?.focus();
    listen();
    return () => {
      abort();
      cancelSpeech();
    };
  }, [listen, abort]);

  // Once the reply has streamed in full, read it aloud, then listen again
  useEffect(() => {
    if (phase !== "thinking") return;
    if (isStreaming) {
      sawStreamRef.current = true;
      return;
    }
    if (!sawStreamRef.current) return;
    sawStreamRef.current = false;

    const reply = lastMessage?.role === "assistant" ? lastMessage : undefined;
    const text = reply ? toSpeakable(reply.content) || reply.error || "" : "";
    if (!text) {
      listen();
      return;
    }
    setPhase("speaking");
    speak(text, listen);
  }, [phase, isStreaming, lastMessage, listen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tapOrb = () => {
    if (phase === "listening") stop(); // finish the utterance now
    else if (phase === "speaking" || phase === "paused") listen();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Voice mode"
      className="claude-fade-in fixed inset-0 z-[60] flex flex-col items-center justify-between bg-claude-bg px-6 pb-safe pt-16"
    >
      <p className="text-[13px] font-medium uppercase tracking-wide text-claude-muted">Voice mode</p>

      <div className="flex flex-col items-center gap-8">
        <button
          type="button"
          onClick={tapOrb}
          disabled={phase === "thinking"}
          aria-label={STATUS[phase]}
          className={`voice-orb flex size-40 items-center justify-center rounded-full bg-claude-sidebar transition-colors disabled:cursor-wait sm:size-48 voice-orb--${phase}`}
        >
          <ClaudeLogo animated={phase === "thinking" || phase === "speaking"} className="size-20 sm:size-24" />
        </button>
        <div className="min-h-[5.5rem] max-w-xl text-center" aria-live="polite">
          <p className="text-[15px] font-medium text-claude-text">{STATUS[phase]}</p>
          {transcript && (
            <p className="mt-3 line-clamp-3 font-serif text-[18px] leading-relaxed text-claude-body">{transcript}</p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-[14px] text-[#9A3412]">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={phase === "listening" ? pause : listen}
          disabled={phase === "thinking"}
          aria-label={phase === "listening" ? "Mute microphone" : "Start listening"}
          className="flex size-14 items-center justify-center rounded-full border-[0.5px] border-claude-border bg-white text-claude-text transition-colors hover:bg-claude-hover disabled:opacity-50"
        >
          {phase === "listening" ? <MicIcon size={22} /> : <MicOffIcon size={22} />}
        </button>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="End voice mode"
          className="flex size-14 items-center justify-center rounded-full bg-claude-button text-white transition-colors hover:bg-claude-button-hover"
        >
          <CloseIcon size={22} />
        </button>
      </div>
    </div>
  );
}
