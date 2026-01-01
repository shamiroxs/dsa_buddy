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
    title: 'First Assignment',
    description: `The passenger in Seat 0 wants to reserve Seat 1.`,
    hints: ['Before departure, Seat 1 must contain the same ticket as Seat 0.'],
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
    title: 'Seat Authority',
    description: `The passengers in Seat 0 and Seat 1 both claim priority seating.`,
    hints: ['Before the next station, ensure Seat 0 is occupied by the passenger with the higher ticket number.'],
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
    title: 'End Seat Correction',
    description: 'Two ticket numbers were assigned to the wrong ends of the compartment.',
    hints: ['Ensure the correct ticket number is assigned to each end seat.'],
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
    title: 'Backwards Tickets',
    description: `The ticket numbers in this compartment were assigned in reverse order.`,
    hints: ['Restore the assignment by reversing the ticket order.'],
    difficulty: Difficulty.EASY,
    initialArray: [5, 4, 3, 2, 1],
    targetArray: [1, 2, 3, 4, 5],
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
    title: 'VIP Ticket',
    description: `A VIP ticket number is already assigned to one seat. \nSeat 0 is also reserved by this passanger.`,
    hints: ['Before boarding begins, the VIP ticket number must be assigned to Seat 0.',
      '(The VIP ticket number is the highest value in the compartment.)'
    ],
    difficulty: Difficulty.EASY,
    initialArray: [0, 7, 2, 9, 1, 5],
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
    title: 'Clear the Aisle',
    description: `Some seats are occupied by passengers without tickets (zeros). 
    They must move to the right end, without disturbing others.`,
    
    hints: [
      'Seat 0 is always unreserved seat',
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
    title: 'Inspection Check',
    description: `The inspector is watching. Review the ticket numbers.
    Seat 0 will indicate the inspection result`,
    hints: ['If they are in increasing order set 1, else set 0',
    ],
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
    title: 'Seat Rotation',
    description: 'The compartment layout must shift forward smoothly.',
    hints: ['Move everyone left without losing anyone.'],
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
    title: 'Ticket Conflict',
    description: 'Two passengers have the same ticket number. Only one is valid.',
    hints: ['Identify the conflict and report it in Seat 0.'],
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
];

