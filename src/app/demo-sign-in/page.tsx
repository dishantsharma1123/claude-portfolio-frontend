"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoAvatar, DemoSignInMark } from "@/components/DemoIdentity";
import { DEMO_ACCOUNTS, saveDemoAccount, type DemoAccount } from "@/lib/demoAccounts";

const REDIRECT_DELAY_MS = 800;

/**
 * Account chooser for the demo sign-in. It looks like a typical SSO picker but
 * is clearly labelled: no Google connection, no email or password, nothing
 * leaves the browser. Choosing a persona stores its id and returns home.
 */
export default function DemoSignInPage() {
  const router = useRouter();
  const [signingIn, setSigningIn] = useState<DemoAccount | null>(null);
  const [selected, setSelected] = useState<DemoAccount | null>(null);
  const [accepted, setAccepted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const choose = (account: DemoAccount) => {
    if (signingIn || !accepted) return;
    setSigningIn(account);
    saveDemoAccount(account.id);
    timer.current = setTimeout(() => router.replace("/"), REDIRECT_DELAY_MS);
  };

  return (
    // body has overflow:hidden for the chat layout, so this page scrolls itself.
    // my-auto (not justify-center) keeps the card centred when short and
    // top-aligned when taller than the screen, so nothing is clipped.
    <main className="flex h-dvh-screen w-full flex-col items-center overflow-y-auto bg-claude-bg px-4 py-10">
      <div className="claude-fade-in my-auto w-full max-w-[26rem] shrink-0 rounded-2xl border-[0.5px] border-claude-border bg-white p-6 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.06)] sm:p-8">
        <div className="flex items-center gap-2"><DemoSignInMark /><p className="font-serif text-[22px] font-medium tracking-tight text-claude-text">Dishant Sharma AI</p></div>

        <div
          role="note"
          className="mt-4 rounded-lg border-[0.5px] border-[#F5C26B] bg-[#FFF8E6] px-3 py-2 text-[12.5px] leading-snug text-[#7A4B00]"
        >
          <span className="font-medium">sign-in.</span> Not connected to Google or any real account. No email,
          password or personal data is collected.
        </div>

        {signingIn ? (
          <div role="status" className="flex flex-col items-center py-10 text-center">
            <span
              aria-hidden="true"
              className="size-8 animate-spin rounded-full border-2 border-claude-border border-t-claude-button"
            />
            <p className="mt-4 text-[14px] text-claude-text">Signing in as {signingIn.name}…</p>
            <p className="mt-1 text-[12.5px] text-claude-muted">Taking you back to the portfolio</p>
          </div>
        ) : selected ? (
          <section aria-labelledby="consent-heading" className="mt-6">
            <h1 id="consent-heading" className="text-[20px] font-medium text-claude-text">Review sign-in</h1>
            <div className="my-4 flex items-center gap-3 rounded-lg border border-claude-border p-3">
              <DemoAvatar key={selected.id} account={selected} size="large" />
              <div><p className="text-sm font-medium">{selected.name}</p><p className="text-xs text-claude-muted">Not a real account</p></div>
            </div>
            <p className="text-sm leading-relaxed text-claude-body">Continuing sets this portfolio’s display name and avatar to the selected profile. It does not authenticate you or grant access to anyone’s account.</p>
            <details className="mt-4 rounded-lg border border-claude-border p-3 text-sm">
              <summary className="cursor-pointer font-medium">Terms &amp; local storage notice</summary>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-claude-body">
                <li>This is a UI simulation, not Google OAuth. No Google permissions, passwords, email addresses or tokens are requested.</li>
                <li>Only the chosen persona ID is saved by this flow in this browser’s local storage until you log out or clear site data.</li>
                <li>Existing portfolio chats and preferences have their own browser storage. Messages you send to the assistant are processed by the portfolio backend; this notice is not a complete site privacy policy.</li>
                <li>Names and photos identify the profile subjects only. No affiliation, endorsement, or promotion of their views is implied.</li>
              </ul>
            </details>
            <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm leading-relaxed text-claude-body">
              <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 accent-claude-button" />
              <span>I understand this is a simulated sign-in and agree to the terms and local storage described above.</span>
            </label>
            <div className="mt-6 flex justify-between gap-3">
              <button type="button" onClick={() => { setSelected(null); setAccepted(false); }} className="rounded-lg border border-claude-border px-3 py-2 text-sm hover:bg-claude-hover">Back</button>
              <button type="button" disabled={!accepted} onClick={() => choose(selected)} className="rounded-lg bg-claude-button px-4 py-2 text-sm font-medium text-white hover:bg-claude-button-hover disabled:cursor-not-allowed disabled:opacity-40">Agree &amp; continue</button>
            </div>
            <button type="button" onClick={() => router.replace("/")} className="mt-3 w-full rounded-lg py-2 text-sm text-claude-muted hover:bg-claude-hover">Cancel sign-in</button>
          </section>
        ) : (
          <>
            <h1 className="mt-6 text-[20px] font-medium text-claude-text">Choose an account</h1>
            <p className="mt-1 text-[14px] text-claude-muted">to continue to Dishant Sharma AI</p>

            <ul className="mt-5 divide-y-[0.5px] divide-claude-border border-y-[0.5px] border-claude-border">
              {DEMO_ACCOUNTS.map((account) => (
                <li key={account.id}>
                  <button
                    type="button"
                    onClick={() => { setSelected(account); setAccepted(false); }}
                    className="flex w-full items-center gap-3 px-2 py-3 text-left transition-colors hover:bg-claude-hover focus-visible:bg-claude-hover focus-visible:outline-none"
                  >
                    <DemoAvatar key={account.id} account={account} size="large" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium text-claude-text">
                        {account.name}
                      </span>
                      <span className="block truncate text-[12.5px] text-claude-muted">{account.tagline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[12.5px] leading-snug text-claude-muted">
              These personas are fictional placeholders inspired by public figures. They are not their real accounts
              and are not affiliated with or endorsed by them.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.replace("/")}
                className="flex h-8 items-center rounded-lg border-[0.5px] border-claude-border px-3 text-[13.5px] text-claude-body transition-colors hover:bg-claude-hover"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        <details className="mt-5 border-t border-claude-border pt-3 text-xs text-claude-muted">
          <summary className="cursor-pointer">Photo credits &amp; reuse notices</summary>
          <ul className="mt-3 space-y-3">
            {DEMO_ACCOUNTS.map((account) => (
              <li key={account.id}>
                <a className="underline" href={account.source} target="_blank" rel="noopener noreferrer">{account.name}: {account.credit}</a>{" · "}
                <a className="underline" href={account.licenseUrl} target="_blank" rel="noopener noreferrer">{account.license}</a>. Displayed with a circular crop.
              </li>
            ))}
          </ul>
          <p className="mt-3">The historical portrait source flags regional restrictions on non-educational use. Review applicable law before public deployment. The Modi image’s Commons licence listing is unreviewed; verify it before publishing.</p>
        </details>
      </div>
    </main>
  );
}