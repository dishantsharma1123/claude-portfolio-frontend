"use client";

import { useState } from "react";
import type { DemoAccount } from "@/lib/demoAccounts";

/** Portfolio-owned "G" monogram in the site's colours; deliberately not Google's multicolour G. */
export function DemoSignInMark() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#C6613F" />
      <path d="M16 8.5A5 5 0 1 0 17 12h-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DemoAvatar({ account, size = "small" }: { account: DemoAccount; size?: "small" | "large" }) {
  const [failed, setFailed] = useState(false);
  const initials = account.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: account.color }}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium text-white ${size === "large" ? "size-10 text-[13px]" : "size-7 text-[11px]"}`}
    >
      {failed ? initials : (
        // Local, attributed portraits: no third-party requests or image tracking.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={account.photo} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover object-top" />
      )}
    </span>
  );
}