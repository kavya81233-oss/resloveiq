import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="min-h-screen bg-bg text-text py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-border flex flex-col gap-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to ResolveIQ Platform</span>
        </Link>

        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-text">
              Civic Data Privacy & Integrity Policy
            </h1>
            <span className="text-xs font-mono text-muted">
              Section 10.13 Compliance Standard :: Problem Statement AA-02
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 text-sm text-muted leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-heading font-semibold text-text flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              1. What Data is Collected and Why
            </h2>
            <p>
              ResolveIQ operates as a civic grievance management assistant. When you submit a complaint via
              Telegram, web intake, or voice notes, we collect:
            </p>
            <ul className="list-disc list-inside ml-2 flex flex-col gap-1">
              <li>Raw grievance text, voice note transcript, or optional location photo.</li>
              <li>Geographical ward/location (e.g., Jayanagar, Koramangala) strictly to cluster incidents.</li>
              <li>Channel identifier or masked phone number to communicate resolution updates.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-heading font-semibold text-text flex items-center gap-2">
              <Eye className="w-4 h-4 text-warn" />
              2. Phone Number Masking Policy
            </h2>
            <p>
              Under Section 10.8 and 10.13, citizen phone numbers are permanently masked across all
              internal staff and agent views (e.g., <code className="text-text">+91 98*** **321</code>).
              Only system administrators have authorized unmasking access during audited emergency safety escalations.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-heading font-semibold text-text flex items-center gap-2">
              <Database className="w-4 h-4 text-success" />
              3. Data Retention and Object Storage
            </h2>
            <p>
              Evidence photos and voice note recordings are stored in private Cloudflare R2 object storage.
              Pre-signed upload and download URLs are time-limited to expire after exactly 5 minutes.
              Municipal incident telemetry is retained for 12 months for seasonal flood and infrastructure
              predictive analysis, after which citizen contact markers are purged.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

