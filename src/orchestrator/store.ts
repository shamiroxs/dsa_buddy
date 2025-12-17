/**
 * Zustand store for game state orchestration
 * Coordinates engine, interpreter, and renderer
 */

import { create } from 'zustand';
import type { Challenge } from '../engine/challenges/types';
import type { ExecutionState } from '../interpreter/executionModel';
import type { Instruction } from '../engine/instructions/types';
import type { ValidationResult } from '../engine/validator/validator';
import { GameEngine } from '../engine/engine';

interface GameState {
  // Challenge state
  currentChallenge: Challenge | null;
  challenges: Challenge[];
  
  // Execution state
  executionState: ExecutionState | null;
  isExecuting: boolean;
  isPaused: boolean;
  executionError: string | null;
  
  // Player instructions
  playerInstructions: Instruction[];
  
  // Validation
  validationResult: ValidationResult | null;
  
  // Engine instance
  engine: GameEngine;
  
  // Actions
  setChallenges: (challenges: Challenge[]) => void;
  selectChallenge: (challengeId: string) => void;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  setPlayerInstructions: (instructions: Instruction[]) => void;
  addInstruction: (instruction: Instruction) => void;
  removeInstruction: (instructionId: string) => void;
  updateInstruction: (instructionId: string, instruction: Instruction) => void;
  setExecutionState: (state: ExecutionState | null) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setExecutionError: (error: string | null) => void;
  setValidationResult: (result: ValidationResult | null) => void;
  resetChallenge: () => void;
  initializeChallenge: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentChallenge: null,
  challenges: [],
  executionState: null,
  isExecuting: false,
  isPaused: false,
  executionError: null,
  playerInstructions: [],
  validationResult: null,
  engine: new GameEngine(),
  
  // Actions
  setChallenges: (challenges) => set({ challenges }),
  
  selectChallenge: (challengeId) => {
    const { challenges } = get();
    const challenge = challenges.find((c) => c.id === challengeId);
    if (challenge) {
      set({ currentChallenge: challenge });
      // Initialize will be called separately
    }
  },
  
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  
  setPlayerInstructions: (instructions) => {
    set({ playerInstructions: instructions });
    // Re-initialize challenge with new instructions
    const { currentChallenge, engine } = get();
    if (currentChallenge) {
      const newState = engine.initializeChallenge(currentChallenge, instructions);
      set({ executionState: newState, validationResult: null, executionError: null });
    }
  },
  
  addInstruction: (instruction) => {
    const { playerInstructions } = get();
    const newInstructions = [...playerInstructions, instruction];
    get().setPlayerInstructions(newInstructions);
  },
  
  removeInstruction: (instructionId) => {
    const { playerInstructions } = get();
    const newInstructions = playerInstructions.filter((inst) => inst.id !== instructionId);
    get().setPlayerInstructions(newInstructions);
  },
  
  updateInstruction: (instructionId, instruction) => {
    const { playerInstructions } = get();
    const newInstructions = playerInstructions.map((inst) =>
      inst.id === instructionId ? instruction : inst
    );
    get().setPlayerInstructions(newInstructions);
  },
  
  setExecutionState: (state) => set({ executionState: state }),
  
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  
  setIsPaused: (isPaused) => set({ isPaused }),
  
  setExecutionError: (error) => set({ executionError: error }),
  
  setValidationResult: (result) => set({ validationResult: result }),
  
  resetChallenge: () => {
    const { engine, currentChallenge } = get();
    if (currentChallenge) {
      const newState = engine.reset();
      if (newState) {
        set({
          executionState: newState,
          validationResult: null,
          executionError: null,
          isExecuting: false,
          isPaused: false,
        });
      }
    }
  },
  
  initializeChallenge: () => {
    const { engine, currentChallenge, playerInstructions } = get();
    if (currentChallenge) {
      const newState = engine.initializeChallenge(currentChallenge, playerInstructions);
      set({
        executionState: newState,
        validationResult: null,
        executionError: null,
        isExecuting: false,
        isPaused: false,
      });
    }
  },
}));

