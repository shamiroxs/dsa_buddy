/**
 * Challenge definition types
 */

import type { Instruction } from '../instructions/types';

export const Difficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  initialArray: number[];
  targetArray: number[];
  maxSteps?: number; // Optional optimization goal
  instructions: Instruction[]; // Starting instructions (can be empty)
  unlocked: boolean;
}

export interface ChallengeProgress {
  challengeId: string;
  completed: boolean;
  bestStepCount?: number;
  completedAt?: number;
}

