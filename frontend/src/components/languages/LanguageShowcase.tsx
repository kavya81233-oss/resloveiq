'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mic, FileText, ArrowRight, Check, Edit2, Sparkles, Terminal } from 'lucide-react';

export default function LanguageShowcase() {
  const t = useTranslations('languages');
  const [activeTab, setActiveTab] = useState<'kn' | 'kanglish' | 'voice' | 'en'>('kn');
  const [voiceConfirmed, setVoiceConfirmed] = useState(false);

  const variations = {
    kn: {
      label: t('tabKannada'),
      input: 'ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ, ನೀರು ರಸ್ತೆಯಲ್ಲಿ ವ್ಯರ್ಥವಾಗುತ್ತಿದೆ.',
      notes: 'Native Kannada script via Noto Sans Kannada font engine.',
    },
    kanglish: {
      label: t('tabKanglish'),
      input: 'Namma street alli Cauvery water pipe odeede, neeru raste mele waste aaguthide.',
      notes: 'Colloquial Kannada phonetics expressed in English Latin typography.',
    },
    voice: {
      label: t('tabVoice'),
      input: 'Voice Note Audio (16kHz Whisper large-v3 Transcription): "ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ"',
      notes: 'Audio sampled via microphone with pre-processing noise suppression.',
    },
    en: {
      label: t('tabEnglish'),
      input: 'Cauvery water supply distribution pipe burst on our street, clean water is flooding the roadway.',
      notes: 'Standard English municipal report format.',
    },
  };

  // Structured invariant target output (proving cross-script convergence)
  const unifiedOutput = {
    semantic_intent: 'CIVIC_INFRASTRUCTURE_FAILURE',
    canonical_category: 'WATER_SUPPLY',
    sub_category: 'PIPELINE_RUPTURE',
    target_utility: 'BWSSB',
    severity_factor: 1.4,
    life_safety_flag: false,
    geospatial_sector: 'Jayanagar 4th Block (12.9299° N, 77.5826° E)',
    cluster_affinity_id: 12,
    embedding_dimension: 384,
    convergence_confidence: '96.4%',
  };

  return (
    <section id="languages" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-surface-2 border border-border mb-10 max-w-xl">
          {(['kn', 'kanglish', 'voice', 'en'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setVoiceConfirmed(false);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-brand-gradient text-bg font-bold shadow-md'
                  : 'text-muted hover:text-text'
              }`}
            >
              {variations[tab].label}
            </button>
          ))}
        </div>

        {/* 2-Column Side-by-Side Proof */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Modality Input Form */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-6 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono font-bold uppercase text-primary">
                {t('labelInput')}
              </span>
              <span className="text-[11px] font-mono text-muted">
                Format: {variations[activeTab].label}
              </span>
            </div>

            {/* Input Card Content */}
            <div className="flex-1 flex flex-col justify-center">
              {activeTab === 'voice' ? (
                <div className="flex flex-col gap-4">
                  {/* Animated Waveform */}
                  <div className="p-4 rounded-2xl bg-surface-2 border border-primary/30 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1.5 h-12">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-primary rounded-full animate-bounce"
                          style={{
                            height: `${Math.sin(i * 0.5) * 16 + 24}px`,
                            animationDelay: `${i * 0.04}s`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-primary flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" />
                      {t('voiceRecordingWave')}
                    </span>
                  </div>

                  {/* Transcript Confirmation Box */}
                  <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-3">
                    <span className="text-xs text-muted font-mono">{t('confirmPrompt')}</span>
                    <p className="text-sm font-kannada font-medium text-text">
                      &ldquo;ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ, ನೀರು ರಸ್ತೆಯಲ್ಲಿ ವ್ಯರ್ಥವಾಗುತ್ತಿದೆ.&rdquo;
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setVoiceConfirmed(true)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          voiceConfirmed
                            ? 'bg-success text-bg'
                            : 'bg-primary text-bg hover:opacity-90'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{voiceConfirmed ? 'Confirmed ✓' : t('confirmYes')}</span>
                      </button>
                      <button
                        onClick={() => setVoiceConfirmed(false)}
                        className="py-2 px-3 rounded-xl border border-border text-xs text-muted hover:text-text flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{t('confirmEdit')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3">
                  <p className="text-base sm:text-lg text-text leading-relaxed font-medium">
                    &ldquo;{variations[activeTab].input}&rdquo;
                  </p>
                  <span className="text-xs font-mono text-muted border-t border-border/50 pt-2">
                    {variations[activeTab].notes}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-success">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Vectorized into 384-dimensional multilingual space</span>
            </div>
          </div>

          {/* Right: Same Structured Result */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-6 border border-border bg-[#060B16]">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-mono font-bold uppercase text-accent flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                {t('labelOutput')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-mono font-bold">
                CROSS-SCRIPT INVARIANT
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-2/80 border border-border font-mono text-xs sm:text-sm text-text overflow-x-auto">
              <pre className="text-primary">{JSON.stringify(unifiedOutput, null, 2)}</pre>
            </div>

            <div className="p-3 rounded-xl bg-surface-2 border border-border text-xs text-muted leading-relaxed">
              Regardless of script (Kannada, Kanglish, English, or spoken voice note), the vector
              embedding converges to the exact same incident cluster #{unifiedOutput.cluster_affinity_id}.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
