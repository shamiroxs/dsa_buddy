// src/tutorial/behavior.ts

import type { TutorialStepBehavior } from './types';
import {
    TutorialStepId,
  } from './types';
import { InstructionType } from '../engine/instructions/types';
 
  export const TUTORIAL_STEP_BEHAVIOR: Record<
  TutorialStepId,
  TutorialStepBehavior
> = {
  [TutorialStepId.WELCOME]: {
    blocksUI: true,
    completesOn: 'SCROLL',
  },

  [TutorialStepId.PICK_EXPLAINED]: {
    autoRun: true,
    highlight: {
      scope: 'INSTRUCTION_PALETTE',
      instructionType: InstructionType.PICK,
    },
    completesOn: 'AUTO',
  },

  [TutorialStepId.MOVE_EXPLAINED]: {
    autoRun: true,
    highlight: {
      scope: 'INSTRUCTION_PALETTE',
      instructionType: InstructionType.MOVE_RIGHT,
    },
    completesOn: 'AUTO',
  },

  [TutorialStepId.PUT_EXPLAINED]: {
    autoRun: true,
    highlight: {
      scope: 'INSTRUCTION_PALETTE',
      instructionType: InstructionType.PUT,
    },
    completesOn: 'AUTO',
  },

  [TutorialStepId.RUN_EXECUTION]: {
    highlight: {
      scope: 'CONTROL_BAR',
      control: 'RUN',
    },
    completesOn: 'RUN_CLICK',
  },
};

  