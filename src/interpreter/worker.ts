/**
 * Web Worker for VM execution
 * Runs interpreter in separate thread to keep UI responsive
 */


import type { ExecutionState } from './executionModel';
import { executeStep, rewindStep } from './vm';

export interface WorkerMessage {
  type: 'EXECUTE_STEP' | 'REWIND_STEP' | 'RESET';
  payload?: any;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;
  
  try {
    switch (type) {
      case 'EXECUTE_STEP': {
        const state = payload as ExecutionState;
        const result = executeStep(state);
        self.postMessage({ type: 'STEP_RESULT', payload: result });
        break;
      }
      
      case 'REWIND_STEP': {
        const state = payload as ExecutionState;
        const newState = rewindStep(state);
        if (newState) {
          self.postMessage({ type: 'REWIND_RESULT', payload: newState });
        } else {
          self.postMessage({ type: 'REWIND_RESULT', payload: null });
        }
        break;
      }
      
      case 'RESET': {
        self.postMessage({ type: 'RESET_COMPLETE' });
        break;
      }
      
      default:
        self.postMessage({ type: 'ERROR', payload: `Unknown message type: ${type}` });
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      payload: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

