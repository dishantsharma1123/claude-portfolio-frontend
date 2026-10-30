// Demo sign-in personas. Purely local: nothing is sent to Google or any server,
// and only the persona id is stored in this browser.
export interface DemoAccount {
  id: string;
  name: string;
  /** Short line shown under the name in the account chooser */
  tagline: string;
  /** Fallback avatar background colour */
  color: string;
  photo: string;
  source: string;
  credit: string;
  license: string;
  licenseUrl: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "elon-musk", name: "Elon Musk", tagline: "Public figure · not their real account", color: "#1F2937",
    photo: "/demo-portraits/elon-musk.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Elon_Musk_Royal_Society_(crop2).jpg",
    credit: "Debbie Rowe / The Royal Society", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  {
    id: "donald-trump", name: "Donald Trump", tagline: "Public figure · not their real account", color: "#B42318",
    photo: "/demo-portraits/donald-trump.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Donald_Trump_official_portrait.jpg",
    credit: "Shealah Craighead / White House", license: "U.S. public domain",
    licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-USGov-POTUS",
  },
  {
    id: "narendra-modi", name: "Narendra Modi", tagline: "Public figure · not their real account", color: "#C2410C",
    photo: "/demo-portraits/narendra-modi.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Narendra_Modi_Portrait_2026.jpg",
    credit: "Prime Minister’s Office, Government of India", license: "GODL-India (Commons listing; unreviewed)",
    licenseUrl: "https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf",
  },
  {
    id: "osama-bin-laden", name: "Osama bin Laden", tagline: "Historical figure · no endorsement", color: "#475569",
    photo: "/demo-portraits/osama-bin-laden.jpg",
    source: "https://commons.wikimedia.org/wiki/File:Osama_bin_Laden_portrait.jpg",
    credit: "Hamid Mir; crop/levels by The Man in Question", license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
];

export const DEMO_SIGN_IN_PATH = "/sign-in";
const ACCOUNT_KEY = "claude-portfolio-demo-account";

/** Returns the signed-in persona, ignoring unknown or tampered ids */
export function loadDemoAccount(): DemoAccount | null {
  try {
    const id = window.localStorage.getItem(ACCOUNT_KEY);
    return DEMO_ACCOUNTS.find((a) => a.id === id) ?? null;
  } catch {
    return null;
  }
}

export function saveDemoAccount(id: string | null): void {
  try {
    if (id && DEMO_ACCOUNTS.some((a) => a.id === id)) window.localStorage.setItem(ACCOUNT_KEY, id);
    else window.localStorage.removeItem(ACCOUNT_KEY);
  } catch {
    // Storage unavailable: the demo sign-in just won't persist.
  }
}