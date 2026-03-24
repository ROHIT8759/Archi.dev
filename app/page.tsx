"use client";
import { ReactLenis } from "lenis/react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import ScrollSequence from "@/components/landing/ScrollSequence";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen overflow-x-hidden">
        <Navbar />
        <Hero />
        <BentoGrid />
        <ScrollSequence />
        <Testimonials />
        <Footer />
      </main>
    </ReactLenis>
  );
}
