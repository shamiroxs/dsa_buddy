/**
 * Controller for execution pipeline
 * Handles Step/Run/Rewind operations
 */

import { useGameStore } from './store';
import { executeStep, rewindStep } from '../interpreter/vm';
import type { ExecutionResult } from '../interpreter/vm';
import { validateChallenge as validateChallengeFn } from '../engine/validator/validator';
import { trackChallengeCompletion } from '../utils/completionTracter';

let runInterval: number | null = null;


/**
 * Execute single step
 * Used both by the Step button and the Run loop.
 */
export function executeSingleStep(): void {
  const store = useGameStore.getState();
  const state = store.executionState;

  if (!state) {
    // Nothing to execute yet
    store.setExecutionError('No execution state available');
    return;
  }

  // Ensure we are not in a paused state when stepping
  store.setIsPaused(false);

  // Execute step directly
  const result: ExecutionResult = executeStep(state);

  if (result.success) {
    store.setExecutionState(result.state);
    store.setExecutionError(null);

    // Check if challenge is completed
    if (result.completed || result.state.currentLine >= result.state.instructions.length) {
      stopExecution();
      validateChallenge();
    }
  } else {
    // Check if error is pointer out of bounds - if so, validate challenge instead
    const errorMessage = result.error || '';
    const isPointerOutOfBounds = 
      errorMessage.includes('Pointer out of bounds') ||
      errorMessage.includes('Cannot move right: pointer already at end') ||
      errorMessage.includes('Cannot move left: pointer already at start') ||
      errorMessage.includes('Cannot swap: pointer at or beyond last element');
    
    if (isPointerOutOfBounds) {
      // Pointer out of bounds - treat as program completion and validate
      store.setExecutionState(result.state);
      store.setExecutionError(null);
      stopExecution();
      validateChallenge();
    } else {
      // Other errors - show error message
      store.setExecutionError(result.error || 'Execution failed');
      stopExecution();
    }
  }
}

/**
 * Run execution continuously
 */
export function runExecution(speed: number = 500): void {
  const store = useGameStore.getState();

  if (store.isExecuting && !store.isPaused) {
    return; // Already running
  }

  store.setIsExecuting(true);
  store.setIsPaused(false);
  store.setExecutionError(null);

  // Execute steps at interval
  runInterval = window.setInterval(() => {
    const currentStore = useGameStore.getState();
    if (!currentStore.isExecuting || currentStore.isPaused) {
      stopExecution();
      return;
    }

    executeSingleStep();
  }, speed);
}

/**
 * Pause execution
 */
export function pauseExecution(): void {
  const store = useGameStore.getState();
  store.setIsPaused(true);
}

/**
 * Resume execution
 */
export function resumeExecution(speed: number = 500): void {
  const store = useGameStore.getState();
  if (store.isExecuting && store.isPaused) {
    store.setIsPaused(false);
    runExecution(speed);
  }
}

/**
 * Stop execution
 */
export function stopExecution(): void {
  if (runInterval !== null) {
    clearInterval(runInterval);
    runInterval = null;
  }

  const store = useGameStore.getState();
  store.setIsExecuting(false);
  store.setIsPaused(false);
}

/**
 * Rewind one step
 */
export function rewindSingleStep(): void {
  const store = useGameStore.getState();
  const state = store.executionState;

  if (!state) {
    return;
  }

  // Use synchronous rewind for now (can be moved to worker if needed)
  const newState = rewindStep(state);
  if (newState) {
    store.setExecutionState(newState);
    store.setExecutionError(null);
  }
}

/**
 * Validate challenge completion
 */
export function validateChallenge(): void {
  const store = useGameStore.getState();
  
  // Use the current execution state from the store, not the engine's stale state
  if (!store.currentChallenge || !store.executionState) {
    return;
  }
  
  // Validate using the current execution state from the store
  const result = validateChallengeFn(store.currentChallenge, store.executionState);
  store.setValidationResult(result);

  if (result?.success) {
    // Save progress to localStorage
    const progress = {
      challengeId: store.currentChallenge?.id,
      completed: true,
      bestStepCount: result.stepCount,
      completedAt: Date.now(),
    };

    const savedProgress = localStorage.getItem('dsa-buddy-progress');
    const progressData = savedProgress ? JSON.parse(savedProgress) : {};
    progressData[store.currentChallenge?.id || ''] = progress;
    localStorage.setItem('dsa-buddy-progress', JSON.stringify(progressData));

    trackChallengeCompletion({
      challengeId: store.currentChallenge.id,
      stepCount: result.stepCount,
      instructionCount: store.executionState.instructions.length,
      executionMode: store.isExecuting ? 'run' : 'step',
    });
  }
}

/**
 * Reset execution to initial state
 */
export function resetExecution(): void {
  stopExecution();
  const store = useGameStore.getState();
  store.resetChallenge();
}



