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
  title: "Archi.dev - Visual Backend Architecture Studio",
  description: "Visually construct backend architectures, generate production-grade code instantly, and deploy with one click. AI-powered scaffolding for modern applications.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Archi.dev - Visual Backend Architecture Studio",
    description: "Visually construct backend architectures and deploy with AI-powered code generation",
    url: "https://archi-dev.vercel.app",
    siteName: "Archi.dev",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Archi.dev - Visual Backend Architecture Studio",
    description: "Visually construct backend architectures and deploy with AI-powered code generation",
    images: ["/preview.png"],
  },
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
