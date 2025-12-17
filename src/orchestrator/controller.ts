/**
 * Controller for execution pipeline
 * Handles Step/Run/Rewind operations
 */

import { useGameStore } from './store';
import { executeStep, rewindStep } from '../interpreter/vm';
import type { ExecutionResult } from '../interpreter/vm';

let runInterval: number | null = null;

/**
 * Execute single step
 */
export function executeSingleStep(): void {
  const store = useGameStore.getState();
  const state = store.executionState;
  
  if (!state) {
    store.setExecutionError('No execution state available');
    return;
  }
  
  if (store.isExecuting && !store.isPaused) {
    return; // Already running
  }
  
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
    store.setExecutionError(result.error || 'Execution failed');
    stopExecution();
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
  const result = store.engine.validate();
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

