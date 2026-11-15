import { describe, it, expect, beforeEach } from 'vitest';
import { useDemoStore } from '@/store/demoStore';

describe('Demo State Machine & Store', () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemo();
  });

  it('initializes in idle state with default welcome message', () => {
    const state = useDemoStore.getState();
    expect(state.state).toBe('idle');
    expect(state.chatMessages.length).toBeGreaterThanOrEqual(1);
  });

  it('runs through full understand -> cluster -> prioritize -> assign flow on sendComplaint', async () => {
    const store = useDemoStore.getState();
    await store.sendComplaint('Namma street alli water pipe odeede', 'kanglish');

    const updated = useDemoStore.getState();
    expect(updated.understandOutput).not.toBeNull();
    expect(updated.understandOutput?.category).toBe('water');
    expect(updated.understandOutput?.location).toBe('Jayanagar');
    expect(updated.clusterResult?.action).toBe('JOIN');
    expect(updated.priorityResult?.score).toBeGreaterThan(50);
  });

  it('triggers reopen branch with priority penalty when citizen answers NO', async () => {
    const store = useDemoStore.getState();
    await store.sendComplaint('Namma street alli water pipe odeede', 'kanglish');
    store.approveFix();
    expect(useDemoStore.getState().state).toBe('pending_verification');

    // Citizen answers NO
    store.submitVerification(false);
    const reopened = useDemoStore.getState();
    expect(reopened.state).toBe('reopened');
    expect(reopened.reopenCount).toBe(1);
    expect(reopened.priorityResult?.reason).toContain('+15 reopen penalty');
  });
});

