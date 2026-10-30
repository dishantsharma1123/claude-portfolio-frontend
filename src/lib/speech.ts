"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal Web Speech API types — SpeechRecognition isn't in TypeScript's DOM lib.
interface RecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEventLike {
  results: ArrayLike<RecognitionResultLike>;
}
interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => RecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const UNSUPPORTED_MESSAGE = "Voice input isn't supported in this browser. Try Chrome, Edge, or Safari.";

function errorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was blocked. Allow it in your browser settings and try again.";
    case "no-speech":
      return "I didn't catch that. Tap the mic to try again.";
    case "audio-capture":
      return "No microphone was found.";
    case "network":
      return "Speech recognition needs a network connection.";
    default:
      return "Voice input stopped unexpectedly. Please try again.";
  }
}

export interface ListenHandlers {
  /** Keep listening across pauses (dictation) instead of stopping after one utterance */
  continuous?: boolean;
  onInterim?: (transcript: string) => void;
  onFinal: (transcript: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

/** Browser speech-to-text. `abort()` discards the result; `stop()` delivers it. */
export function useSpeechRecognition() {
  const recRef = useRef<RecognitionLike | null>(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);

  const detach = (rec: RecognitionLike | null) => {
    if (!rec) return;
    rec.onresult = rec.onerror = rec.onend = null;
    rec.abort();
  };

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
    return () => detach(recRef.current);
  }, []);

  const abort = useCallback(() => {
    detach(recRef.current);
    recRef.current = null;
    setListening(false);
  }, []);

  const stop = useCallback(() => recRef.current?.stop(), []);

  const start = useCallback((h: ListenHandlers) => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      h.onError?.(UNSUPPORTED_MESSAGE);
      return;
    }
    detach(recRef.current);

    const rec = new Ctor();
    rec.lang = navigator.language || "en-US";
    rec.continuous = h.continuous ?? false;
    rec.interimResults = true;
    let finalText = "";
    // Last full transcript incl. unfinalised words; used if stop() ends the
    // session before the browser marks the last phrase final (common in Safari)
    let latestText = "";

    rec.onresult = (e) => {
      // Rebuild from all results so continuous sessions never duplicate text
      let final = "";
      let interim = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      finalText = final;
      latestText = `${final}${interim}`.trim();
      h.onInterim?.(latestText);
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") h.onError?.(errorMessage(e.error));
    };
    rec.onend = () => {
      if (recRef.current === rec) {
        recRef.current = null;
        setListening(false);
      }
      const text = finalText.trim() || latestText;
      if (text) h.onFinal(text);
      h.onEnd?.();
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      recRef.current = null;
      h.onError?.(errorMessage(""));
    }
  }, []);

  return { supported, listening, start, stop, abort };
}

/** Turns markdown into plain text that reads naturally aloud. */
export function toSpeakable(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "the link in the chat")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*#+\s*/gm, "")
    .replace(/[*_~>#|]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Call from a click handler before speaking later: iOS Safari only allows
 * speech synthesis after it has been started once inside a user gesture.
 */
export function primeSpeech(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(" ");
  utterance.volume = 0;
  window.speechSynthesis.speak(utterance);
}

let speakToken = 0;

export function cancelSpeech(): void {
  speakToken++;
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

/**
 * Reads text aloud, then calls onDone. Speaks sentence by sentence because
 * Chrome silently cuts off long single utterances.
 */
export function speak(text: string, onDone: () => void): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onDone();
    return;
  }
  cancelSpeech();
  const token = speakToken;
  const chunks = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (chunks.length === 0) {
    onDone();
    return;
  }
  const done = () => {
    if (token === speakToken) onDone();
  };
  chunks.forEach((chunk, i) => {
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = navigator.language || "en-US";
    if (i === chunks.length - 1) {
      utterance.onend = done;
      utterance.onerror = done;
    }
    window.speechSynthesis.speak(utterance);
  });
}
