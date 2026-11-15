import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import axe from 'axe-core';
import PriorityGauge from '@/components/demo/PriorityGauge';
import RiskBar from '@/components/demo/RiskBar';

describe('Accessibility Standards (axe-core WCAG 2.2 AA)', () => {
  it('PriorityGauge passes axe accessibility checks with 0 violations', async () => {
    const { container } = render(
      <PriorityGauge
        priority={{
          score: 81,
          band: 'Critical',
          reason: 'Priority 81: safety risk, 14 users affected',
          parts: { severity: 42, safety: 0, blastRadius: 14, distress: 25, vulnerable: 0, sla: 1 },
        }}
      />
    );
    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });

  it('RiskBar passes axe accessibility checks with 0 violations', async () => {
    const { container } = render(
      <RiskBar
        risk={{
          risk: 0.72,
          escalate: true,
          factors: { elapsedRatio: 0.8, loadRatio: 1.0, noFirstResponseFactor: 1.0, reopenFactor: 0.5 },
        }}
      />
    );
    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });
});

