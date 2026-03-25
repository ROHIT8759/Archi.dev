import type { Metadata } from "next";
import { Barlow, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
const bodyFont = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const headingFont = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});
export const metadata: Metadata = {
  title: "Archi.dev - Visual Backend Architecture Studio",
  description: "Visually construct backend architectures, generate production-grade code instantly, and deploy with one click. AI-powered scaffolding for modern applications.",
  metadataBase: new URL("https://archi-dev.vercel.app"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
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
      suppressHydrationWarning
      className={`${bodyFont.variable} ${geistMono.variable} ${headingFont.variable}`}
    >
      <body suppressHydrationWarning className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
