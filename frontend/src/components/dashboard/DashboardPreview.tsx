'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Kanban,
  ShieldAlert,
  Activity,
  Filter,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';

const IncidentMap = dynamic(() => import('./IncidentMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-surface-2 flex items-center justify-center text-muted font-mono text-xs">
      Loading OpenStreetMap GIS layers...
    </div>
  ),
});

export default function DashboardPreview() {
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState<'map' | 'board' | 'risk' | 'audit' | 'funnel'>('map');

  // Realtime Audit Feed streaming every 2s
  const [auditLogs, setAuditLogs] = useState<string[]>([
    '10:14:02 - [UnderstandAgent] Classified complaint #8412 as WATER (confidence: 0.96)',
    '10:14:03 - [ClusterEngine] Merged #8412 into Incident #12 (Jayanagar). Total affected: 15',
    '10:14:04 - [PriorityEngine] Recalculated impact score: 82 (Critical)',
    '10:14:05 - [RouterEngine] Routed to BWSSB Water Supply & Drainage squad',
    '10:14:06 - [ResolutionCopilot] Generated SOP repair draft for review',
  ]);

  useEffect(() => {
    const messages = [
      '10:14:08 - [RiskGuard] SLA velocity check passed (0.24 threshold)',
      '10:14:10 - [ClosureAgent] Dispatched Kannada verification prompt to 15 citizens',
      '10:14:12 - [AuditTrail] Cryptographic telemetry hash signed: 0x8f2d...3a1c',
      '10:14:14 - [UnderstandAgent] Detected Kanglish voice note from Koramangala',
      '10:14:16 - [ClusterEngine] Created root-cause hypothesis: 150mm ductile sleeve fracture',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setAuditLogs((prev) => [messages[idx % messages.length], ...prev.slice(0, 9)]);
      idx++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-bg">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-text tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted text-base sm:text-lg">{t('subtitle')}</p>
        </div>

        {/* Realtime KPI Ribbon */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">{t('statActive')}</span>
              <span className="font-heading font-bold text-xl text-text">5 Incidents</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-border">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">{t('statCitizens')}</span>
              <span className="font-heading font-bold text-xl text-text">82 Informed</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-border">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">{t('statResolved')}</span>
              <span className="font-heading font-bold text-xl text-text">98.4% Verified</span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 border border-border">
            <div className="w-10 h-10 rounded-xl bg-warn/10 flex items-center justify-center text-warn">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">{t('statSla')}</span>
              <span className="font-heading font-bold text-xl text-text">99.1% On-Time</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 p-1.5 rounded-2xl bg-surface-2 border border-border mb-6">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'map' ? 'bg-brand-gradient text-bg shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t('tabMap')}</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'board' ? 'bg-brand-gradient text-bg shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>{t('tabBoard')}</span>
          </button>

          <button
            onClick={() => setActiveTab('risk')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'risk' ? 'bg-brand-gradient text-bg shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t('tabRisk')}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'audit' ? 'bg-brand-gradient text-bg shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t('tabAudit')}</span>
          </button>

          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              activeTab === 'funnel' ? 'bg-brand-gradient text-bg shadow-md' : 'text-muted hover:text-text'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{t('tabFunnel')}</span>
          </button>
        </div>

        {/* Tab Content Display Container */}
        <div className="w-full glass-panel p-6 sm:p-8 rounded-3xl border border-border min-h-[460px] flex flex-col justify-center">
          {activeTab === 'map' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>Bengaluru Urban Geospatial Grid</span>
                <span className="text-primary font-bold">5 Active Incident Clusters</span>
              </div>
              <IncidentMap />
            </div>
          )}

          {activeTab === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Col 1: Triage */}
              <div className="p-4 rounded-2xl bg-surface-2/60 border border-border flex flex-col gap-3">
                <span className="font-heading font-semibold text-xs text-muted uppercase">Triage & Cluster</span>
                <div className="p-3 rounded-xl bg-surface border border-border shadow-sm flex flex-col gap-1.5 hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between text-xs font-bold text-text">
                    <span>#14 - Sewage Leak</span>
                    <span className="text-danger font-mono">P-85</span>
                  </div>
                  <span className="text-[11px] text-muted">Koramangala 5th Block</span>
                </div>
              </div>

              {/* Col 2: In-Progress */}
              <div className="p-4 rounded-2xl bg-surface-2/60 border border-border flex flex-col gap-3">
                <span className="font-heading font-semibold text-xs text-muted uppercase">Field Dispatched</span>
                <div className="p-3 rounded-xl bg-surface border border-primary/40 shadow-sm flex flex-col gap-1.5 hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between text-xs font-bold text-text">
                    <span>#12 - Water Pipe Burst</span>
                    <span className="text-warn font-mono">P-81</span>
                  </div>
                  <span className="text-[11px] text-muted">Jayanagar (BWSSB Crew 04)</span>
                </div>
              </div>

              {/* Col 3: Pending Citizen Verification */}
              <div className="p-4 rounded-2xl bg-surface-2/60 border border-border flex flex-col gap-3">
                <span className="font-heading font-semibold text-xs text-muted uppercase">Citizen Verification</span>
                <div className="p-3 rounded-xl bg-surface border border-success/40 shadow-sm flex flex-col gap-1.5 hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between text-xs font-bold text-text">
                    <span>#09 - Pothole Repaired</span>
                    <span className="text-success font-mono">Verifying</span>
                  </div>
                  <span className="text-[11px] text-muted">Indiranagar (10 Citizens Polled)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="flex flex-col gap-4">
              <span className="text-sm font-heading font-bold text-text">Active Risk Guard Telemetry</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface-2 border border-border flex flex-col gap-2">
                  <span className="text-xs text-muted font-mono">Incident #12 (Jayanagar Water)</span>
                  <div className="flex justify-between text-xs font-bold text-text">
                    <span>Breach Probability</span>
                    <span className="text-warn">38%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-warn rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-2 border border-danger/40 flex flex-col gap-2">
                  <span className="text-xs text-muted font-mono">Incident #14 (Sewage Contamination)</span>
                  <div className="flex justify-between text-xs font-bold text-text">
                    <span>Breach Probability</span>
                    <span className="text-danger font-bold">78% (ESCALATED)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-danger rounded-full animate-pulse" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>Streaming Immutable Agent Event Bus (FastAPI WebSocket)</span>
                <span className="flex items-center gap-1.5 text-success font-bold">
                  <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                  Live (2s interval)
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#060B16] border border-border font-mono text-xs text-text/90 flex flex-col gap-2 max-h-72 overflow-y-auto">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 border-b border-border/30 pb-1.5 last:border-none animate-in fade-in duration-300">
                    <span className="text-primary font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div className="flex flex-col gap-4">
              <span className="text-sm font-heading font-bold text-text">Civic Complaint Resolution Funnel</span>
              <div className="flex flex-col gap-3 max-w-xl mx-auto w-full">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary text-xs font-semibold flex justify-between">
                  <span>1. Complaints Ingested (All Channels)</span>
                  <span className="font-mono">500 (100%)</span>
                </div>
                <div className="p-3 rounded-xl bg-accent/20 border border-accent text-xs font-semibold flex justify-between ml-4">
                  <span>2. Clustered into Incidents</span>
                  <span className="font-mono">18 Incidents (3.6%)</span>
                </div>
                <div className="p-3 rounded-xl bg-warn/20 border border-warn text-xs font-semibold flex justify-between ml-8">
                  <span>3. Human Approved Dispatches</span>
                  <span className="font-mono">18 Dispatched</span>
                </div>
                <div className="p-3 rounded-xl bg-success/20 border border-success text-xs font-semibold flex justify-between ml-12">
                  <span>4. Citizen Confirmed Closures</span>
                  <span className="font-mono">492 Confirmed (98.4%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

