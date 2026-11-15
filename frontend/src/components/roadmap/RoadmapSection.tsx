'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check, Clock, Calendar } from 'lucide-react';

export default function RoadmapSection() {
  const t = useTranslations('roadmap');

  return (
    <section id="roadmap" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* 3 Columns */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Now (Core) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-primary/50 shadow-lg shadow-primary/10 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-heading font-bold text-lg text-primary">{t('colNow')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold">
                COMPLETED
              </span>
            </div>
            <ul className="flex flex-col gap-4 text-sm text-text">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{t('colNowItem1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{t('colNowItem2')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{t('colNowItem3')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{t('colNowItem4')}</span>
              </li>
            </ul>
          </div>

          {/* Next */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/40 shadow-lg shadow-accent/10 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-heading font-bold text-lg text-accent">{t('colNext')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-mono font-bold">
                Q1 2027
              </span>
            </div>
            <ul className="flex flex-col gap-4 text-sm text-text">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{t('colNextItem1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{t('colNextItem2')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{t('colNextItem3')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{t('colNextItem4')}</span>
              </li>
            </ul>
          </div>

          {/* Later */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-heading font-bold text-lg text-muted">{t('colLater')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-2 text-muted text-xs font-mono font-bold">
                FUTURE
              </span>
            </div>
            <ul className="flex flex-col gap-4 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <span>{t('colLaterItem1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <span>{t('colLaterItem2')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <span>{t('colLaterItem3')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <span>{t('colLaterItem4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

