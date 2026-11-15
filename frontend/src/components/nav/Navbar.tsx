'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Sun, Moon, Menu, X, Globe, Radio } from 'lucide-react';
import { useDemoStore } from '@/store/demoStore';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const { isLiveMode, toggleLiveMode } = useDemoStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 40);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    // Replace current locale prefix in pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const navLinks = [
    { href: '#pipeline', label: t('howItWorks') },
    { href: '#demo', label: t('liveDemo') },
    { href: '#innovation', label: t('innovation') },
    { href: '#languages', label: t('languages') },
    { href: '#dashboard', label: t('dashboard') },
    { href: '#tech', label: t('tech') },
    { href: '#faq', label: t('faq') },
  ];

  return (
    <>
      {/* 2px Scroll Progress Bar at very top */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-brand-gradient z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-border shadow-lg shadow-black/20 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo with incident-pin mark */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-gradient p-[1px] flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-surface rounded-[11px] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary animate-pulse-slow" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl tracking-tight text-text">
                Resolve<span className="text-primary">IQ</span>
              </span>
            </div>
            <span className="hidden sm:inline-block ml-1 text-[11px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary">
              {t('badge')}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-text hover:underline underline-offset-8 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live/Simulation Mode Indicator Toggle */}
            <button
              onClick={() => toggleLiveMode()}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: isLiveMode ? 'rgba(52, 211, 153, 0.15)' : 'rgba(56, 189, 248, 0.12)',
                borderColor: isLiveMode ? 'var(--success)' : 'var(--primary)',
                color: isLiveMode ? 'var(--success)' : 'var(--primary)',
              }}
              title="Click to toggle between Interactive Simulation and Live API mode"
              aria-label="Toggle Live API / Simulation Mode"
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveMode ? 'animate-ping' : ''}`} />
              <span>{isLiveMode ? t('liveBadge') : t('simulationBadge')}</span>
            </button>

            {/* Language Toggle: EN | ಕನ್ */}
            <div className="flex items-center bg-surface-2 border border-border rounded-full p-1 text-xs font-semibold">
              <button
                onClick={() => switchLocale('en')}
                className={`px-2.5 py-1 rounded-full transition-all min-h-[32px] min-w-[32px] ${
                  locale === 'en'
                    ? 'bg-brand-gradient text-bg font-bold shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => switchLocale('kn')}
                className={`px-2.5 py-1 rounded-full transition-all font-kannada min-h-[32px] min-w-[32px] ${
                  locale === 'kn'
                    ? 'bg-brand-gradient text-bg font-bold shadow-sm'
                    : 'text-muted hover:text-text'
                }`}
                aria-label="ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ"
              >
                ಕನ್
              </button>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border bg-surface-2 text-muted hover:text-text transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle dark/light theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-warn" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>

            {/* Request a Pilot Primary Button */}
            <a
              href="#cta"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-brand-gradient text-bg hover:opacity-90 shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
            >
              {t('requestPilot')}
            </a>

            {/* Mobile Hamburger Button (min 48px tap target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-muted hover:text-text border border-border bg-surface-2 min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Open mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[65px] bg-bg/95 backdrop-blur-xl border-b border-border p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-text py-2 px-3 rounded-lg hover:bg-surface-2 min-h-[48px] flex items-center transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <button
                  onClick={() => {
                    toggleLiveMode();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl border border-border text-center text-sm font-mono flex items-center justify-center gap-2 bg-surface-2"
                >
                  <Radio className="w-4 h-4 text-primary" />
                  <span>{isLiveMode ? t('liveBadge') : t('simulationBadge')}</span>
                </button>
                <a
                  href="#cta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-xl text-center text-sm font-bold bg-brand-gradient text-bg shadow-lg shadow-primary/25 min-h-[48px] flex items-center justify-center"
                >
                  {t('requestPilot')}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

