'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowDown, Play, Sparkles, Mic, Camera, FileText, Languages } from 'lucide-react';
import Canvas2DFallback from './Canvas2DFallback';

// Dynamically import Three.js ParticleCluster with ssr: false
const ParticleCluster = dynamic(() => import('./ParticleCluster'), {
  ssr: false,
  loading: () => <Canvas2DFallback />,
});

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check WebGL availability and hardware concurrency
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isMobile = window.innerWidth < 768;
      const lowConcurrency = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4;
      if (!gl || (isMobile && lowConcurrency)) {
        setUseFallback(true);
      }
    } catch (e) {
      setUseFallback(true);
    }
  }, []);

  const headline = t('tagline');
  const words = headline.split(' ');

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 pb-8 overflow-hidden bg-bg"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-radial blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-12 my-auto">
        {/* Left Column: Typography & CTAs */}
        <div className="flex-1 max-w-2xl text-left z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-mono text-primary mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem Statement AA-02: Civic Resolution Assistant</span>
          </div>

          {/* Mask-slide word-by-word reveal */}
          <h1
            className={`font-heading font-extrabold tracking-tight text-text leading-[1.12] mb-6 ${
              locale === 'kn' ? 'font-kannada text-3xl sm:text-5xl lg:text-6xl' : 'text-4xl sm:text-6xl lg:text-7xl'
            }`}
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-top">
                <motion.span
                  className="inline-block"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.65,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Sub-headline */}
          <motion.p
            className={`text-muted text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-xl ${
              locale === 'kn' ? 'font-kannada leading-[1.8]' : ''
            }`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: words.length * 0.06 + 0.1 }}
          >
            {t('subheadline')}
          </motion.p>

          {/* Buttons with magnetic hover */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: words.length * 0.06 + 0.2 }}
          >
            <a
              href="#demo"
              className="px-6 py-3.5 rounded-full text-sm sm:text-base font-bold bg-brand-gradient text-bg hover:opacity-95 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center min-h-[48px]"
            >
              {t('tryDemo')}
            </a>
            <a
              href="#pipeline"
              className="px-6 py-3.5 rounded-full text-sm sm:text-base font-medium border border-border bg-surface-2 text-text hover:bg-surface hover:border-primary/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 min-h-[48px]"
            >
              <Play className="w-4 h-4 text-primary fill-primary" />
              <span>{t('watchHow')}</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Hero 3D / 2D Cluster Visual + Orbiting Glass Chips */}
        <div className="flex-1 w-full max-w-xl lg:max-w-2xl h-[420px] sm:h-[480px] lg:h-[540px] relative flex items-center justify-center">
          {/* Orbiting Glass Chips */}
          <motion.div
            className="absolute -top-2 left-6 z-20 px-3.5 py-1.5 rounded-full glass-panel flex items-center gap-2 text-xs font-medium text-text shadow-md pointer-events-none"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          >
            <Languages className="w-3.5 h-3.5 text-primary" />
            <span>{t('chipKannada')}</span>
          </motion.div>

          <motion.div
            className="absolute top-16 -right-2 z-20 px-3.5 py-1.5 rounded-full glass-panel flex items-center gap-2 text-xs font-medium text-text shadow-md pointer-events-none"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
          >
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>{t('chipKanglish')}</span>
          </motion.div>

          <motion.div
            className="absolute bottom-16 -left-3 z-20 px-3.5 py-1.5 rounded-full glass-panel flex items-center gap-2 text-xs font-medium text-text shadow-md pointer-events-none"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 1 }}
          >
            <Mic className="w-3.5 h-3.5 text-success" />
            <span>{t('chipVoice')}</span>
          </motion.div>

          <motion.div
            className="absolute bottom-2 right-8 z-20 px-3.5 py-1.5 rounded-full glass-panel flex items-center gap-2 text-xs font-medium text-text shadow-md pointer-events-none"
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1.5 }}
          >
            <Camera className="w-3.5 h-3.5 text-warn" />
            <span>{t('chipPhoto')}</span>
          </motion.div>

          {/* Visual Container */}
          <div className="w-full h-full rounded-3xl overflow-hidden glass-panel relative p-2">
            {useFallback ? <Canvas2DFallback /> : <ParticleCluster />}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-mono text-muted bg-surface/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
              {t('interactiveIllustration')}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Cue (Animated Chevron) */}
      <div className="w-full flex flex-col items-center justify-center gap-2 pt-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
          {t('scrollPrompt')}
        </span>
        <a
          href="#problem"
          className="p-2 text-muted hover:text-primary transition-colors animate-bounce focus:outline-none"
          aria-label="Scroll to next section"
        >
          <ArrowDown className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

