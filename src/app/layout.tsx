import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displaySans = Space_Grotesk({
  variable: "--font-display-sans",
  subsets: ["latin"],
});

const codeMono = IBM_Plex_Mono({
  variable: "--font-code-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Edge-AI Sustainability Platform",
  description:
    "AI-native and edge-first platform for carbon tracking and personal energy optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <html lang="en">
        <body className={`${displaySans.variable} ${codeMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <ClerkProvider publishableKey={publishableKey}>
        <body className={`${displaySans.variable} ${codeMono.variable} antialiased`}>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
