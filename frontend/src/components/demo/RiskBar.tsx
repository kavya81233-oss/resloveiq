'use client';

import React from 'react';
import { RiskResult } from '@/lib/risk';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskBarProps {
  risk: RiskResult | null;
}

export default function RiskBar({ risk }: RiskBarProps) {
  const riskVal = risk?.risk || 0.15;
  const isEscalated = risk?.escalate || false;
  const percentage = Math.round(riskVal * 100);

  return (
    <div className="flex flex-col gap-2 p-3 rounded-2xl bg-surface-2/60 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
          {isEscalated ? (
            <AlertTriangle className="w-4 h-4 text-danger animate-bounce" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-success" />
          )}
          <span>Risk Guard (SLA Monitor)</span>
        </div>
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
            isEscalated
              ? 'bg-danger/20 text-danger border border-danger/40 animate-pulse'
              : 'bg-primary/10 text-primary border border-primary/30'
          }`}
        >
          {percentage}% {isEscalated ? 'ESCALATE' : 'NORMAL'}
        </span>
      </div>

      {/* Progress Bar with 70% threshold marker */}
      <div className="relative w-full h-3 rounded-full bg-border overflow-hidden">
        {/* 70% Escalation Line */}
        <div className="absolute top-0 bottom-0 left-[70%] w-[2px] bg-danger z-10 opacity-70" title="Escalation Threshold (70%)" />
        <div
          className={`h-full transition-all duration-700 ease-out rounded-full ${
            isEscalated ? 'bg-danger' : percentage > 40 ? 'bg-warn' : 'bg-success'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-muted">
        <span>0%</span>
        <span className="text-danger font-semibold">Threshold: 70%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

