import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mentra — Grow Through Conversations",
  description:
    "Chat with AI personas inspired by India's greatest minds. Level up your wisdom, build streaks, complete quests.",
  keywords: [
    "AI chat",
    "Indian wisdom",
    "personal growth",
    "mentorship",
    "gamified",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakarta.variable} antialiased min-h-screen bg-[var(--background)] text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
