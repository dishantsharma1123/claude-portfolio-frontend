import { useEffect, useRef, useState } from "react";
import { streamChat } from "./chatStream";
import { DEFAULT_OPTIONS, loadOptions, saveOptions } from "./options";
import { createId, loadChats, saveChats, titleFrom } from "./storage";
import type { Chat, ChatOptions, Feedback, Message, Role } from "./types";

type History = { role: Role; content: string }[];

function toHistory(messages: Message[]): History {
  return messages
    .filter((m) => !m.error && m.content.trim())
    .map(({ role, content }) => ({ role, content }));
}

/**
 * Owns all chat state: history, the active conversation, and streaming.
 * `scope` is the signed-in demo persona id (null for the guest). While it is
 * `undefined` the account isn't known yet, so nothing is loaded or saved.
 */
export function useChats(scope: string | null | undefined) {
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [streamingChatId, setStreamingChatId] = useState<string | null>(null);
  /** The account the in-memory `chats` belong to */
  const [chatsScope, setChatsScope] = useState<string | null | undefined>(undefined);
  const [options, setOptionsState] = useState<ChatOptions>(DEFAULT_OPTIONS);
  // Incognito applies to the next chat started from the home screen
  const [incognito, setIncognito] = useState(false);
  const chatsRef = useRef(chats);
  const chatsScopeRef = useRef(chatsScope);
  const optionsRef = useRef(options);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatsRef.current = chats;
    chatsScopeRef.current = chatsScope;
  }, [chats, chatsScope]);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    setOptionsState(loadOptions());
  }, []);

  // Load the signed-in account's chats; switching accounts swaps the list.
  useEffect(() => {
    if (scope === undefined) return;
    // Save the previous account first: saving is skipped mid-stream, so a
    // reply that was streaming when the account changed would otherwise be lost.
    if (chatsScopeRef.current !== undefined) saveChats(chatsScopeRef.current, chatsRef.current);
    abortRef.current?.abort();
    setChats(loadChats(scope));
    setActiveId(null);
    setIncognito(false);
    setChatsScope(scope);
  }, [scope]);

  const hydrated = scope !== undefined && chatsScope === scope;

  const setOptions = (next: ChatOptions) => {
    setOptionsState(next);
    saveOptions(next);
  };

  // Persist to the account the chats belong to; skip while streaming to avoid a write per token.
  useEffect(() => {
    if (chatsScope !== undefined && !streamingChatId) saveChats(chatsScope, chats);
  }, [chats, chatsScope, streamingChatId]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateMessage = (
    chatId: string,
    messageId: string,
    update: (m: Message) => Message | null
  ) => {
    setChats((prev) => {
      const chat = prev[chatId];
      if (!chat) return prev;
      const messages = chat.messages.flatMap((m) => {
        if (m.id !== messageId) return [m];
        const next = update(m);
        return next ? [next] : [];
      });
      return { ...prev, [chatId]: { ...chat, messages, updatedAt: Date.now() } };
    });
  };

  const run = async (chatId: string, messageId: string, message: string, history: History) => {
    const controller = new AbortController();
    abortRef.current = controller;
    setStreamingChatId(chatId);
    let received = false;

    try {
      await streamChat({
        message,
        history,
        options: optionsRef.current,
        signal: controller.signal,
        onToken: (token) => {
          received = true;
          updateMessage(chatId, messageId, (m) => ({ ...m, content: m.content + token }));
        },
      });
      if (!received) {
        updateMessage(chatId, messageId, (m) => ({
          ...m,
          error: "No response was received. Please try again.",
        }));
      }
    } catch (err) {
      if (controller.signal.aborted) {
        // User pressed stop: keep partial text, drop an empty placeholder.
        if (!received) updateMessage(chatId, messageId, () => null);
      } else {
        const error = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        updateMessage(chatId, messageId, (m) => ({ ...m, error }));
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setStreamingChatId(null);
      }
    }
  };

  /** Sends into the active chat, or starts a new one when `fresh` is set or none is open. */
  const send = (text: string, fresh = false) => {
    const content = text.trim();
    if (!content || streamingChatId) return;

    const chatId = (fresh ? null : activeId) ?? createId();
    const history = toHistory(chatsRef.current[chatId]?.messages ?? []);
    const userMessage: Message = { id: createId(), role: "user", content };
    const assistantMessage: Message = { id: createId(), role: "assistant", content: "" };

    setChats((prev) => {
      const chat = prev[chatId] ?? {
        id: chatId,
        title: titleFrom(content),
        messages: [],
        updatedAt: Date.now(),
        ...(incognito && !fresh ? { temporary: true } : {}),
      };
      return {
        ...prev,
        [chatId]: {
          ...chat,
          messages: [...chat.messages, userMessage, assistantMessage],
          updatedAt: Date.now(),
        },
      };
    });
    setActiveId(chatId);
    void run(chatId, assistantMessage.id, content, history);
  };

  /** Regenerates an assistant message from the user prompt right before it. */
  const retry = (messageId: string) => {
    if (!activeId || streamingChatId) return;
    const chat = chatsRef.current[activeId];
    if (!chat) return;
    const index = chat.messages.findIndex((m) => m.id === messageId);
    const prompt = chat.messages[index - 1];
    if (index < 1 || prompt?.role !== "user") return;

    updateMessage(activeId, messageId, (m) => ({ id: m.id, role: m.role, content: "" }));
    void run(activeId, messageId, prompt.content, toHistory(chat.messages.slice(0, index - 1)));
  };

  const stop = () => abortRef.current?.abort();

  /** Thumbs up / down on an assistant reply; the same value again clears it. Doesn't reorder the chat list. */
  const rate = (messageId: string, feedback: Feedback | null) => {
    if (!activeId) return;
    const chatId = activeId;
    setChats((prev) => {
      const chat = prev[chatId];
      if (!chat) return prev;
      const messages = chat.messages.map((m) => {
        if (m.id !== messageId || m.role !== "assistant") return m;
        const next: Message = { ...m };
        if (feedback) next.feedback = feedback;
        else delete next.feedback;
        return next;
      });
      return { ...prev, [chatId]: { ...chat, messages } };
    });
  };

  const deleteChat = (id: string) => {
    if (streamingChatId === id) stop();
    setChats((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeId === id) setActiveId(null);
  };

  const renameChat = (id: string, title: string) => {
    const clean = titleFrom(title);
    if (!title.trim()) return;
    setChats((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], title: clean } } : prev));
  };

  /** Deletes every saved conversation (Customize → Clear history). */
  const clearAll = () => {
    stop();
    setChats({});
    setActiveId(null);
  };

  const activeChat = activeId ? chats[activeId] ?? null : null;

  return {
    // Incognito chats never appear in the sidebar
    chats: Object.values(chats)
      .filter((c) => !c.temporary)
      .sort((a, b) => b.updatedAt - a.updatedAt),
    activeChat,
    /** True on an incognito home screen or inside a temporary chat */
    incognito: activeChat ? activeChat.temporary === true : incognito,
    setIncognito,
    renameChat,
    clearAll,
    isStreaming: streamingChatId !== null && streamingChatId === activeId,
    isBusy: streamingChatId !== null,
    hydrated,
    options,
    setOptions,
    send,
    retry,
    rate,
    stop,
    newChat: () => {
      setActiveId(null);
      setIncognito(false);
    },
    selectChat: (id: string) => setActiveId(id),
    deleteChat,
  };
}
