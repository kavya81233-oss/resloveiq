const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface HealthCheckResult {
  isLive: boolean;
  status: string;
  version: string;
  latencyMs: number;
}

export async function checkBackendHealth(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const healthUrl = typeof window !== 'undefined' ? '/api/health' : `${API_BASE}/health`;
    const res = await fetch(healthUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Health check non-200');
    const data = await res.json();
    return {
      isLive: true,
      status: data.status || 'operational',
      version: data.version || '1.0.0',
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      isLive: false,
      status: 'offline',
      version: '1.0.0',
      latencyMs: Date.now() - start,
    };
  }
}

export interface PilotRequestPayload {
  name: string;
  organization: string;
  email: string;
  role: string;
  message?: string;
}

export async function submitPilotRequest(payload: PilotRequestPayload, isLive: boolean): Promise<{ success: boolean; offlineQueued: boolean; message: string }> {
  if (isLive) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/pilot-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, offlineQueued: false, message: data.message || 'Request successfully registered.' };
      }
    } catch (err) {
      // Graceful fallback to offline queue
    }
  }

  // Offline / simulation mode queueing in localStorage
  try {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('resolveiq_pilot_queue') || '[]');
      existing.push({ ...payload, queuedAt: new Date().toISOString() });
      localStorage.setItem('resolveiq_pilot_queue', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('localStorage access failed:', e);
  }

  return {
    success: true,
    offlineQueued: true,
    message: 'Saved offline. Your request will automatically sync once live connection is verified.',
  };
}

