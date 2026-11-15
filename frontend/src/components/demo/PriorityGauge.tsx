'use client';

import React from 'react';
import { PriorityResult } from '@/lib/scoring';

interface PriorityGaugeProps {
  priority: PriorityResult | null;
}

export default function PriorityGauge({ priority }: PriorityGaugeProps) {
  const score = priority?.score || 0;
  const band = priority?.band || 'Low';

  const getColor = () => {
    if (score >= 75) return '#F87171'; // danger
    if (score >= 50) return '#FBBF24'; // warn
    if (score >= 25) return '#38BDF8'; // primary
    return '#8A97B2'; // muted
  };

  // Semi-circle SVG gauge calculation
  const radius = 54;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-2/60 border border-border">
      <div className="relative w-36 h-20 flex items-center justify-center overflow-hidden">
        <svg className="w-36 h-36 -rotate-180" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset="0"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="font-heading font-extrabold text-2xl text-text">{score}</span>
          <span
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${getColor()}22`,
              color: getColor(),
              border: `1px solid ${getColor()}55`,
            }}
          >
            {band}
          </span>
        </div>
      </div>
      {priority?.reason && (
        <p className="text-[11px] font-mono text-muted text-center mt-2 px-2 leading-relaxed">
          {priority.reason}
        </p>
      )}
    </div>
  );
}

