'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Inbox,
  GitMerge,
  UserCheck,
  CheckCircle,
  HelpCircle,
  ThumbsUp,
  AlertOctagon,
  Star,
  ArrowUpRight,
} from 'lucide-react';

export default function ClosureTimeline() {
  const t = useTranslations('timeline');
  const [activeFork, setActiveFork] = useState<'yes' | 'no'>('no');

  const mainSteps = [
    { title: t('step1'), icon: Inbox, color: 'text-primary', badge: 'Triage Stage' },
    { title: t('step2'), icon: GitMerge, color: 'text-accent', badge: '14 Merged' },
    { title: t('step3'), icon: UserCheck, color: 'text-primary', badge: 'BWSSB Squad' },
    { title: t('step4'), icon: CheckCircle, color: 'text-success', badge: 'Lead Signed' },
    { title: t('step5'), icon: HelpCircle, color: 'text-warn', badge: 'Kannada Prompt' },
  ];

  return (
    <section id="timeline" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative w-full max-w-2xl flex flex-col items-center">
          {/* Vertical Glowing Connector Line */}
          <div
            className={`absolute top-6 bottom-48 w-0.5 transition-all duration-700 ${
              activeFork === 'no'
                ? 'bg-gradient-to-b from-primary via-warn to-danger shadow-[0_0_12px_rgba(248,113,113,0.8)]'
                : 'bg-gradient-to-b from-primary to-success shadow-[0_0_10px_rgba(52,211,153,0.5)]'
            }`}
          />

          {/* Sequential Steps */}
          {mainSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative z-10 w-full flex items-center gap-6 mb-8">
                {/* Node Pin */}
                <div className="w-12 h-12 rounded-2xl bg-surface border-2 border-border flex items-center justify-center shadow-lg shrink-0">
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>

                {/* Glass Step Card */}
                <div className="flex-1 glass-panel p-4 rounded-2xl border border-border flex items-center justify-between">
                  <span className="font-heading font-semibold text-sm sm:text-base text-text">
                    {step.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-2 text-muted border border-border">
                    {step.badge}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Fork Decision Splitter */}
          <div className="w-full flex flex-col items-center my-6 z-10">
            <span className="text-xs font-mono uppercase text-muted mb-4 tracking-wider">
              Citizen Decision Point (Interactive Fork)
            </span>
            <div className="flex gap-4 p-1.5 rounded-full bg-surface-2 border border-border">
              <button
                onClick={() => setActiveFork('yes')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeFork === 'yes'
                    ? 'bg-success text-bg shadow-md'
                    : 'text-muted hover:text-text'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Simulate Citizen YES</span>
              </button>
              <button
                onClick={() => setActiveFork('no')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeFork === 'no'
                    ? 'bg-danger text-bg shadow-md'
                    : 'text-muted hover:text-text'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Simulate Citizen NO</span>
              </button>
            </div>
          </div>

          {/* Fork Outcome Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 z-10">
            {/* Yes Branch */}
            <div
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col gap-3 ${
                activeFork === 'yes'
                  ? 'glass-panel border-success/60 shadow-lg shadow-success/15 scale-105'
                  : 'bg-surface-2/40 border-border opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 text-success font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>{t('forkYesTitle')}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{t('forkYesDesc')}</p>
              {activeFork === 'yes' && (
                <div className="flex items-center gap-1 text-warn mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-warn animate-bounce" style={{ animationDelay: `${s * 0.1}s` }} />
                  ))}
                  <span className="text-[11px] font-mono text-muted ml-2">Rating Logged</span>
                </div>
              )}
            </div>

            {/* No Branch (Reopens +15) */}
            <div
              className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col gap-3 ${
                activeFork === 'no'
                  ? 'glass-panel border-danger/60 shadow-lg shadow-danger/20 scale-105 animate-pulse'
                  : 'bg-surface-2/40 border-border opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 text-danger font-bold text-sm">
                <AlertOctagon className="w-5 h-5" />
                <span>{t('forkNoTitle')}</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{t('forkNoDesc')}</p>
              {activeFork === 'no' && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-danger/10 border border-danger/30 text-xs font-mono text-danger mt-1">
                  <span>Priority Spike: +15</span>
                  <span className="animate-ping font-bold">● Red Pulse</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

