'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const t = useTranslations('faq');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
    { q: t('q5'), a: t('a5') },
    { q: t('q6'), a: t('a6') },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-mono text-primary mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Civic Architectural Clarity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* Accessible Accordion */}
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`glass-panel rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-primary/50 shadow-md shadow-primary/5' : 'border-border'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-primary min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-text">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-muted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm sm:text-base text-muted leading-relaxed border-t border-border/40 pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

