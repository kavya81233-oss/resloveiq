'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from '@/components/nav/Navbar';
import Hero from '@/components/hero/Hero';
import ProblemStrip from '@/components/problem/ProblemStrip';
import HowItWorks from '@/components/pipeline/HowItWorks';
import LiveDemo from '@/components/demo/LiveDemo';
import InnovationGrid from '@/components/innovation/InnovationGrid';
import LanguageShowcase from '@/components/languages/LanguageShowcase';
import ClosureTimeline from '@/components/timeline/ClosureTimeline';
import DashboardPreview from '@/components/dashboard/DashboardPreview';
import DesignTargets from '@/components/targets/DesignTargets';
import ComparisonTable from '@/components/compare/ComparisonTable';
import TechMarquee from '@/components/marquee/TechMarquee';
import RoadmapSection from '@/components/roadmap/RoadmapSection';
import FAQSection from '@/components/faq/FAQSection';
import PilotForm from '@/components/cta/PilotForm';
import Footer from '@/components/footer/Footer';

export default function LandingPage() {
  useEffect(() => {
    // Lenis smooth scroll: disabled when prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text selection:bg-primary selection:text-bg">
      {/* 5.1 Sticky navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full">
        {/* 5.2 Hero (100vh, the wow moment) */}
        <Hero />

        {/* 5.3 Problem strip (GSAP ScrollTrigger pinned collapse) */}
        <ProblemStrip />

        {/* 5.4 How it works (pinned horizontal scroll) */}
        <HowItWorks />

        {/* 5.5 Interactive live demo (centerpiece) */}
        <LiveDemo />

        {/* 5.6 Innovation grid */}
        <InnovationGrid />

        {/* 5.7 Languages */}
        <LanguageShowcase />

        {/* 5.8 Verified closure timeline */}
        <ClosureTimeline />

        {/* 5.9 Dashboard preview */}
        <DashboardPreview />

        {/* 5.10 Design targets (not results) */}
        <DesignTargets />

        {/* 5.11 Comparison table */}
        <ComparisonTable />

        {/* 5.12 Tech stack marquee */}
        <TechMarquee />

        {/* 5.13 Roadmap */}
        <RoadmapSection />

        {/* 5.14 FAQ Accordion */}
        <FAQSection />

        {/* 5.15 Pilot request (CTA) */}
        <PilotForm />
      </main>

      {/* 5.16 Footer */}
      <Footer />
    </div>
  );
}

