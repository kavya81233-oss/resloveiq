export interface PriorityInputs {
  severity: number;
  safety: boolean;
  affected: number;
  distress: number;
  vulnerable: boolean;
  slaRisk: number;
}

export interface PriorityResult {
  score: number;
  band: 'Critical' | 'High' | 'Medium' | 'Low';
  reason: string;
  parts: {
    severity: number;
    safety: number;
    blastRadius: number;
    distress: number;
    vulnerable: number;
    sla: number;
  };
}

export function priorityScore(i: {
  severity: number; safety: boolean; affected: number;
  distress: number; vulnerable: boolean; slaRisk: number;
}): PriorityResult {
  const parts = {
    severity: 30 * i.severity,
    safety: i.safety ? 25 : 0,
    blastRadius: 20 * Math.min(i.affected / 20, 1),
    distress: 10 * i.distress,
    vulnerable: i.vulnerable ? 10 : 0,
    sla: 5 * i.slaRisk,
  };
  const score = Math.round(Object.values(parts).reduce((a, b) => a + b, 0));
  const band = score >= 75 ? 'Critical' : score >= 50 ? 'High' : score >= 25 ? 'Medium' : 'Low';
  const reason = `Priority ${score}: ` + [
    parts.safety ? `safety risk (+${parts.safety})` : '',
    `${i.affected} users affected (+${Math.round(parts.blastRadius)})`,
    `severity (+${Math.round(parts.severity)})`,
    parts.distress > 3 ? `distressed tone (+${Math.round(parts.distress)})` : '',
  ].filter(Boolean).join(', ') + '.';
  return { score, band, reason, parts };
}

