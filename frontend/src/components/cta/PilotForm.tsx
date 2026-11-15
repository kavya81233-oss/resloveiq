'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitPilotRequest } from '@/lib/api';
import { useDemoStore } from '@/store/demoStore';
import { Send, CheckCircle2, CloudOff, Sparkles } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization is required'),
  email: z.string().email('Please enter a valid official email address'),
  role: z.enum(['Government', 'Utility', 'Enterprise', 'Student team'], {
    errorMap: () => ({ message: 'Please select your role' }),
  }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PilotForm() {
  const t = useTranslations('cta');
  const { isLiveMode } = useDemoStore();
  const [submitted, setSubmitted] = useState(false);
  const [offlineQueued, setOfflineQueued] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: 'Government',
    },
  });

  const onSubmit = async (values: FormValues) => {
    const res = await submitPilotRequest(values, isLiveMode);
    if (res.success) {
      setOfflineQueued(res.offlineQueued);
      setSubmitted(true);
      reset();
    }
  };

  return (
    <section id="cta" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg overflow-hidden">
      {/* Background Gradient Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-radial blur-3xl pointer-events-none opacity-40" />

      <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-[36px] border border-primary/40 shadow-2xl relative z-10 flex flex-col items-center">
        {/* Banner Title */}
        <div className="text-center max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Civic Partnership Pilot 2026</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-transparent bg-clip-text bg-brand-gradient tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {submitted ? (
          /* Success Animation: Confetti-free SVG Checkmark draw per Section 5.15 */
          <div className="w-full max-w-md py-12 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center text-success">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-draw-check"
                />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-2xl text-text">
              {offlineQueued ? 'Request Queued Offline' : 'Request Received'}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {offlineQueued ? t('offlineNotice') : t('success')}
            </p>
            {offlineQueued && (
              <div className="flex items-center gap-2 text-xs font-mono text-warn">
                <CloudOff className="w-4 h-4" />
                <span>Stored securely in local browser storage</span>
              </div>
            )}
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-6 py-2.5 rounded-full bg-surface-2 border border-border text-xs font-mono text-muted hover:text-text"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Form with Zod validation */
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  {t('name')} *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Ramesh Kumar"
                  className={`bg-surface border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-danger">{errors.name.message}</span>
                )}
              </div>

              {/* Organization */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  {t('organization')} *
                </label>
                <input
                  type="text"
                  {...register('organization')}
                  placeholder="e.g. BBMP / BWSSB / Municipal Corp"
                  className={`bg-surface border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.organization ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.organization && (
                  <span className="text-xs text-danger">{errors.organization.message}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@organization.gov.in"
                  className={`bg-surface border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-danger' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-danger">{errors.email.message}</span>
                )}
              </div>

              {/* Role Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text uppercase tracking-wider">
                  {t('role')} *
                </label>
                <select
                  {...register('role')}
                  className={`bg-surface border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.role ? 'border-danger' : 'border-border'
                  }`}
                >
                  <option value="Government">{t('roleGov')}</option>
                  <option value="Utility">{t('roleUtility')}</option>
                  <option value="Enterprise">{t('roleEnterprise')}</option>
                  <option value="Student team">{t('roleStudent')}</option>
                </select>
                {errors.role && (
                  <span className="text-xs text-danger">{errors.role.message}</span>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-text uppercase tracking-wider">
                {t('message')}
              </label>
              <textarea
                rows={4}
                {...register('message')}
                placeholder="Tell us about your city, ward scope, or deployment timeline..."
                className="bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button (min 48px tap target) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-brand-gradient text-bg font-bold text-base shadow-xl shadow-primary/25 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px] mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>{t('submitting')}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('submit')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

