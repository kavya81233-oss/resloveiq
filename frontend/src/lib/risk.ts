export interface RiskInputs {
  elapsed: number;
  sla: number;
  load: number;
  capacity: number;
  noFirstResponse: boolean;
  reopen: number;
}

export interface RiskResult {
  risk: number;
  escalate: boolean;
  factors: {
    elapsedRatio: number;
    loadRatio: number;
    noFirstResponseFactor: number;
    reopenFactor: number;
  };
}

export function calculateRisk(i: RiskInputs): RiskResult {
  const elapsedRatio = Math.min(i.elapsed / Math.max(i.sla, 1), 2);
  const loadRatio = Math.min(i.load / Math.max(i.capacity, 1), 2);
  const noFirstResponseFactor = i.noFirstResponse ? 1 : 0;
  const reopenFactor = Math.min(i.reopen / 2, 1);

  const rawRisk = (0.4 * elapsedRatio) + (0.3 * loadRatio) + (0.2 * noFirstResponseFactor) + (0.1 * reopenFactor);
  const risk = Math.round(Math.min(Math.max(rawRisk, 0), 1) * 100) / 100;
  const escalate = risk >= 0.7;

  return {
    risk,
    escalate,
    factors: {
      elapsedRatio,
      loadRatio,
      noFirstResponseFactor,
      reopenFactor,
    },
  };
}

