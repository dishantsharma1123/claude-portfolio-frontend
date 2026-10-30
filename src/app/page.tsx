"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import { CustomizeView } from "@/components/CustomizeView";
import { ProjectsView } from "@/components/ProjectsView";
import { SearchDialog } from "@/components/SearchDialog";
import { StackView } from "@/components/StackView";
import { chatsToMarkdown, downloadText } from "@/lib/exportChats";
import { loadDemoAccount, saveDemoAccount, type DemoAccount } from "@/lib/demoAccounts";
import { LEETCODE_URL } from "@/lib/profile";
import { loadName, saveName } from "@/lib/settings";
import type { View } from "@/lib/types";
import { useChats } from "@/lib/useChats";

const MOBILE_QUERY = "(max-width: 767px)"; // below Tailwind's `md`
const SIDEBAR_KEY = "sidebarOpen";

export default function Home() {
  const [demoAccount, setDemoAccount] = useState<DemoAccount | null>(null);
  // False until localStorage is read, so chats aren't loaded for the wrong account
  const [accountReady, setAccountReady] = useState(false);
  // Each demo persona (and the guest, null) has its own chat history
  const chat = useChats(accountReady ? demoAccount?.id ?? null : undefined);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("chat");
  const [searchOpen, setSearchOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setDisplayName(loadName());
    setDemoAccount(loadDemoAccount());
    setAccountReady(true);
  }, []);

  // A demo persona's name takes precedence over the name typed in Customize
  const shownName = demoAccount?.name ?? displayName;

  // Ctrl/⌘+K opens chat search, like Claude.ai
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // ⇧⌘, (Ctrl+Shift+, elsewhere) opens Settings, as shown in the account menu.
      // e.code is used because Shift turns "," into "<" on most layouts.
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "Comma") {
        e.preventDefault();
        setView("customize");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const sync = (mobile: boolean) => {
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false); // never start with the drawer covering the chat
      } else {
        const saved = localStorage.getItem(SIDEBAR_KEY);
        setIsOpen(saved === null ? true : saved === "true");
      }
    };
    sync(mql.matches);
    setMounted(true);

    const onChange = (e: MediaQueryListEvent) => sync(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const setSidebar = (open: boolean) => {
    setIsOpen(open);
    if (!isMobile) localStorage.setItem(SIDEBAR_KEY, String(open));
  };
  const closeOnMobile = () => {
    if (isMobile) setIsOpen(false);
  };

  const goHome = () => {
    chat.newChat();
    setView("chat");
    closeOnMobile();
  };
  const openChat = (id: string) => {
    chat.selectChat(id);
    setView("chat");
    closeOnMobile();
  };
  // "Ask about this" on Projects / Tech stack starts a fresh conversation
  const ask = (prompt: string) => {
    chat.send(prompt, true);
    setView("chat");
  };
  const exportChats = () => {
    if (chat.chats.length === 0) return;
    const stamp = new Date().toISOString().slice(0, 10);
    downloadText(`dishant-ai-chats-${stamp}.md`, chatsToMarkdown(chat.chats));
  };
  // Account menu → Log out: sign the persona out. Its chats stay saved under
  // that persona and the sidebar switches back to the guest's chats.
  const resetSession = () => {
    setDemoAccount(null);
    saveDemoAccount(null);
    setView("chat");
    closeOnMobile();
  };
  const openSearch = () => {
    setSearchOpen(true);
    closeOnMobile();
  };

  // Wait for viewport + localStorage so the first paint is correct
  if (!mounted || !chat.hydrated) return <div className="h-dvh-screen bg-claude-bg" />;

  return (
    <div className="flex h-dvh-screen w-full overflow-hidden bg-claude-bg">
      <Sidebar
        isOpen={isOpen}
        isMobile={isMobile}
        chats={chat.chats}
        activeId={chat.activeChat?.id ?? null}
        view={view}
        displayName={shownName}
        demoAccount={demoAccount}
        onToggle={() => setSidebar(!isOpen)}
        onNewChat={goHome}
        onSelectChat={openChat}
        onDeleteChat={chat.deleteChat}
        onRenameChat={chat.renameChat}
        onNavigate={(next) => {
          setView(next);
          closeOnMobile();
        }}
        onOpenSearch={openSearch}
        onExport={exportChats}
        codeUrl={LEETCODE_URL}
        options={chat.options}
        onOptionsChange={chat.setOptions}
        onAsk={(prompt) => {
          ask(prompt);
          closeOnMobile();
        }}
        onResetSession={resetSession}
        busy={chat.isBusy}
      />
      <main className="relative flex min-w-0 flex-1 flex-col">
        {view === "projects" ? (
          <ProjectsView onAsk={ask} disabled={chat.isBusy} isMobile={isMobile} onOpenSidebar={() => setIsOpen(true)} />
        ) : view === "stack" ? (
          <StackView onAsk={ask} disabled={chat.isBusy} isMobile={isMobile} onOpenSidebar={() => setIsOpen(true)} />
        ) : view === "customize" ? (
          <CustomizeView
            displayName={displayName}
            onNameChange={(name) => {
              setDisplayName(name);
              saveName(name);
            }}
            options={chat.options}
            onOptionsChange={chat.setOptions}
            chatCount={chat.chats.length}
            onExport={exportChats}
            onClearAll={chat.clearAll}
            isMobile={isMobile}
            onOpenSidebar={() => setIsOpen(true)}
          />
        ) : (
          <ChatInterface
            chat={chat.activeChat}
            options={chat.options}
            onOptionsChange={chat.setOptions}
            isStreaming={chat.isStreaming}
            isBusy={chat.isBusy}
            isMobile={isMobile}
            displayName={shownName}
            incognito={chat.incognito}
            onToggleIncognito={() => chat.setIncognito(!chat.incognito)}
            onSend={chat.send}
            onStop={chat.stop}
            onRetry={chat.retry}
            onFeedback={chat.rate}
            onOpenSidebar={() => setIsOpen(true)}
            onNewChat={chat.newChat}
          />
        )}
      </main>
      {searchOpen && (
        <SearchDialog
          chats={chat.chats}
          onClose={() => setSearchOpen(false)}
          onSelect={(id) => {
            setSearchOpen(false);
            openChat(id);
          }}
        />
      )}
    </div>
  );
}
