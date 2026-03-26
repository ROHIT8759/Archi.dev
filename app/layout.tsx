import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  variable: "--font-heading",
  subsets: ["latin"],
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  subsets: ["latin"],
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

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
      className={`${instrumentSerif.variable} ${barlow.variable} bg-black text-white`}
    >
      <body suppressHydrationWarning className="antialiased min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}
