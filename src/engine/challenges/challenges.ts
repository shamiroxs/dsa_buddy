/**
 * Challenge definitions
 * MVP: 7-10 handcrafted Array challenges
 */ 

import type { Challenge } from './types';
import { Difficulty } from './types';
import { InstructionType } from '../instructions/types';

export const challenges: Challenge[] = [
  {
    id: 'challenge-0',
    title: 'Start Here',
    description: 'Copy the first value into the second box',
    hints: [],
    difficulty: Difficulty.EASY,
    initialArray: [7, 0, 0, 0],
    targetArray: [7, 7, 0, 0],
    maxSteps: 3,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.PICK,
        InstructionType.PUT,
      ],
      suggestedInstructions: [
        InstructionType.PICK,
        InstructionType.MOVE_RIGHT,
        InstructionType.PUT,
      ],
    },
  },
  {
    id: 'challenge-1',
    title: 'Larger of First Two',
    description: 'Compare the first two elements and store the larger value at index 0.',
    hints: [],
    difficulty: Difficulty.EASY,
    initialArray: [4, 9, 6, 2],
    targetArray: [9, 9, 6, 2],
    maxSteps: 7,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO'],
      allowedInstructions: [
        InstructionType.MOVE_RIGHT,
        InstructionType.MOVE_LEFT,
        InstructionType.PICK,
        InstructionType.PUT,

        InstructionType.IF_GREATER,
        InstructionType.IF_LESS,

        InstructionType.LABEL,
        InstructionType.JUMP,
      ],
      suggestedInstructions: [
        InstructionType.PICK,
        InstructionType.PUT,
      ],
    },
  },
  
  {
    id: 'challenge-2',
    title: 'Swap First and Last',
    description: 'Swap the first and last elements of the array.',
    hints: [],
    difficulty: Difficulty.EASY,
    initialArray: [10, 20, 30, 40, 50],
    targetArray: [50, 20, 30, 40, 10],
    maxSteps: 2,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO', 'CHOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.MOVE_TO_END,
        InstructionType.SWAP,
      ],
    }
  },
  {
    id: 'challenge-3',
    title: 'Reverse Array',
    description: 'Reverse the array in-place.',
    hints: [],
    difficulty: Difficulty.EASY,
    initialArray: [1, 2, 3, 4, 5],
    targetArray: [5, 4, 3, 2, 1],
    maxSteps: 13,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO', 'CHOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.MOVE_TO_END,

        InstructionType.SET_POINTER,

        InstructionType.IF_MEET,
        InstructionType.SWAP,
        InstructionType.JUMP,
        InstructionType.LABEL,
      ],
    }
    
  },
  
  {
    id: 'challenge-4',
    title: 'Find Maximum',
    description: 'Find the maximum value in the array and store it at index 0.',
    hints: ['IFGreater : hand > arrvalue',
      'IFLess : hand < arrvalue'
    ],
    difficulty: Difficulty.EASY,
    initialArray: [3, 7, 2, 9, 1, 5],
    targetArray: [9, 7, 2, 9, 1, 5],
    maxSteps: 46,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.SET_POINTER,
        InstructionType.PICK,
        InstructionType.PUT,

        InstructionType.IF_GREATER,
        InstructionType.IF_LESS,
        InstructionType.IF_END,

        InstructionType.JUMP,
        InstructionType.LABEL,
      ],
      suggestedInstructions: [
        InstructionType.IF_LESS,
        InstructionType.IF_EQUAL,
      ],
    },
  },
  {
    id: 'challenge-5',
    title: 'Move Zeros to End',
    description: `Move all zeros to the end of the array while maintaining relative order of non-zero elements.
    (Assume first element always zero)`,
    
    hints: [
      'Both MOCO and CHOCO uses same hand',
    ],
    
    difficulty: Difficulty.MEDIUM,
    initialArray: [0, 1, 0, 3, 12, 0],
    targetArray: [1, 3, 12, 0, 0, 0],
    maxSteps: 30,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO', 'CHOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.PICK,
        InstructionType.PUT,

        InstructionType.IF_EQUAL,
        InstructionType.IF_NOT_EQUAL,

        InstructionType.SWAP,
        InstructionType.JUMP,
        InstructionType.LABEL,
        InstructionType.WAIT,
      ],
      suggestedInstructions: [
        InstructionType.IF_EQUAL,
      ],
    }
  },
  {
    id: 'challenge-6',
    title: 'Is Sorted?',
    description: 'Check if the array is sorted in increasing order. Store 1 at index 0 if sorted, else 0.',
    hints: [],
    difficulty: Difficulty.MEDIUM,
    initialArray: [1, 3, 5, 7, 6],
    targetArray: [0, 3, 5, 7, 6],
    maxSteps: 26,
    instructions: [],
    unlocked: true,
    capabilities: {
      allowedPointers: ['MOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.PICK,
        InstructionType.PUT,

        InstructionType.SET_POINTER,
        InstructionType.SET_VALUE,
  
        InstructionType.IF_GREATER,
        InstructionType.IF_LESS,
        InstructionType.IF_END,
  
        InstructionType.JUMP,
        InstructionType.LABEL,
      ],
    },
  },  
  {
    id: 'challenge-7',
    title: 'Left Rotate by One',
    description: 'Rotate the array left by one position.',
    hints: [],
    difficulty: Difficulty.MEDIUM,
    initialArray: [1, 2, 3, 4],
    targetArray: [2, 3, 4, 1],
    maxSteps: 25,
    instructions: [],    
    unlocked: false,
    capabilities: {
      allowedPointers: ['MOCO'],
      allowedInstructions: [
        InstructionType.PICK,
        InstructionType.MOVE_RIGHT,
        InstructionType.PUT,
  
        InstructionType.JUMP,
        InstructionType.LABEL,
      ],
    },
  },

  {
    id: 'challenge-8',
    title: 'Find Duplicate',
    description: 'Find the duplicate number in the array and store it at index 0. Array contains numbers 1 to n with one duplicate.',
    hints: [],
    difficulty: Difficulty.MEDIUM,
    initialArray: [1, 3, 4, 2, 2],
    targetArray: [2, 3, 4, 2, 2],
    maxSteps: 25,
    instructions: [],
    unlocked: false,
    capabilities: {
      allowedPointers: ['MOCO', 'CHOCO'],
      allowedInstructions: [
        InstructionType.MOVE_LEFT,
        InstructionType.MOVE_RIGHT,
        InstructionType.MOVE_TO_END,
        InstructionType.SET_POINTER,
        InstructionType.PICK,
        InstructionType.PUT,

        InstructionType.IF_GREATER,
        InstructionType.IF_LESS,
        InstructionType.IF_EQUAL,
        InstructionType.IF_END,

        InstructionType.JUMP,
        InstructionType.LABEL,
        InstructionType.WAIT,
      ],
      suggestedInstructions: [
        InstructionType.IF_LESS,
        InstructionType.IF_EQUAL,
      ],
    }
  },
  /*
  {
    id: 'challenge-7',
    title: 'Two Sum',
    description: 'Find two numbers that add up to target (10) and store them at indices 0 and 1.',
    hints: [],
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
    hints: [],
    description: 'Sort the array in ascending order using bubble sort algorithm.',
    hints: [],
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
    hints: [],
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
    hints: [],
    difficulty: Difficulty.HARD,
    initialArray: [1, 2, 3, 4],
    targetArray: [24, 12, 8, 6],
    maxSteps: 40,
    instructions: [],
    unlocked: false, // Locked in MVP
  },*/
];

