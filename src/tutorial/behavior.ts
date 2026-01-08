// src/tutorial/behavior.ts

import type { TutorialStepBehavior } from './types';
import {
    TutorialStepId,
  } from './types';
  
  export const TUTORIAL_STEP_BEHAVIOR: Record<
    TutorialStepId,
    TutorialStepBehavior
  > = {
    WELCOME: {
      blocksUI: true,
      completesOn: 'SCROLL',
    },
  
    PICK_EXPLAINED: {
      autoRun: true,
      highlight: {
        scope: 'HAND',
      },
      completesOn: 'AUTO',
    },
  
    MOVE_EXPLAINED: {
      autoRun: true,
      highlight: {
        scope: 'POINTER',
      },
      completesOn: 'AUTO',
    },
  
    PUT_EXPLAINED: {
      highlight: {
        scope: 'ARRAY',
      },
      completesOn: 'AUTO',
    },
  
    RUN_EXECUTION: {
      highlight: {
        scope: 'CONTROL_BAR',
        control: 'RUN',
      },
      completesOn: 'RUN_CLICK',
    },
  };
  