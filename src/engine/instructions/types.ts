/**
 * Core instruction types for the DSA game
 * Inspired by Human Resource Machine - instruction-based programming
 */

export const InstructionType = {
  LOAD: 'LOAD',
  STORE: 'STORE',
  MOVE_POINTER: 'MOVE_POINTER',
  COMPARE: 'COMPARE',
  JUMP_IF: 'JUMP_IF',
  JUMP: 'JUMP',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  NOOP: 'NOOP',
} as const;

export type InstructionType = typeof InstructionType[keyof typeof InstructionType];

export interface BaseInstruction {
  id: string;
  type: InstructionType;
  lineNumber: number;
}

export interface LoadInstruction extends BaseInstruction {
  type: 'LOAD';
  index: number; // Array index to load from
}

export interface StoreInstruction extends BaseInstruction {
  type: 'STORE';
  index: number; // Array index to store to
}

export interface MovePointerInstruction extends BaseInstruction {
  type: 'MOVE_POINTER';
  pointerId: string; // Which pointer to move
  offset: number; // How many positions to move
}

export interface CompareInstruction extends BaseInstruction {
  type: 'COMPARE';
  leftIndex: number;
  rightIndex: number;
}

export interface JumpIfInstruction extends BaseInstruction {
  type: 'JUMP_IF';
  condition: 'EQUAL' | 'NOT_EQUAL' | 'GREATER' | 'LESS' | 'GREATER_EQUAL' | 'LESS_EQUAL';
  targetLine: number;
}

export interface JumpInstruction extends BaseInstruction {
  type: 'JUMP';
  targetLine: number;
}

export interface IncrementInstruction extends BaseInstruction {
  type: 'INCREMENT';
  index: number;
}

export interface DecrementInstruction extends BaseInstruction {
  type: 'DECREMENT';
  index: number;
}

export interface NoopInstruction extends BaseInstruction {
  type: 'NOOP';
}

export type Instruction =
  | LoadInstruction
  | StoreInstruction
  | MovePointerInstruction
  | CompareInstruction
  | JumpIfInstruction
  | JumpInstruction
  | IncrementInstruction
  | DecrementInstruction
  | NoopInstruction;

