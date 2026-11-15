'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Github, Shield, Radio, ExternalLink } from 'lucide-react';
import { useDemoStore } from '@/store/demoStore';
import { checkBackendHealth } from '@/lib/api';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const { isLiveMode } = useDemoStore();
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

  useEffect(() => {
    if (isLiveMode) {
      checkBackendHealth().then((res) => {
        setBackendStatus(res.isLive ? 'Operational' : 'Degraded');
      });
    } else {
      setBackendStatus('Simulation Mode');
    }
  }, [isLiveMode]);

  return (
    <footer className="w-full bg-[#03060C] border-t border-border py-16 px-4 sm:px-6 lg:px-8 text-muted">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href={`/${locale}`} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-brand-gradient p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-surface rounded-[11px] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-text">
                Resolve<span className="text-primary">IQ</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm">{t('desc')}</p>

            <div className="flex items-center gap-2 text-xs font-mono text-muted/80">
              <Shield className="w-4 h-4 text-success" />
              <span>{t('builtFor')}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
              Platform Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="#pipeline" className="hover:text-text transition-colors">
                How it works
              </a>
              <a href="#demo" className="hover:text-text transition-colors">
                Live demo
              </a>
              <a href="#innovation" className="hover:text-text transition-colors">
                Innovation
              </a>
              <a href="#languages" className="hover:text-text transition-colors">
                Languages
              </a>
              <a href="#dashboard" className="hover:text-text transition-colors">
                Dashboard
              </a>
              <a href="#tech" className="hover:text-text transition-colors">
                Tech Stack
              </a>
              <a href="#faq" className="hover:text-text transition-colors">
                FAQ
              </a>
              <a href="#cta" className="hover:text-text transition-colors">
                Request Pilot
              </a>
            </div>
          </div>

          {/* Col 3: Status & External Links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
              System Telemetry
            </span>

            {/* Status Badge in footer matching Section 10.12 */}
            <div className="p-3 rounded-2xl bg-surface border border-border flex items-center gap-2.5">
              <Radio
                className={`w-4 h-4 ${
                  isLiveMode
                    ? backendStatus === 'Operational'
                      ? 'text-success animate-pulse'
                      : 'text-warn'
                    : 'text-primary'
                }`}
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase text-muted">Backend Node</span>
                <span className="text-xs font-mono font-bold text-text">{backendStatus}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>{t('github')}</span>
              </a>
              <Link
                href={`/${locale}/privacy`}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('privacy')}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <span>
            © {currentYear} ResolveIQ. {t('rights')}
          </span>
          <span className="text-muted/60">
            Compliant with Section 10.13 Civic Privacy & Phone Masking Policies
          </span>
        </div>
      </div>
    </footer>
  );
}

