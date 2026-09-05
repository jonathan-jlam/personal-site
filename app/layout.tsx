import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "JKWLAM",
  description: "A running log of my personal thoughts, improvements, and hobbies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable} antialiased`}>
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6">
          <Nav />
          <main className="flex-1 py-10">{children}</main>
          <footer className="border-t border-line py-8 text-sm text-muted">
            <p className="font-mono">
              built with next.js · updated{" "}
              {new Date().getFullYear()}
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
