/**
 * Core instruction types for the DSA game
 * Intuitive, game-like instruction set for array manipulation
 */

export const InstructionType = {
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  SET_POINTER: 'SET_POINTER',
  PICK: 'PICK',
  PUT: 'PUT',
  IF_GREATER: 'IF_GREATER',
  IF_LESS: 'IF_LESS',
  IF_EQUAL: 'IF_EQUAL',
  IF_END: 'IF_END',
  JUMP: 'JUMP',
  LABEL: 'LABEL',
  SWAP_WITH_NEXT: 'SWAP_WITH_NEXT',
  INCREMENT_VALUE: 'INCREMENT_VALUE',
  DECREMENT_VALUE: 'DECREMENT_VALUE',
  WAIT: 'WAIT',
} as const;

export type InstructionType = typeof InstructionType[keyof typeof InstructionType];

export interface BaseInstruction {
  id: string;
  type: InstructionType;
  lineNumber: number;
}

export interface MoveLeftInstruction extends BaseInstruction {
  type: 'MOVE_LEFT';
}

export interface MoveRightInstruction extends BaseInstruction {
  type: 'MOVE_RIGHT';
}

export interface SetPointerInstruction extends BaseInstruction {
  type: 'SET_POINTER';
  index: number; // pointer = index
}

export interface PickInstruction extends BaseInstruction {
  type: 'PICK'; // hand = array[pointer]
}

export interface PutInstruction extends BaseInstruction {
  type: 'PUT'; // array[pointer] = hand
}

export interface IfGreaterInstruction extends BaseInstruction {
  type: 'IF_GREATER';
  label: string; // jump if hand > array[pointer]
}

export interface IfLessInstruction extends BaseInstruction {
  type: 'IF_LESS';
  label: string; // jump if hand < array[pointer]
}

export interface IfEqualInstruction extends BaseInstruction {
  type: 'IF_EQUAL';
  label: string; // jump if hand === array[pointer]
}

export interface IfEndInstruction extends BaseInstruction {
  type: 'IF_END';
  label: string; // jump if pointer === array.length - 1
}

export interface JumpInstruction extends BaseInstruction {
  type: 'JUMP';
  label: string;
}

export interface LabelInstruction extends BaseInstruction {
  type: 'LABEL';
  labelName: string;
}

export interface SwapWithNextInstruction extends BaseInstruction {
  type: 'SWAP_WITH_NEXT'; // swap array[pointer] with array[pointer+1]
}

export interface IncrementValueInstruction extends BaseInstruction {
  type: 'INCREMENT_VALUE'; // array[pointer]++
}

export interface DecrementValueInstruction extends BaseInstruction {
  type: 'DECREMENT_VALUE'; // array[pointer]--
}

export interface WaitInstruction extends BaseInstruction {
  type: 'WAIT'; // consumes a step but does nothing
}

export type Instruction =
  | MoveLeftInstruction
  | MoveRightInstruction
  | SetPointerInstruction
  | PickInstruction
  | PutInstruction
  | IfGreaterInstruction
  | IfLessInstruction
  | IfEqualInstruction
  | IfEndInstruction
  | JumpInstruction
  | LabelInstruction
  | SwapWithNextInstruction
  | IncrementValueInstruction
  | DecrementValueInstruction
  | WaitInstruction;
  

