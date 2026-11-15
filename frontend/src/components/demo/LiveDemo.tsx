'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import PhoneMock from './PhoneMock';
import AgentConsole from './AgentConsole';
import { Sparkles, Radio } from 'lucide-react';
import { useDemoStore } from '@/store/demoStore';

export default function LiveDemo() {
  const t = useTranslations('demo');
  const { isLiveMode, toggleLiveMode } = useDemoStore();

  return (
    <section id="demo" className="relative min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary mb-3">
            <Radio className="w-3 h-3 text-primary animate-pulse" />
            <span>{t('simulationNotice')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-text tracking-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* Centerpiece 2-Column Glass Panel */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Citizen Phone Mock (5 cols on lg) */}
          <div className="lg:col-span-5 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-mono font-semibold uppercase text-muted">
                {t('citizenPhoneTitle')}
              </span>
              <span className="text-[11px] font-mono text-primary">Simulated Telegram Client</span>
            </div>
            <PhoneMock />
          </div>

          {/* Right Column: Operations Agent Console (7 cols on lg) */}
          <div className="lg:col-span-7 w-full flex flex-col">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-mono font-semibold uppercase text-muted">
                {t('agentConsoleTitle')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLiveMode()}
                  className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-border bg-surface-2 hover:bg-surface text-muted hover:text-text transition-colors"
                >
                  {isLiveMode ? t('modeLive') : t('modeSimulation')}
                </button>
              </div>
            </div>
            <AgentConsole />
          </div>
        </div>
      </div>
    </section>
  );
}

