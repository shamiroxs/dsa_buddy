/**
 * Zustand selectors for derived state
 */

import { useGameStore } from './store';
import type { Instruction } from '../engine/instructions/types';

export const useCurrentChallenge = () => useGameStore((state) => state.currentChallenge);

export const useChallenges = () => useGameStore((state) => state.challenges);

export const useExecutionState = () => useGameStore((state) => state.executionState);

export const usePlayerInstructions = () => useGameStore((state) => state.playerInstructions);

export const useIsExecuting = () => useGameStore((state) => state.isExecuting);

export const useIsPaused = () => useGameStore((state) => state.isPaused);

export const useExecutionError = () => useGameStore((state) => state.executionError);

export const useValidationResult = () => useGameStore((state) => state.validationResult);

export const useCurrentInstruction = (): Instruction | null => {
  return useGameStore((state) => {
    if (!state.executionState) return null;
    const { currentLine, instructions } = state.executionState;
    if (currentLine >= instructions.length) return null;
    return instructions[currentLine] as Instruction;
  });
};

export const useArrayState = (): number[] => {
  return useGameStore((state) => state.executionState?.array || []);
};

export const usePointers = (): Record<string, number> => {
  return useGameStore((state) => state.executionState?.pointers || {});
};

export const useStepCount = (): number => {
  return useGameStore((state) => state.executionState?.stepCount || 0);
};

export const useCurrentLine = (): number => {
  return useGameStore((state) => state.executionState?.currentLine || 0);
};

