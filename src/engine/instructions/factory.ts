/**
 * Factory functions for creating instructions
 */


import type { Instruction, PointerTarget } from './types';
import { InstructionType } from './types';

export function createInstruction(
  type: InstructionType,
  pointer: 'MOCO' | 'CHOCO',
  lineNumber: number
): Instruction {
  switch (type) {
    case InstructionType.MOVE_LEFT:
      return createMoveLeft(pointer, lineNumber);
    case InstructionType.MOVE_RIGHT:
      return createMoveRight(pointer, lineNumber);
    case InstructionType.MOVE_TO_END:
      return createMoveToEnd(pointer, lineNumber);
    case InstructionType.SET_POINTER:
      return createSetPointer(pointer, 0, lineNumber);
    case InstructionType.PICK:
      return createPick(pointer, lineNumber);
    case InstructionType.PUT:
      return createPut(pointer, lineNumber);
    case InstructionType.IF_GREATER:
      return createIfGreater(pointer, lineNumber);
    case InstructionType.IF_LESS:
      return createIfLess(pointer, lineNumber);
    case InstructionType.IF_EQUAL:
      return createIfEqual(pointer, lineNumber);
    case InstructionType.IF_END:
      return createIfEnd(pointer, 'label', lineNumber);
    case InstructionType.IF_MEET:
      return createIfMeet('label', lineNumber);
    case InstructionType.JUMP:
      return createJump('label', lineNumber);
    case InstructionType.LABEL:
      return createLabel('label', lineNumber);
    case InstructionType.SWAP:
      return createSwap(lineNumber);
    case InstructionType.SWAP_WITH_NEXT:
      return createSwapWithNext(pointer, lineNumber);
    case InstructionType.INCREMENT_VALUE:
      return createIncrementValue(pointer, lineNumber);
    case InstructionType.DECREMENT_VALUE:
      return createDecrementValue(pointer, lineNumber);
    case InstructionType.WAIT:
      return createWait(lineNumber);
    default:
      throw new Error('Unsupported instruction');
  }
}

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
  lineNumber: number
): Instruction {
  return {
    id: `ifgreater-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_GREATER,
    target,
    body: [],
    lineNumber,
  };
}

export function createIfLess(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `ifless-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_LESS,
    target,
    body: [],
    lineNumber,
  };
}

export function createIfEqual(
  target: PointerTarget,
  lineNumber: number
): Instruction {
  return {
    id: `ifequal-${Date.now()}-${Math.random()}`,
    type: InstructionType.IF_EQUAL,
    target,
    body: [],
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
