import { create } from 'zustand';
import { SCRIPTED_COMPLAINTS, ScriptedComplaint, SEED_AREAS } from '@/lib/demoData';
import { priorityScore, PriorityResult } from '@/lib/scoring';
import { calculateRisk, RiskResult } from '@/lib/risk';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

export type DemoState =
  | 'idle'
  | 'understanding'
  | 'clustered'
  | 'prioritized'
  | 'assigned'
  | 'fix_approved'
  | 'pending_verification'
  | 'closed'
  | 'reopened';

export interface ChatMessage {
  id: string;
  sender: 'citizen' | 'system';
  text: string;
  timestamp: string;
  isVerificationPrompt?: boolean;
}

interface DemoStore {
  state: DemoState;
  isLiveMode: boolean;
  selectedScriptId: string | null;
  activeComplaintText: string;
  chatMessages: ChatMessage[];
  affectedCount: number;
  incidentId: number;
  caseId: number | null;
  reopenCount: number;

  // Agent Pipeline Outputs
  understandOutput: {
    language: string;
    kannada_text: string;
    translated_text: string;
    category: string;
    severity: number;
    safety_flag: boolean;
    location: string;
    confidence: number;
  } | null;

  clusterResult: {
    action: string;
    similarity: number;
    incidentId: number;
    reason: string;
  } | null;

  priorityResult: PriorityResult | null;

  routingResult: {
    team: string;
    reason: string;
  } | null;

  copilotDraft: string;
  riskResult: RiskResult | null;

  // Actions
  toggleLiveMode: (val?: boolean) => void;
  sendComplaint: (text: string, scriptId?: string) => Promise<void>;
  editCopilotDraft: (text: string) => void;
  approveFix: () => Promise<void>;
  submitVerification: (confirmed: boolean, rating?: number) => Promise<void>;
  resetDemo: () => void;
}

const initialCopilot = "1. Isolate sector supply valve.\n2. Deploy BWSSB excavation and pipe restoration team.\n3. Send restoration ETA update to affected citizens.";

