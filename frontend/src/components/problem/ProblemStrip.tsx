'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Ticket, MapPin, CopyX, SearchX, ShieldAlert, BotOff, MessageSquareOff } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProblemStrip() {
  const t = useTranslations('problem');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ticketGridRef = useRef<HTMLDivElement | null>(null);
  const singlePinRef = useRef<HTMLDivElement | null>(null);
  const caption1Ref = useRef<HTMLParagraphElement | null>(null);
  const caption2Ref = useRef<HTMLParagraphElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
        },
      });

      // 1. Collapse 500 ticket grid into single pin
      tl.to(ticketGridRef.current, {
        scale: 0.15,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
      })
        .to(
          caption1Ref.current,
          {
            opacity: 0,
            y: -20,
            duration: 0.4,
          },
          '<'
        )
        // 2. Expand single incident pin
        .fromTo(
          singlePinRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
        )
        .fromTo(
          caption2Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '<+=0.2'
        )
        // 3. Fade in 5 problem cards
        .fromTo(
          cardsRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          '+=0.2'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const problemCards = [
    {
      title: t('card1Title'),
      desc: t('card1Desc'),
      icon: CopyX,
      color: 'text-danger',
      border: 'border-danger/30',
    },
    {
      title: t('card2Title'),
      desc: t('card2Desc'),
      icon: SearchX,
      color: 'text-warn',
      border: 'border-warn/30',
    },
    {
      title: t('card3Title'),
      desc: t('card3Desc'),
      icon: ShieldAlert,
      color: 'text-danger',
      border: 'border-danger/30',
    },
    {
      title: t('card4Title'),
      desc: t('card4Desc'),
      icon: BotOff,
      color: 'text-muted',
      border: 'border-muted/30',
    },
    {
      title: t('card5Title'),
      desc: t('card5Desc'),
      icon: MessageSquareOff,
      color: 'text-accent',
      border: 'border-accent/30',
    },
  ];

  return (
    <section
      id="problem"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 bg-surface/40 border-y border-border overflow-hidden"
    >
      {/* Transformation Visual Stage */}
      <div className="relative w-full max-w-4xl h-[260px] sm:h-[300px] flex flex-col items-center justify-center my-6">
        {/* Ticket Grid (represents 500 tickets) */}
        <div
          ref={ticketGridRef}
          className="grid grid-cols-12 sm:grid-cols-20 gap-1.5 opacity-90 transition-transform max-w-2xl"
        >
          {Array.from({ length: 120 }).map((_, i) => (
            <Ticket
              key={i}
              className="w-4 h-4 text-primary/70 animate-pulse"
              style={{ animationDelay: `${(i % 15) * 0.1}s` }}
            />
          ))}
        </div>

        {/* Caption 1 */}
        <p
          ref={caption1Ref}
          className="text-lg sm:text-2xl font-heading font-semibold text-text text-center mt-6"
        >
          {t('step1Caption')}
        </p>

        {/* Collapsed Single Incident Pin */}
        <div
          ref={singlePinRef}
          className="absolute inset-0 flex flex-col items-center justify-center opacity-0 scale-0 pointer-events-none"
        >
          <div className="w-20 h-20 rounded-full bg-brand-gradient p-1 flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
            <div className="w-full h-full bg-surface rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
          </div>
          <p
            ref={caption2Ref}
            className="text-lg sm:text-2xl font-heading font-bold text-transparent bg-clip-text bg-brand-gradient text-center mt-4"
          >
            {t('step2Caption')}
          </p>
        </div>
      </div>

      {/* 5 Problem Cards */}
      <div
        ref={cardsRef}
        className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8"
      >
        {problemCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl flex flex-col gap-3 border ${card.border} hover:scale-[1.02] transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <h3 className="font-heading font-semibold text-base text-text">{card.title}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

