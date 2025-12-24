// src/utils/completionTracker.ts

import { getAnonymousUserId } from './anonymousIdentity';

const COMPLETION_ENDPOINT =
  import.meta.env.VITE_COMPLETION_ENDPOINT ||
  'https://dsa-buddy-smoky.vercel.app/api/completion';

export type CompletionEvent = {
  challengeId: string;
  stepCount: number;
  instructionCount: number;
  executionMode: 'step' | 'run' | 'mixed';
};

export function trackChallengeCompletion(event: CompletionEvent): void {
  try {
    const payload = {
      anonymousUserId: getAnonymousUserId(),
      challengeId: event.challengeId,
      stepCount: event.stepCount,
      instructionCount: event.instructionCount,
      executionMode: event.executionMode,
      completedAt: new Date().toISOString(),
      clientVersion: import.meta.env.VITE_APP_VERSION || 'dev',
    };

    // Fire-and-forget
    fetch(COMPLETION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently ignore network errors
    });
  } catch {
    // Never let tracking crash the app
  }
}