export const useDemoStore = create<DemoStore>((set, get) => ({
  state: 'idle',
  isLiveMode: false,
  selectedScriptId: null,
  activeComplaintText: '',
  chatMessages: [
    {
      id: 'init-1',
      sender: 'system',
      text: 'ನಮಸ್ಕಾರ, ResolveIQ ನಾಗರಿಕ ದೂರು ಸಹಾಯಕ ವ್ಯವಸ್ಥೆಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಕನ್ನಡ, ಕಾಂಗ್ಲಿಷ್ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ತಿಳಿಸಿ.',
      timestamp: '10:00 AM',
    },
  ],
  affectedCount: 14,
  incidentId: 12,
  caseId: null,
  reopenCount: 0,
  understandOutput: null,
  clusterResult: null,
  priorityResult: null,
  routingResult: null,
  copilotDraft: initialCopilot,
  riskResult: null,

  toggleLiveMode: (val) => set((s) => ({ isLiveMode: val !== undefined ? val : !s.isLiveMode })),

  sendComplaint: async (rawText: string, scriptId?: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const textToSend = (rawText || '').trim();

    set((s) => ({
      state: 'understanding',
      selectedScriptId: scriptId || null,
      activeComplaintText: textToSend,
      chatMessages: [
        ...s.chatMessages,
        {
          id: `cit-${Date.now()}`,
          sender: 'citizen',
          text: textToSend,
          timestamp: timeNow,
        },
      ],
    }));

    // Check if live backend / Vercel NVIDIA NIM API is available
    let backendSucceeded = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const endpoint = typeof window !== 'undefined' ? '/api/complaints' : `${API_BASE}/api/v1/complaints`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSend,
          channel: 'web',
          user_ref: 'citizen_web',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const c = data.complaint;
        const incId = data.incident_id || get().incidentId;
        const pScore = data.priority_score;
        const pBand = data.priority_band;
        const pReason = data.reason;

        set({
          caseId: data.case_id,
          incidentId: incId,
          understandOutput: {
            language: c.language || 'kn',
            kannada_text: c.kannada_text || textToSend,
            translated_text: c.translated_text || textToSend,
            category: c.category || 'water',
            severity: c.severity || 1.4,
            safety_flag: c.safety_flag || false,
            location: c.location || 'Jayanagar',
            confidence: c.confidence || 0.95,
          },
          state: 'clustered',
        });

        await new Promise((r) => setTimeout(r, 350));
        const newAffected = get().affectedCount + 1;
        set({
          affectedCount: newAffected,
          clusterResult: {
            action: 'JOIN',
            similarity: 0.92,
            incidentId: incId,
            reason: `Joined Incident #${incId} (similarity 0.92, ${c.category} in ${c.location || 'Bengaluru'})`,
          },
          state: 'prioritized',
        });

        await new Promise((r) => setTimeout(r, 300));
        set({
          priorityResult: {
            score: pScore,
            band: pBand,
            reason: pReason,
            parts: {
              severity: 30 * (c.severity || 1.4),
              safety: c.safety_flag ? 25 : 0,
              blastRadius: 20 * Math.min(newAffected / 20, 1),
              distress: 25,
              vulnerable: 0,
              sla: 1,
            },
          },
          state: 'assigned',
        });

        await new Promise((r) => setTimeout(r, 250));
        const teamName = c.category === 'electricity' ? 'BESCOM Electrical Operations' : (c.category === 'road' ? 'BBMP Road Infrastructure' : 'BWSSB Water Supply & Drainage');
        set({
          routingResult: {
            team: teamName,
            reason: `Routed to ${teamName} (0.5 skill match + 0.3 workload + 0.2 SLA reliability)`,
          },
          copilotDraft: `1. Immediate field inspection for ${c.category} in ${c.location || 'sector'}.\n2. Deploy certified technical crew with standard equipment.\n3. Estimated restoration: 120 min.`,
          riskResult: calculateRisk({
            elapsed: 3,
            sla: 24,
            load: 12,
            capacity: 20,
            noFirstResponse: false,
            reopen: get().reopenCount,
          }),
        });

        // Add response to chat
        set((s) => ({
          chatMessages: [
            ...s.chatMessages,
            {
              id: `bot-rec-${Date.now()}`,
              sender: 'system',
              text: `ನಿಮ್ಮ ದೂರನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ (ದೂರು #${data.id}). ${c.location || 'ಬೆಂಗಳೂರು'} ಪ್ರದೇಶದ ಘಟನೆ #${incId} ನೊಂದಿಗೆ ಒಗ್ಗೂಡಿಸಲಾಗಿದೆ. ${teamName} ತಂಡವನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ.`,
              timestamp: timeNow,
            },
          ],
        }));

        backendSucceeded = true;
      }
    } catch (err) {
      backendSucceeded = false;
    }

    if (backendSucceeded) return;

    // Local Flexible Intelligent Linguistic Parsing Fallback
    const lower = textToSend.toLowerCase();
    let category = 'water';
    let location = 'Jayanagar';
    let isSafety = false;

    if (lower.includes('power') || lower.includes('electric') || lower.includes('current') || lower.includes('light') || lower.includes('ಕರೆಂಟ್') || lower.includes('ವಿದ್ಯುತ್')) {
      category = 'electricity';
      location = 'Whitefield';
    } else if (lower.includes('road') || lower.includes('pothole') || lower.includes('tar') || lower.includes('ರಸ್ತೆ') || lower.includes('ಗುಂಡಿ')) {
      category = 'road';
      location = 'Indiranagar';
    } else if (lower.includes('garbage') || lower.includes('waste') || lower.includes('kachra') || lower.includes('ತ್ಯಾಜ್ಯ') || lower.includes('ಕಸ')) {
      category = 'garbage';
      location = 'Malleshwaram';
    } else if (lower.includes('health') || lower.includes('mosquito') || lower.includes('hospital') || lower.includes('ಆರೋಗ್ಯ')) {
      category = 'health';
      location = 'Koramangala';
    }

    if (lower.includes('sewage') || lower.includes('danger') || lower.includes('hazard') || lower.includes('urgent') || lower.includes('shock') || lower.includes('fire') || lower.includes('ಅಪಾಯ')) {
      isSafety = true;
      if (category === 'water') location = 'Koramangala';
    }

    const hasKannadaChars = anyCharKannada(textToSend);
    const lang = hasKannadaChars ? 'kn' : (lower.includes('namma') || lower.includes('aagide') ? 'kanglish' : 'en');
    const newAffected = get().affectedCount + 1;

    // Step 1: Understand
    await new Promise((r) => setTimeout(r, 450));
    set({
      understandOutput: {
        language: lang,
        kannada_text: hasKannadaChars ? textToSend : `${location} ನಲ್ಲಿ ${category} ದೂರು: ${textToSend}`,
        translated_text: `Citizen grievance: ${textToSend} (${category} in ${location})`,
        category,
        severity: isSafety ? 1.8 : 1.4,
        safety_flag: isSafety,
        location,
        confidence: 0.96,
      },
      state: 'clustered',
    });

    // Step 2: Cluster
    await new Promise((r) => setTimeout(r, 400));
    set({
      affectedCount: newAffected,
      clusterResult: {
        action: 'JOIN',
        similarity: 0.91,
        incidentId: get().incidentId,
        reason: `Joined Incident #${get().incidentId} (similarity 0.91, ${category} in ${location})`,
      },
      state: 'prioritized',
    });

    // Step 3: Prioritize
    await new Promise((r) => setTimeout(r, 400));
    const pResult = priorityScore({
      severity: isSafety ? 1.8 : 1.4,
      safety: isSafety,
      affected: newAffected,
      distress: isSafety ? 4.5 : 2.5,
      vulnerable: isSafety,
      slaRisk: 0.2,
    });
    set({ priorityResult: pResult, state: 'assigned' });

    // Step 4: Route
    await new Promise((r) => setTimeout(r, 350));
    const teamName = category === 'electricity' ? 'BESCOM Electrical Operations' : (category === 'road' ? 'BBMP Road Infrastructure' : 'BWSSB Water Supply & Drainage');
    set({
      routingResult: {
        team: teamName,
        reason: 'Optimal department routing: 0.5 skill match + 0.3 low queue + 0.2 SLA reliability.',
      },
      copilotDraft: `1. Emergency inspection for ${category} at ${location}.\n2. Dispatch specialized remediation unit.\n3. Estimated restoration: 120 minutes.`,
      riskResult: calculateRisk({
        elapsed: 4,
        sla: 24,
        load: 12,
        capacity: 20,
        noFirstResponse: false,
        reopen: get().reopenCount,
      }),
    });

    // Confirmation message to chat
    set((s) => ({
      chatMessages: [
        ...s.chatMessages,
        {
          id: `bot-rec-${Date.now()}`,
          sender: 'system',
          text: `ನಿಮ್ಮ ದೂರನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ${location} ಪ್ರದೇಶದ ಘಟನೆ #${get().incidentId} ನೊಂದಿಗೆ ಒಗ್ಗೂಡಿಸಲಾಗಿದೆ (${newAffected} ನಾಗರಿಕರು ವರದಿ ಮಾಡಿದ್ದಾರೆ). ${teamName} ತಂಡವನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ.`,
          timestamp: timeNow,
        },
      ],
    }));
  },

  editCopilotDraft: (text: string) => set({ copilotDraft: text }),

  approveFix: async () => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caseId = get().caseId;

    if (caseId) {
      try {
        await fetch(`${API_BASE}/api/v1/cases/${caseId}/approve-fix`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ final_fix: get().copilotDraft, accepted_as_is: true }),
        });
        await fetch(`${API_BASE}/api/v1/cases/${caseId}/mark-fixed`, { method: 'POST' });
      } catch (e) {}
    }

    set((s) => ({
      state: 'pending_verification',
      chatMessages: [
        ...s.chatMessages,
        {
          id: `bot-fix-${Date.now()}`,
          sender: 'system',
          text: 'ನಮಸ್ಕಾರ, ನಮ್ಮ ಕ್ಷೇತ್ರ ಸಿಬ್ಬಂದಿ ಕಾಮಗಾರಿ ಮುಕ್ತಾಯಗೊಳಿಸಿದ್ದಾರೆ ಎಂದು ವರದಿ ಮಾಡಿದ್ದಾರೆ. ನಿಮ್ಮ ದೂರು ನಿಜವಾಗಿಯೂ ಪರಿಹಾರವಾಗಿದೆಯೇ?',
          timestamp: timeNow,
          isVerificationPrompt: true,
        },
      ],
    }));
  },

  submitVerification: async (confirmed: boolean, rating?: number) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const caseId = get().caseId;

    if (caseId) {
      try {
        await fetch(`${API_BASE}/api/v1/closure/${caseId}/response`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirmed, rating: rating || 5 }),
        });
      } catch (e) {}
    }

    if (confirmed) {
      set((s) => ({
        state: 'closed',
        chatMessages: [
          ...s.chatMessages,
          {
            id: `cit-resp-${Date.now()}`,
            sender: 'citizen',
            text: `ಹೌದು, ಪರಿಹಾರವಾಗಿದೆ! (${rating || 5} ನಕ್ಷತ್ರ ರೇಟಿಂಗ್ ನೀಡಲಾಗಿದೆ)`,
            timestamp: timeNow,
          },
          {
            id: `bot-close-${Date.now()}`,
            sender: 'system',
            text: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ದೃಢೀಕರಣದೊಂದಿಗೆ ದೂರು ಅಧಿಕೃತವಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ (Closed).',
            timestamp: timeNow,
          },
        ],
      }));
    } else {
      // Reopen branch: Section 6 & 10.6: priority +15, reopenCount incremented, risk recalculated
      const currentScore = get().priorityResult?.score || 60;
      const bumpedScore = Math.min(currentScore + 15, 100);
      const newReopenCount = get().reopenCount + 1;

      const newRisk = calculateRisk({
        elapsed: 18,
        sla: 24,
        load: 18,
        capacity: 20,
        noFirstResponse: false,
        reopen: newReopenCount,
      });

      set((s) => ({
        state: 'reopened',
        reopenCount: newReopenCount,
        riskResult: newRisk,
        priorityResult: s.priorityResult
          ? {
              ...s.priorityResult,
              score: bumpedScore,
              band: bumpedScore >= 75 ? 'Critical' : 'High',
              reason: `Priority ${bumpedScore}: Citizen reported fix unsatisfied (+15 reopen penalty). Escalated to Lead.`,
            }
          : null,
        chatMessages: [
          ...s.chatMessages,
          {
            id: `cit-resp-${Date.now()}`,
            sender: 'citizen',
            text: 'ಇಲ್ಲ, ಇನ್ನೂ ಸರಿಹೋಗಿಲ್ಲ. ಸಮಸ್ಯೆ ಹಾಗೆಯೇ ಇದೆ.',
            timestamp: timeNow,
          },
          {
            id: `bot-reopen-${Date.now()}`,
            sender: 'system',
            text: 'ಕ್ಷಮಿಸಿ! ದೂರನ್ನು ತಕ್ಷಣ ಮರುತೆರೆಯಲಾಗಿದೆ (Reopened). ಆದ್ಯತೆಯನ್ನು +15 ಹೆಚ್ಚಿಸಿ ಮೇಲಧಿಕಾರಿಗಳಿಗೆ ತುರ್ತು ಎಚ್ಚರಿಕೆ ರವಾನಿಸಲಾಗಿದೆ.',
            timestamp: timeNow,
          },
        ],
      }));
    }
  },

  resetDemo: () => {
    set({
      state: 'idle',
      selectedScriptId: null,
      activeComplaintText: '',
      caseId: null,
      chatMessages: [
        {
          id: 'init-1',
          sender: 'system',
          text: 'ನಮಸ್ಕಾರ, ResolveIQ ನಾಗರಿಕ ದೂರು ಸಹಾಯಕ ವ್ಯವಸ್ಥೆಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಕನ್ನಡ, ಕಾಂಗ್ಲಿಷ್ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ತಿಳಿಸಿ.',
          timestamp: '10:00 AM',
        },
      ],
      affectedCount: 14,
      incidentId: 12,
      reopenCount: 0,
      understandOutput: null,
      clusterResult: null,
      priorityResult: null,
      routingResult: null,
      copilotDraft: initialCopilot,
      riskResult: null,
    });
  },
}));

function anyCharKannada(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0x0c80 && code <= 0x0cff) return true;
  }
  return false;
}
