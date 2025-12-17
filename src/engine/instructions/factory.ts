/**
 * Factory functions for creating instructions
 */

import type { Instruction } from './types';
import { InstructionType } from './types';

export function createLoad(index: number, lineNumber: number): Instruction {
  return {
    id: `load-${Date.now()}-${Math.random()}`,
    type: InstructionType.LOAD,
    lineNumber,
    index,
  };
}

export function createStore(index: number, lineNumber: number): Instruction {
  return {
    id: `store-${Date.now()}-${Math.random()}`,
    type: InstructionType.STORE,
    lineNumber,
    index,
  };
}

export function createMovePointer(
  pointerId: string,
  offset: number,
  lineNumber: number
): Instruction {
  return {
    id: `move-${Date.now()}-${Math.random()}`,
    type: InstructionType.MOVE_POINTER,
    lineNumber,
    pointerId,
    offset,
  };
}

export function createCompare(
  leftIndex: number,
  rightIndex: number,
  lineNumber: number
): Instruction {
  return {
    id: `compare-${Date.now()}-${Math.random()}`,
    type: InstructionType.COMPARE,
    lineNumber,
    leftIndex,
    rightIndex,
  };
}

export function createJumpIf(
  condition: 'EQUAL' | 'NOT_EQUAL' | 'GREATER' | 'LESS' | 'GREATER_EQUAL' | 'LESS_EQUAL',
  targetLine: number,
  lineNumber: number
): Instruction {
  return {
    id: `jumpif-${Date.now()}-${Math.random()}`,
    type: InstructionType.JUMP_IF,
    lineNumber,
    condition,
    targetLine,
  };
}

export function createJump(targetLine: number, lineNumber: number): Instruction {
  return {
    id: `jump-${Date.now()}-${Math.random()}`,
    type: InstructionType.JUMP,
    lineNumber,
    targetLine,
  };
}

export function createIncrement(index: number, lineNumber: number): Instruction {
  return {
    id: `inc-${Date.now()}-${Math.random()}`,
    type: InstructionType.INCREMENT,
    lineNumber,
    index,
  };
}

export function createDecrement(index: number, lineNumber: number): Instruction {
  return {
    id: `dec-${Date.now()}-${Math.random()}`,
    type: InstructionType.DECREMENT,
    lineNumber,
    index,
  };
}

export function createNoop(lineNumber: number): Instruction {
  return {
    id: `noop-${Date.now()}-${Math.random()}`,
    type: InstructionType.NOOP,
    lineNumber,
  };
}

