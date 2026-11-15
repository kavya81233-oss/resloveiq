'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check, X, Sparkles } from 'lucide-react';

export default function ComparisonTable() {
  const t = useTranslations('compare');

  const rows = [
    {
      feature: t('row1'),
      legacy: t('row1Legacy'),
      resolve: t('row1Resolve'),
    },
    {
      feature: t('row2'),
      legacy: t('row2Legacy'),
      resolve: t('row2Resolve'),
    },
    {
      feature: t('row3'),
      legacy: t('row3Legacy'),
      resolve: t('row3Resolve'),
    },
    {
      feature: t('row4'),
      legacy: t('row4Legacy'),
      resolve: t('row4Resolve'),
    },
    {
      feature: t('row5'),
      legacy: t('row5Legacy'),
      resolve: t('row5Resolve'),
    },
    {
      feature: t('row6'),
      legacy: t('row6Legacy'),
      resolve: t('row6Resolve'),
    },
  ];

  return (
    <section id="compare" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* Comparison Table */}
        <div className="w-full glass-panel rounded-3xl overflow-hidden border border-border shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-2/80">
                  <th className="py-4 px-6 text-xs font-mono font-bold uppercase text-muted">
                    {t('colFeature')}
                  </th>
                  <th className="py-4 px-6 text-xs font-mono font-bold uppercase text-muted">
                    {t('colLegacy')}
                  </th>
                  <th className="py-4 px-6 text-xs font-mono font-bold uppercase text-primary bg-primary/5 border-l border-primary/20">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('colResolve')}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-4 px-6 font-heading font-semibold text-sm text-text">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-danger shrink-0" />
                        <span>{row.legacy}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-text bg-primary/5 border-l border-primary/20">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-success" />
                        </div>
                        <span className="text-primary font-semibold">{row.resolve}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

