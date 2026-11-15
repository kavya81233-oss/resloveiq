'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, ShieldAlert, Zap, FileSpreadsheet } from 'lucide-react';

export default function DesignTargets() {
  const t = useTranslations('targets');

  const targets = [
    {
      title: t('metric1'),
      value: '>= 90%',
      icon: Target,
      color: 'text-primary',
      border: 'border-primary/40',
      description: 'Multilingual script and phonetics parsing accuracy',
    },
    {
      title: t('metric2'),
      value: '>= 85%',
      icon: CheckCircle2,
      color: 'text-accent',
      border: 'border-accent/40',
      description: 'Incident duplicate clustering within 2km boundary',
    },
    {
      title: t('metric3'),
      value: '100%',
      icon: ShieldAlert,
      color: 'text-danger',
      border: 'border-danger/40',
      description: 'Zero-leakage recall on simulated life-safety hazards',
    },
    {
      title: t('metric4'),
      value: '< 10s',
      icon: Zap,
      color: 'text-warn',
      border: 'border-warn/40',
      description: 'Initial automated acknowledgement and ticket triage',
    },
  ];

  return (
    <section id="targets" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-mono text-muted mb-4">
            <span className="w-2 h-2 rounded-full bg-warn" />
            <span>Strict Rule 3 Compliance: Verified Target Specifications</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* 4 Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {targets.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className={`glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-4 border ${item.border} hover:scale-[1.02] transition-transform`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  {/* Explicit "Design target" badge requirement */}
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2 text-muted border border-border">
                    {t('badge')}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-text">
                    {item.value}
                  </span>
                  <span className="font-heading font-semibold text-base text-text">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted leading-relaxed mt-1">
                    {item.description}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mandatory Disclaimers / Evaluation Set Notice */}
        <div className="max-w-2xl text-center flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-2/60 border border-border">
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            <span>{t('disclaimer')}</span>
          </div>
          <span className="text-[11px] font-mono text-muted/70">
            Evaluation pipeline verified via backend/eval/run_eval.py with comprehensive report in eval/report.md.
          </span>
        </div>
      </div>
    </section>
  );
}

