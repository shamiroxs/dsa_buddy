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

const PROGRESS_KEY = 'dsa-buddy-progress';

type StoredProgress = Record<
  string,
  {
    challengeId: string;
    completed: boolean;
    bestStepCount?: number;
    completedAt?: number;
  }
>;

function loadCompletedFromProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();

    const progress: StoredProgress = JSON.parse(raw);
    return new Set(
      Object.values(progress)
        .filter((p) => p.completed)
        .map((p) => p.challengeId)
    );
  } catch {
    return new Set();
  }
}

function upsertProgressEntry(
  challengeId: string,
  data: {
    challengeId: string;
    completed: boolean;
    bestStepCount?: number;
    completedAt?: number;
  }
) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const progress: StoredProgress = raw ? JSON.parse(raw) : {};

    const existing = progress[challengeId];

    progress[challengeId] = {
      challengeId,
      completed: true,

      // keep the BEST (minimum) step count
      bestStepCount:
        existing?.bestStepCount != null && data.bestStepCount != null
          ? Math.min(existing.bestStepCount, data.bestStepCount)
          : data.bestStepCount ?? existing?.bestStepCount,

      // update completion time only on first completion
      completedAt: existing?.completedAt ?? data.completedAt ?? Date.now(),
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage failures
  }
}


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

  // Tutorial (First-run coach)
  isTutorialActive: boolean;
  tutorialStep: number;

  startTutorial: () => void;
  nextTutorialStep: () => void;
  endTutorial: () => void;

  reorderInstructions: (fromIndex: number, toIndex: number) => void;

  clearPlayerInstructions: () => void;
  
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

  // Completion state
  completedChallengeIds: Set<string>;
  isChallengeCompleted: (challengeId: string) => boolean;
  markChallengeCompleted: (
    challengeId: string,
    bestStepCount?: number
  ) => void;
  

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

    // Tutorial
  isTutorialActive: false,
  tutorialStep: 0,

  startTutorial: () =>
    set({
      isTutorialActive: true,
      tutorialStep: 0,
    }),
  
  nextTutorialStep: () =>
    set((state) => ({
      tutorialStep: state.tutorialStep + 1,
    })),
  
  endTutorial: () =>
    set({
      isTutorialActive: false,
      tutorialStep: 0,
    }),

  // Completion state
  completedChallengeIds: loadCompletedFromProgress(),

  isChallengeCompleted: (challengeId) => {
    return get().completedChallengeIds.has(challengeId);
  },

  markChallengeCompleted: (challengeId, bestStepCount?: number) => {
    set((state) => {
      if (state.completedChallengeIds.has(challengeId)) {
        return state;
      }
  
      const next = new Set(state.completedChallengeIds);
      next.add(challengeId);
  
      upsertProgressEntry(challengeId, {
        challengeId,
        completed: true,
        bestStepCount,
        completedAt: Date.now(),
      });
  
      return { completedChallengeIds: next };
    });
  },
  

  reorderInstructions: (fromIndex, toIndex) => {
    const { playerInstructions } = get();
    const updated = [...playerInstructions];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    get().setPlayerInstructions(updated);
  },  

  clearPlayerInstructions: () => {
    get().setPlayerInstructions([]);
  },
  
  // Actions
  setChallenges: (challenges) => set({ challenges }),
  
  selectChallenge: (challengeId) => {
    const { challenges, completedChallengeIds } = get();
    const challenge = challenges.find((c) => c.id === challengeId);
  
    if (!challenge) return;
  
    const isTutorial =
      challenge.id === 'challenge-0' &&
      !completedChallengeIds.has('challenge-0');
  
    set({
      currentChallenge: challenge,
      playerInstructions: [],
      isTutorialActive: isTutorial,
      tutorialStep: 0,
    });
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
    const { playerInstructions, isTutorialActive, tutorialStep, nextTutorialStep } = get();
    const newInstructions = [...playerInstructions, instruction];
    get().setPlayerInstructions(newInstructions);
  
    if (isTutorialActive && tutorialStep < 4) {
      nextTutorialStep();
    }
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

