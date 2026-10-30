"use client";

import { LANGUAGES } from "@/lib/options";
import { DEMO_SIGN_IN_PATH, type DemoAccount } from "@/lib/demoAccounts";
import { LINKEDIN_URL, RESUME_URL } from "@/lib/profile";
import type { ChatOptions, View } from "@/lib/types";
import {
  ArrowUpCircleIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExternalIcon,
  GlobeIcon,
  HelpIcon,
  InfoIcon,
  LinkedInIcon,
  LogOutIcon,
  SettingsIcon,
} from "./ComposerIcons";
import { LanguagePage, LearnPage, LogoutPage } from "./AccountSubPages";
import { MenuDivider, MenuItem } from "./Popover";
import { DemoSignInMark } from "./DemoIdentity";

export type AccountPage = "main" | "language" | "learn" | "logout";

interface AccountMenuPanelProps {
  demoAccount: DemoAccount | null;
  email: string;
  page: AccountPage;
  onPage: (page: AccountPage) => void;
  onClose: () => void;
  options: ChatOptions;
  onOptionsChange: (options: ChatOptions) => void;
  onNavigate: (view: View) => void;
  onAsk: (prompt: string) => void;
  onResetSession: () => void;
  busy: boolean;
}

/** Claude's account menu items, mapped to portfolio actions */
export function AccountMenuPanel({
  demoAccount,
  email,
  page,
  onPage,
  onClose,
  options,
  onOptionsChange,
  onNavigate,
  onAsk,
  onResetSession,
  busy,
}: AccountMenuPanelProps) {
  const language = LANGUAGES.find((l) => l.id === options.language) ?? LANGUAGES[0];
  const languageShort = language.id === "auto" ? "Auto" : language.name.split(" ")[0];

  const ask = (prompt: string) => {
    onAsk(prompt);
    onClose();
  };
  const go = (view: View) => {
    onNavigate(view);
    onClose();
  };
  const back = () => onPage("main");

  if (page === "language") {
    return <LanguagePage options={options} onOptionsChange={onOptionsChange} onBack={back} onClose={onClose} />;
  }
  if (page === "learn") {
    return <LearnPage busy={busy} onAsk={ask} onGo={go} onBack={back} onClose={onClose} />;
  }
  if (page === "logout") {
    return (
      <LogoutPage
        demoName={demoAccount?.name}
        onBack={back}
        onConfirm={() => {
          onResetSession();
          onClose();
        }}
      />
    );
  }

  return (
    <>
      {/* Who the visitor is browsing as (Claude shows the account email here) */}
      <p className="truncate px-2.5 pb-1 pt-1.5 text-[12.5px] text-claude-muted">
        {demoAccount ? `Signed in as ${demoAccount.name}` : "You're browsing as a guest"}
      </p>
      <MenuItem
        icon={<SettingsIcon />}
        label="Settings"
        trailing={<kbd className="font-sans text-[12px] tracking-wider text-claude-faint">⇧⌘,</kbd>}
        onClick={() => go("customize")}
      />
      <MenuItem
        icon={<GlobeIcon />}
        label="Language"
        trailing={
          <>
            <span>{languageShort}</span>
            <ChevronRightIcon />
          </>
        }
        onClick={() => onPage("language")}
      />
      <MenuItem
        icon={<HelpIcon />}
        label="Get help"
        disabled={busy}
        onClick={() => ask("What can I ask you about Dishant, and what can this assistant do?")}
      />
      <MenuDivider />
      <MenuItem
        icon={<ArrowUpCircleIcon />}
        label="Hire Dishant"
        href={`mailto:${email}?subject=${encodeURIComponent("Opportunity for Dishant Sharma")}`}
        onClick={onClose}
      />
      <MenuItem icon={<DownloadIcon />} label="Download resume" href={RESUME_URL} download onClick={onClose} />
      <MenuItem icon={<InfoIcon />} label="Learn more" trailing={<ChevronRightIcon />} onClick={() => onPage("learn")} />
      <MenuDivider />
      <MenuItem
        icon={<LinkedInIcon />}
        label="Connect on LinkedIn"
        description="on linkedin.com"
        href={LINKEDIN_URL}
        external
        trailing={<ExternalIcon />}
        onClick={onClose}
      />
      <MenuDivider />
      {demoAccount ? (
        <MenuItem
          icon={<LogOutIcon />}
          label="Log out"
          onClick={() => onPage("logout")}
        />
      ) : (
        <MenuItem
          icon={<DemoSignInMark />}
          label="Sign in"
          description="Pick a profile, not connected to Google"
          href={DEMO_SIGN_IN_PATH}
          onClick={onClose}
        />
      )}
    </>
  );
}
