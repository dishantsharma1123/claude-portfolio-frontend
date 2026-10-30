import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// Default Tailwind breakpoints and font sizes are intentionally kept.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        claude: {
          bg: "#FAF9F5",
          sidebar: "#F5F4EE",
          hover: "#EDEBE3",
          active: "#E8E6DC",
          border: "#E5E2D9",
          text: "#141413",
          body: "#3D3D3A",
          muted: "#73726C",
          faint: "#9C9A92",
          bubble: "#F0EEE6",
          accent: "#D97757",
          button: "#C6613F",
          "button-hover": "#B5552F",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
