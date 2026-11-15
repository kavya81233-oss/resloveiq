'use client';

import React, { useState } from 'react';
import { useDemoStore } from '@/store/demoStore';
import PriorityGauge from './PriorityGauge';
import RiskBar from './RiskBar';
import {
  Brain,
  Network,
  Users,
  Compass,
  FileCode,
  ShieldCheck,
  Check,
  Edit3,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';

export default function AgentConsole() {
  const {
    state,
    understandOutput,
    clusterResult,
    priorityResult,
    routingResult,
    copilotDraft,
    riskResult,
    affectedCount,
    incidentId,
    editCopilotDraft,
    approveFix,
  } = useDemoStore();

  const [isEditingDraft, setIsEditingDraft] = useState(false);

  return (
    <div className="w-full h-full min-h-[640px] rounded-3xl glass-panel p-5 sm:p-6 flex flex-col justify-between gap-5 overflow-y-auto border border-border">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-warn" />
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="font-mono text-xs text-muted ml-2">resolveiq-agent-orchestrator :: live-stream</span>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-surface-2 border border-border text-[11px] font-mono text-primary">
          Pipeline: {state.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Understand JSON */}
        <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-text">
            <div className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-primary" />
              <span>1. Understand Agent</span>
            </div>
            {understandOutput && (
              <span className="font-mono text-[10px] text-success">
                {(understandOutput.confidence * 100).toFixed(0)}% conf
              </span>
            )}
          </div>
          <div className="bg-[#060B16] p-2.5 rounded-xl border border-border/80 font-mono text-[10px] sm:text-[11px] text-text/90 overflow-x-auto max-h-36">
            {understandOutput ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(understandOutput, null, 2)}</pre>
            ) : (
              <span className="text-muted italic">Awaiting citizen intake message...</span>
            )}
          </div>
        </div>

        {/* Step 2: Cluster Output */}
        <div className="p-3.5 rounded-2xl bg-surface-2/60 border border-border flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-text">
            <div className="flex items-center gap-1.5">
              <Network className="w-4 h-4 text-accent" />
              <span>2. Cluster Engine</span>
            </div>
            <span className="font-mono text-[10px] text-accent">Cosine &gt;= 0.82</span>
          </div>

          <div className="bg-surface p-3 rounded-xl border border-border flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text font-bold">Incident #{incidentId}</span>
              <span className="flex items-center gap-1 text-xs text-primary font-mono">
                <Users className="w-3.5 h-3.5" />
                <span>{affectedCount} Citizens Unified</span>
              </span>
            </div>
            <p className="text-[11px] text-muted font-mono leading-relaxed">
              {clusterResult?.reason || '14 complaints merged into 1 incident across Jayanagar corridor.'}
            </p>
          </div>

          {/* Department Router */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-2 border border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Routed Team:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
              {routingResult?.team || 'BWSSB Water Operations'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Priority Gauge & Risk Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriorityGauge priority={priorityResult} />
        <RiskBar risk={riskResult} />
      </div>

      {/* Step 5: Resolution Copilot Plan & Approval */}
      <div className="p-4 rounded-2xl bg-surface-2/80 border border-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" />
            <span className="font-heading font-semibold text-xs text-text">
              Resolution Copilot (SOP Synthesis)
            </span>
          </div>
          <button
            onClick={() => setIsEditingDraft(!isEditingDraft)}
            className="flex items-center gap-1 text-[11px] font-mono text-muted hover:text-text"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingDraft ? 'Done Editing' : 'Edit Draft'}</span>
          </button>
        </div>

        {isEditingDraft ? (
          <textarea
            value={copilotDraft}
            onChange={(e) => editCopilotDraft(e.target.value)}
            rows={3}
            className="w-full bg-bg border border-primary rounded-xl p-2.5 text-xs font-mono text-text focus:outline-none"
          />
        ) : (
          <div className="p-2.5 bg-bg/60 rounded-xl border border-border font-mono text-xs text-text/90 whitespace-pre-wrap leading-relaxed">
            {copilotDraft}
          </div>
        )}

        {/* Human Lead Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-muted flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Human Lead Approval Enforced
          </span>
          <button
            onClick={approveFix}
            disabled={state === 'pending_verification' || state === 'closed'}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              state === 'pending_verification' || state === 'closed'
                ? 'bg-success/20 text-success border border-success/40 cursor-default'
                : 'bg-brand-gradient text-bg hover:opacity-90 shadow-md shadow-primary/20 active:scale-95'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{state === 'pending_verification' ? 'Plan Dispatched ✓' : 'Approve Fix Plan'}</span>
          </button>
        </div>
      </div>

      {/* Reopened Banner Notice if triggered */}
      {state === 'reopened' && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/40 flex items-center gap-2.5 text-xs text-danger font-medium animate-pulse">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>
            Citizen Verification Failed (No)! Case re-opened, priority boosted (+15), and lead alerted via
            escalation webhook.
          </span>
        </div>
      )}
    </div>
  );
}

