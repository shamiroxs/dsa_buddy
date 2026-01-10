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
    id: TutorialStepId.CHALLENGE_EXPLAINED,
    title: 'Your mission',
    text: 'This panel describes the problem you must solve.',
  },
  {
    id: TutorialStepId.VISUALIZATION_EXPLAINED,
    title: 'Watch the world',
    text: 'This area shows MOCO, CHOCO, and the seats in action.',
  },
  {
    id: TutorialStepId.PALETTE_EXPLAINED,
    title: 'Your instruction toolbox',
    text: 'Instructions are grouped by who they control: Here MOCO',
  },
  {
    id: TutorialStepId.PALETTE_HELP_EXPLAINED,
    title: 'Need help?',
    text: 'Tap the ⓘ icon to see what each instruction does.',
  },
  {
    id: TutorialStepId.PROGRAM_AREA_EXPLAINED,
    title: 'Build your program',
    text: 'Drag instructions here to build your plan.',
  },
  
  {
    id: TutorialStepId.PICK_EXPLAINED,
    title: 'Adding your first instruction',
    text: 'Pick takes the number from the seat.',
  },
  {
    id: TutorialStepId.MOVE_EXPLAINED,
    title: 'Move with purpose',
    text: 'Move MOCO between seats.',
  },
  {
    id: TutorialStepId.PUT_EXPLAINED,
    title: 'Place the value',
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
