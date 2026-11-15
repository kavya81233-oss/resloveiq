'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Network,
  Calculator,
  Languages,
  GitMerge,
  Cpu,
  ShieldAlert,
  FileCheck2,
} from 'lucide-react';

interface CardItem {
  titleKey: string;
  descKey: string;
  icon: any;
  color: string;
}

export default function InnovationGrid() {
  const t = useTranslations('innovation');

  const cards: CardItem[] = [
    { titleKey: 'card1Title', descKey: 'card1Desc', icon: CheckCircle, color: 'text-success' },
    { titleKey: 'card2Title', descKey: 'card2Desc', icon: Network, color: 'text-primary' },
    { titleKey: 'card3Title', descKey: 'card3Desc', icon: Calculator, color: 'text-warn' },
    { titleKey: 'card4Title', descKey: 'card4Desc', icon: Languages, color: 'text-accent' },
    { titleKey: 'card5Title', descKey: 'card5Desc', icon: GitMerge, color: 'text-primary' },
    { titleKey: 'card6Title', descKey: 'card6Desc', icon: Cpu, color: 'text-accent' },
    { titleKey: 'card7Title', descKey: 'card7Desc', icon: ShieldAlert, color: 'text-danger' },
    { titleKey: 'card8Title', descKey: 'card8Desc', icon: FileCheck2, color: 'text-success' },
  ];

  return (
    <section id="innovation" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-surface/30 border-y border-border">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* 8-Card Responsive Grid: 4 cols on xl/lg, 2 on sm/md, 1 on xs */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                className="group relative glass-panel p-6 rounded-3xl flex flex-col gap-4 border border-border transition-all duration-300 hover:border-primary/50 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{
                  rotateX: 3,
                  rotateY: -3,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
              >
                {/* Spotlight hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-12 h-12 rounded-2xl bg-surface-2 flex items-center justify-center shadow-inner">
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>

                <h3 className="font-heading font-bold text-lg text-text group-hover:text-primary transition-colors">
                  {t(card.titleKey as any)}
                </h3>

                <p className="text-sm text-muted leading-relaxed">
                  {t(card.descKey as any)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

