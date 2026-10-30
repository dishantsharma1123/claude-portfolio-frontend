// Visitor profile set in Customize (only the display name for the greeting).
const NAME_KEY = "claude-portfolio-name";
export const MAX_NAME_LENGTH = 40;

export function cleanName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH);
}

export function loadName(): string {
  try {
    return cleanName(window.localStorage.getItem(NAME_KEY) ?? "");
  } catch {
    return "";
  }
}

export function saveName(name: string): void {
  try {
    if (name) window.localStorage.setItem(NAME_KEY, name);
    else window.localStorage.removeItem(NAME_KEY);
  } catch {
    // Storage unavailable — the name just won't persist.
  }
}
