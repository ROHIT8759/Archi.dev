"use client";
import { ReactLenis } from "lenis/react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import ScrollSequence from "@/components/landing/ScrollSequence";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import CTAFooter from "@/components/landing/CTAFooter";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen overflow-x-hidden">
        <Navbar />
        <Hero />
        <BentoGrid />
        <ScrollSequence />
        <Testimonials />
        <Pricing />
        <CTAFooter />
      </main>
    </ReactLenis>
  );
}
