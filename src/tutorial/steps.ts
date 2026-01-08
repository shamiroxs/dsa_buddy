// src/tutorial/steps.ts

import { TutorialStepId } from './types';
import type { TutorialStepContent } from './types';
export const TUTORIAL_STEPS: TutorialStepContent[] = [
  {
    id: TutorialStepId.WELCOME,
    title: 'Welcome aboard 👋',
    text: 'Scroll ↓ to begin.',
  },
  {
    id: TutorialStepId.PICK_EXPLAINED,
    title: 'Decide what MOCO carries',
    text: 'Pick takes the number from the seat.',
  },
  {
    id: TutorialStepId.MOVE_EXPLAINED,
    title: 'Where MOCO stands matters',
    text: 'Move MOCO between seats.',
  },
  {
    id: TutorialStepId.PUT_EXPLAINED,
    title: 'Make the change',
    text: 'Put places the value into the current seat.',
  },
  {
    id: TutorialStepId.RUN_EXECUTION,
    title: 'Watch what you created',
    text: 'Run or step through your orders.',
  },
];

/** Explicit tutorial order */
export const TUTORIAL_STEP_ORDER: TutorialStepId[] =
  TUTORIAL_STEPS.map((s) => s.id);
