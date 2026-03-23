import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poetic = Caveat({
  variable: "--font-poetic",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Archi.dev",
  description: "Archi.dev visual backend architecture and code generation studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poetic.variable}`}
    >
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
