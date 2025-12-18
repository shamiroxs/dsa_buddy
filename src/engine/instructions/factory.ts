/**
 * Factory functions for creating instructions
 */

import type { Instruction } from './types';
import { InstructionType } from './types';

export function createMoveLeft(lineNumber: number): Instruction {
  return {
    id: `moveleft-${Date.now()}-${Math.random()}`,
    type: InstructionType.MOVE_LEFT,
    lineNumber,
  };
}

export function createMoveRight(lineNumber: number): Instruction {
  return {
    id: `moveright-${Date.now()}-${Math.random()}`,
    type: InstructionType.MOVE_RIGHT,
    lineNumber,
  };
}

export function createSetPointer(index: number, lineNumber: number): Instruction {
  return {
    id: `setptr-${Date.now()}-${Math.random()}`,
    type: InstructionType.SET_POINTER,
    lineNumber,
    index,
  };
}

export function createPick(lineNumber: number): Instruction {
  return {
    id: `pick-${Date.now()}-${Math.random()}`,
    type: InstructionType.PICK,
    lineNumber,
  };
}

export function createPut(lineNumber: number): Instruction {
  return {
    id: `put-${Date.now()}-${Math.random()}`,
    type: InstructionType.PUT,
    lineNumber,
  };
}

export function createIfGreater(label: string, lineNumber: number): Instruction {
  return {
    id: `ifgreater-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_GREATER,
    lineNumber,
    label,
  };
}

export function createIfLess(label: string, lineNumber: number): Instruction {
  return {
    id: `ifless-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_LESS,
    lineNumber,
    label,
  };
}

export function createIfEqual(label: string, lineNumber: number): Instruction {
  return {
    id: `ifequal-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_EQUAL,
    lineNumber,
    label,
  };
}

export function createJump(label: string, lineNumber: number): Instruction {
  return {
    id: `jump-${Date.now()}-${Math.random()}`,
    type: InstructionType.JUMP,
    lineNumber,
    label,
  };
}

export function createLabel(labelName: string, lineNumber: number): Instruction {
  return {
    id: `label-${Date.now()}-${Math.random()}`,
    type: InstructionType.LABEL,
    lineNumber,
    labelName,
  };
}

export function createSwapWithNext(lineNumber: number): Instruction {
  return {
    id: `swap-${Date.now()}-${Math.random()}`,
    type: InstructionType.SWAP_WITH_NEXT,
    lineNumber,
  };
}

export function createIncrementValue(lineNumber: number): Instruction {
  return {
    id: `incval-${Date.now()}-${Math.random()}`,
    type: InstructionType.INCREMENT_VALUE,
    lineNumber,
  };
}

export function createDecrementValue(lineNumber: number): Instruction {
  return {
    id: `decval-${Date.now()}-${Math.random()}`,
    type: InstructionType.DECREMENT_VALUE,
    lineNumber,
  };
}

export function createWait(lineNumber: number): Instruction {
  return {
    id: `wait-${Date.now()}-${Math.random()}`,
    type: InstructionType.WAIT,
    lineNumber,
  };
}
