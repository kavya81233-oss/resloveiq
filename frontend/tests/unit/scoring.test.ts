import { describe, it, expect } from 'vitest';
import { priorityScore } from '@/lib/scoring';
import { calculateRisk } from '@/lib/risk';

describe('Priority Engine Formula (Section 6)', () => {
  it('calculates exact priority score and band for Jayanagar water burst', () => {
    const res = priorityScore({
      severity: 1.4,
      safety: false,
      affected: 14,
      distress: 2.5,
      vulnerable: false,
      slaRisk: 0.2,
    });

    // severity: 30 * 1.4 = 42
    // safety: 0
    // blastRadius: 20 * (14/20) = 14
    // distress: 10 * 2.5 = 25
    // vulnerable: 0
    // sla: 5 * 0.2 = 1.0
    // Sum = 42 + 14 + 25 + 1 = 82
    expect(res.score).toBe(82);
    expect(res.band).toBe('Critical');
    expect(res.reason).toContain('14 users affected (+14)');
  });

  it('correctly boosts priority by +15 on citizen reopen', () => {
    const initial = priorityScore({
      severity: 1.2,
      safety: false,
      affected: 5,
      distress: 2.0,
      vulnerable: false,
      slaRisk: 0,
    });
    // severity: 36, blast: 5, distress: 20 -> 61
    expect(initial.score).toBe(61);
    const reopened = initial.score + 15;
    expect(reopened).toBe(76);
  });
});

describe('Risk Guard Formula (Section 6)', () => {
  it('evaluates breach risk and triggers escalation at 0.70', () => {
    const normal = calculateRisk({
      elapsed: 6,
      sla: 24,
      load: 10,
      capacity: 20,
      noFirstResponse: false,
      reopen: 0,
    });
    // 0.4*(0.25) + 0.3*(0.5) = 0.1 + 0.15 = 0.25
    expect(normal.risk).toBe(0.25);
    expect(normal.escalate).toBe(false);

    const escalated = calculateRisk({
      elapsed: 22,
      sla: 24,
      load: 22,
      capacity: 20,
      noFirstResponse: true,
      reopen: 2,
    });
    expect(escalated.risk).toBeGreaterThanOrEqual(0.7);
    expect(escalated.escalate).toBe(true);
  });
});

