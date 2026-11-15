'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function TechMarquee() {
  const t = useTranslations('marquee');

  const row1 = [
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'GSAP ScrollTrigger',
    'Three.js',
    'FastAPI',
    'LangGraph',
  ];

  const row2 = [
    'PostgreSQL 16',
    'pgvector',
    'Claude 3.5 Sonnet',
    'OpenAI Whisper',
    'Telegram Bot API',
    'Docker Compose',
    'Vercel',
    'GitHub Actions',
  ];

  return (
    <section id="tech" className="py-20 bg-surface/20 border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-muted">
          {t('label')}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Row 1 (Left Scrolling) */}
        <div className="flex w-max gap-4 animate-marquee-left hover:[animation-play-state:paused]">
          {[...row1, ...row1, ...row1].map((chip, idx) => (
            <div
              key={idx}
              className="px-6 py-3 rounded-full bg-surface-2 border border-border text-xs sm:text-sm font-mono font-semibold text-text shadow-sm hover:border-primary/50 transition-colors cursor-default"
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Row 2 (Right Scrolling) */}
        <div className="flex w-max gap-4 animate-marquee-right hover:[animation-play-state:paused]">
          {[...row2, ...row2, ...row2].map((chip, idx) => (
            <div
              key={idx}
              className="px-6 py-3 rounded-full bg-surface-2 border border-border text-xs sm:text-sm font-mono font-semibold text-text shadow-sm hover:border-primary/50 transition-colors cursor-default"
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

