// src/tutorial/types.ts

/** All possible tutorial step IDs */
export const TutorialStepId = {
    WELCOME: 'WELCOME',
    PICK_EXPLAINED: 'PICK_EXPLAINED',
    MOVE_EXPLAINED: 'MOVE_EXPLAINED',
    PUT_EXPLAINED: 'PUT_EXPLAINED',
    RUN_EXECUTION: 'RUN_EXECUTION',
  } as const;
  
  export type TutorialStepId =
    typeof TutorialStepId[keyof typeof TutorialStepId];
  
  /** Where the tutorial is visually focused */
  export type TutorialScope =
    | 'GLOBAL'
    | 'CONTROL_BAR'
    | 'ARRAY'
    | 'POINTER'
    | 'HAND'
    | 'TIMELINE';
  
  /** What user action can complete a tutorial step */
  export type TutorialTrigger =
    | 'SCROLL'
    | 'RUN_CLICK'
    | 'STEP_CLICK'
    | 'ANY_CONTROL'
    | 'AUTO';
  
  /** Visual emphasis hints (non-behavioral) */
  export interface TutorialHighlight {
    scope: TutorialScope;
    control?: 'RUN' | 'STEP' | 'REWIND' | 'RESET';
    targetIndex?: number; // for array-level tutorials later
  }
  
  /** Behavior configuration per tutorial step */
  export interface TutorialStepBehavior {
    autoRun?: boolean;
    blocksUI?: boolean;
    highlight?: TutorialHighlight;
    completesOn?: TutorialTrigger;
  }
  
  /** Content shown in TutorialOverlay */
  export interface TutorialStepContent {
    id: TutorialStepId;
    title: string;
    text: string;
  }
  