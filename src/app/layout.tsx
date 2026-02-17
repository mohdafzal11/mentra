import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MimChat — Grow Through Conversations",
  description:
    "Chat with AI personas inspired by India's greatest minds. Level up your wisdom, build streaks, complete quests.",
  keywords: [
    "AI chat",
    "Indian wisdom",
    "personal growth",
    "mentorship",
    "gamified",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)] text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
