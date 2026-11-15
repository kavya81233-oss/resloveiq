'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Brain, Network, Gauge, Navigation, CheckCircle2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HowItWorks() {
  const t = useTranslations('pipeline');
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!isDesktop || mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalScroll = track.scrollWidth - window.innerWidth + 120;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: 1,
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Brain,
      color: 'text-primary',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl font-mono text-[11px] flex flex-col gap-1.5 border border-border">
          <div className="text-muted line-through">&quot;Namma street alli water pipe odeede&quot;</div>
          <div className="text-success flex items-center gap-1 font-semibold">
            <ArrowRight className="w-3 h-3 text-primary" />
            <span>Category: Water | Severity: 1.4 | Loc: Jayanagar</span>
          </div>
        </div>
      ),
    },
    {
      num: 2,
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Network,
      color: 'text-accent',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl flex items-center justify-around border border-border h-24">
          <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
          <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
          <ArrowRight className="w-4 h-4 text-muted" />
          <div className="px-3 py-1.5 rounded-lg bg-brand-gradient text-bg font-bold text-xs shadow-md">
            Incident #12 (14 Users)
          </div>
        </div>
      ),
    },
    {
      num: 3,
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: Gauge,
      color: 'text-warn',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl flex flex-col gap-2 border border-border">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-text">Impact Gauge</span>
            <span className="font-mono font-bold text-warn text-base">81 / 100</span>
          </div>
          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-warn rounded-full" style={{ width: '81%' }} />
          </div>
          <span className="text-[10px] text-muted font-mono">Priority 81: 14 users (+14), severity (+42)</span>
        </div>
      ),
    },
    {
      num: 4,
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: Navigation,
      color: 'text-primary',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl flex items-center justify-between border border-border">
          <div className="text-xs text-muted">Water Category</div>
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary text-primary text-xs font-semibold">
            BWSSB Water Supply
          </div>
        </div>
      ),
    },
    {
      num: 5,
      title: t('step5Title'),
      desc: t('step5Desc'),
      icon: CheckCircle2,
      color: 'text-success',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl flex flex-col gap-2 border border-border">
          <div className="text-[11px] text-muted font-mono">Copilot: &quot;Dispatch 150mm iron clamp&quot;</div>
          <div className="self-end px-3 py-1 rounded bg-success/20 border border-success text-success text-xs font-semibold">
            Lead Approved ✓
          </div>
        </div>
      ),
    },
    {
      num: 6,
      title: t('step6Title'),
      desc: t('step6Desc'),
      icon: ShieldCheck,
      color: 'text-danger',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl flex flex-col gap-2 border border-border">
          <div className="flex justify-between text-xs">
            <span className="text-text font-semibold">Breach Risk</span>
            <span className="font-mono text-danger font-bold">0.72 (Escalate!)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-danger rounded-full animate-pulse" style={{ width: '72%' }} />
          </div>
        </div>
      ),
    },
    {
      num: 7,
      title: t('step7Title'),
      desc: t('step7Desc'),
      icon: UserCheck,
      color: 'text-accent',
      miniVisual: (
        <div className="bg-surface-2 p-3 rounded-xl flex flex-col items-center gap-2 border border-border">
          <span className="text-xs text-text font-medium text-center">Citizen: &quot;Is it fixed?&quot;</span>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded bg-success/20 text-success text-xs font-bold">Yes (Closed)</span>
            <span className="px-3 py-1 rounded bg-danger/20 text-danger text-xs font-bold">No (Reopen +15)</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 bg-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full mb-10 text-left">
        <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-3">
          {t('title')}
        </h2>
        <p className="text-muted text-base sm:text-lg max-w-2xl">{t('subtitle')}</p>
      </div>

      {/* Horizontal scroll track on desktop; vertical stack on mobile */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row gap-6 w-full lg:w-max pb-6 items-stretch"
      >
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="w-full lg:w-[420px] glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-6 border border-border shrink-0 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <span className="font-mono text-2xl font-bold text-muted/40">0{step.num}</span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-heading font-bold text-xl text-text">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed min-h-[44px]">{step.desc}</p>
              </div>

              <div className="mt-auto">{step.miniVisual}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
