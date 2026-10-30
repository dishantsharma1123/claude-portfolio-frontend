import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Dishant Sharma AI",
  description: "Chat with an AI assistant about Dishant Sharma's experience, skills, and projects.",
};

// viewport-fit=cover lets safe-area insets apply on notched devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FAF9F5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
