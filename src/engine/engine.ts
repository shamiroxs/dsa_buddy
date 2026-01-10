/**
 * Game Engine - Pure logic coordinator
 * No React dependencies
 */

import type { Challenge } from './challenges/types';
import type { ExecutionState } from '../interpreter/executionModel';
import { createInitialState } from '../interpreter/executionModel';
import { validateChallenge } from './validator/validator';
import type { ValidationResult } from './validator/validator';
import type { Instruction } from './instructions/types';

export class GameEngine {
  private currentChallenge: Challenge | null = null;
  private currentState: ExecutionState | null = null;
  
  /**
   * Initialize a challenge
   */
  initializeChallenge(challenge: Challenge, instructions: Instruction[]): ExecutionState {
    this.currentChallenge = challenge;
    this.currentState = createInitialState(challenge.initialArray, instructions, challenge);
    return this.currentState;
  }
  
  /**
   * Get current state
   */
  getState(): ExecutionState | null {
    return this.currentState;
  }
  
  /**
   * Get current challenge
   */
  getChallenge(): Challenge | null {
    return this.currentChallenge;
  }
  
  /**
   * Validate current state against challenge
   */
  validate(): ValidationResult | null {
    if (!this.currentChallenge || !this.currentState) {
      return null;
    }
    return validateChallenge(this.currentChallenge, this.currentState);
  }
  
  /**
   * Reset to initial state
   */
  reset(): ExecutionState | null {
    if (!this.currentChallenge) {
      return null;
    }
    const instructions = this.currentState?.instructions || [];
    return this.initializeChallenge(this.currentChallenge, instructions);
  }
}

