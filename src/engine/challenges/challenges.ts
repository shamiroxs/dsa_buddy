/**
 * Challenge definitions
 * MVP: 7-10 handcrafted Array challenges
 */

import type { Challenge } from './types';
import { Difficulty } from './types';

export const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Find Maximum',
    description: 'Find the maximum value in the array and store it at index 0.',
    difficulty: Difficulty.EASY,
    initialArray: [3, 7, 2, 9, 1, 5],
    targetArray: [9, 7, 2, 9, 1, 5],
    maxSteps: 46,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-2',
    title: 'Reverse Array',
    description: 'Reverse the array in-place.',
    difficulty: Difficulty.EASY,
    initialArray: [1, 2, 3, 4, 5],
    targetArray: [5, 4, 3, 2, 1],
    maxSteps: 20,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-3',
    title: 'Count Even Numbers',
    description: 'Count the number of even numbers and store the count at index 0.',
    difficulty: Difficulty.EASY,
    initialArray: [2, 5, 8, 3, 6, 1],
    targetArray: [3, 5, 8, 3, 6, 1],
    maxSteps: 25,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-4',
    title: 'Swap First and Last',
    description: 'Swap the first and last elements of the array.',
    difficulty: Difficulty.EASY,
    initialArray: [10, 20, 30, 40, 50],
    targetArray: [50, 20, 30, 40, 10],
    maxSteps: 10,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-5',
    title: 'Move Zeros to End',
    description: 'Move all zeros to the end of the array while maintaining relative order of non-zero elements.',
    difficulty: Difficulty.MEDIUM,
    initialArray: [0, 1, 0, 3, 12, 0],
    targetArray: [1, 3, 12, 0, 0, 0],
    maxSteps: 30,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-6',
    title: 'Find Duplicate',
    description: 'Find the duplicate number in the array and store it at index 0. Array contains numbers 1 to n with one duplicate.',
    difficulty: Difficulty.MEDIUM,
    initialArray: [1, 3, 4, 2, 2],
    targetArray: [2, 3, 4, 2, 2],
    maxSteps: 25,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-7',
    title: 'Two Sum',
    description: 'Find two numbers that add up to target (10) and store them at indices 0 and 1.',
    difficulty: Difficulty.MEDIUM,
    initialArray: [2, 7, 11, 15],
    targetArray: [2, 7, 11, 15], // Target sum is 9, so 2+7=9
    maxSteps: 35,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-8',
    title: 'Sort Array (Bubble Sort)',
    description: 'Sort the array in ascending order using bubble sort algorithm.',
    difficulty: Difficulty.MEDIUM,
    initialArray: [64, 34, 25, 12, 22, 11, 90],
    targetArray: [11, 12, 22, 25, 34, 64, 90],
    maxSteps: 50,
    instructions: [],
    unlocked: true,
  },
  {
    id: 'challenge-9',
    title: 'Find Missing Number',
    description: 'Array contains numbers 0 to n with one missing. Find and store the missing number at index 0.',
    difficulty: Difficulty.HARD,
    initialArray: [3, 0, 1],
    targetArray: [2, 0, 1],
    maxSteps: 20,
    instructions: [],
    unlocked: false, // Locked in MVP
  },
  {
    id: 'challenge-10',
    title: 'Product Except Self',
    description: 'Replace each element with the product of all other elements.',
    difficulty: Difficulty.HARD,
    initialArray: [1, 2, 3, 4],
    targetArray: [24, 12, 8, 6],
    maxSteps: 40,
    instructions: [],
    unlocked: false, // Locked in MVP
  },
];

