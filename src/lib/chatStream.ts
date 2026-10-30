import type { ChatOptions, Role } from "./types";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

interface StreamChatOptions {
  message: string;
  history: { role: Role; content: string }[];
  options: ChatOptions;
  signal: AbortSignal;
  onToken: (token: string) => void;
}

/**
 * POSTs to the backend and parses its Server-Sent Events stream.
 * Each event is `data: {"content": "..."}` or `data: {"error": "..."}`,
 * terminated by `data: [DONE]`. Network chunks can split events, so we buffer
 * until a blank-line event boundary.
 */
export async function streamChat({ message, history, options, signal, onToken }: StreamChatOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        model: options.model,
        style: options.style,
        in_depth: options.inDepth,
        mode: options.mode,
        language: options.language,
      }),
      signal,
    });
  } catch (err) {
    if (signal.aborted) throw err;
    throw new Error("Couldn't reach the server. Make sure the backend is running and try again.");
  }

  if (!response.ok || !response.body) {
    throw new Error(`The server returned an error (${response.status}). Please try again.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const data = rawEvent
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n");

      if (!data) continue;
      if (data === "[DONE]") return;

      let payload: { content?: unknown; error?: unknown };
      try {
        payload = JSON.parse(data);
      } catch {
        continue; // Ignore malformed events rather than rendering them
      }
      if (typeof payload.error === "string") throw new Error(payload.error);
      if (typeof payload.content === "string") onToken(payload.content);
    }
  }
}
