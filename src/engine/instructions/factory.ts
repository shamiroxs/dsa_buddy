/**
 * Factory functions for creating instructions
 */


import type { Instruction, PointerTarget } from './types';
import { InstructionType } from './types';

export function createMoveLeft(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `moveleft-${Date.now()}-${Math.random()}`,
    type: InstructionType.MOVE_LEFT,
    target,
    lineNumber,
  };
}

export function createMoveRight(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `moveright-${Date.now()}-${Math.random()}`,
    type: InstructionType.MOVE_RIGHT,
    target,
    lineNumber,
  };
}

export function createMoveToEnd(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `movetoend-${Date.now()}-${Math.random()}`,
    type: InstructionType.MOVE_TO_END,
    target,
    lineNumber,
  };
}

export function createSetPointer(
  target: PointerTarget,
  index: number,
  lineNumber: number
): Instruction {
  return {
    id: `setptr-${Date.now()}-${Math.random()}`,
    type: InstructionType.SET_POINTER,
    target,
    index,
    lineNumber,
  };
}


export function createPick(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `pick-${Date.now()}-${Math.random()}`,
    type: InstructionType.PICK,
    target,
    lineNumber,
  };
}

export function createPut(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `put-${Date.now()}-${Math.random()}`,
    type: InstructionType.PUT,
    target,
    lineNumber,
  };
}


export function createIfGreater(
  target: PointerTarget,
  label: string,
  lineNumber: number
): Instruction {
  return {
    id: `ifgreater-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_GREATER,
    target,
    label,
    lineNumber,
  };
}

export function createIfLess(
  target: PointerTarget,
  label: string,
  lineNumber: number
): Instruction {
  return {
    id: `ifless-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_LESS,
    target,
    label,
    lineNumber,
  };
}

export function createIfEqual(
  target: PointerTarget,
  label: string,
  lineNumber: number
): Instruction {
  return {
    id: `ifequal-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_EQUAL,
    target,
    label,
    lineNumber,
  };
}

export function createIfEnd(
  target: PointerTarget,
  label: string,
  lineNumber: number
): Instruction {
  return {
    id: `ifend-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_END,
    target,
    label,
    lineNumber,
  };
}

export function createIfMeet(
  label: string,
  lineNumber: number
): Instruction {
  return {
    id: `ifmeet-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_MEET,
    label,
    lineNumber,
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

export function createSwap(lineNumber: number): Instruction {
  return {
    id: `swap-${Date.now()}-${Math.random()}`,
    type: InstructionType.SWAP,
    lineNumber,
  };
}

export function createSwapWithNext(target: PointerTarget, lineNumber: number): Instruction {
  return {
    id: `swap-${Date.now()}-${Math.random()}`,
    type: InstructionType.SWAP_WITH_NEXT,
    target,
    lineNumber,
  };
}


export function createIncrementValue(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `incval-${Date.now()}-${Math.random()}`,
    type: InstructionType.INCREMENT_VALUE,
    target,
    lineNumber,
  };
}

export function createDecrementValue(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `decval-${Date.now()}-${Math.random()}`,
    type: InstructionType.DECREMENT_VALUE,
    target,
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
