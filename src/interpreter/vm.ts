/**
 * Virtual Machine for executing instructions
 * Pure logic, no React dependencies
 */

import type { Instruction } from '../engine/instructions/types';
import { InstructionType } from '../engine/instructions/types';
import type { ExecutionState } from './executionModel';
import { cloneState } from './executionModel';

export interface ExecutionResult {
  state: ExecutionState;
  success: boolean;
  error?: string;
  completed: boolean;
}

/**
 * Execute a single instruction
 */
export function executeStep(state: ExecutionState): ExecutionResult {
  // Save current state to history
  const newState = cloneState(state);
  newState.history.push(cloneState(state));
  
  if (newState.currentLine >= newState.instructions.length) {
    return {
      state: newState,
      success: false,
      error: 'Program completed',
      completed: true,
    };
  }
  
  const instruction = newState.instructions[newState.currentLine] as Instruction;
  
  try {
    switch (instruction.type) {
      case InstructionType.LOAD:
        if (instruction.index < 0 || instruction.index >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Index ${instruction.index} out of bounds`,
            completed: false,
          };
        }
        newState.registers.accumulator = newState.array[instruction.index];
        newState.currentLine++;
        break;
        
      case InstructionType.STORE:
        if (instruction.index < 0 || instruction.index >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Index ${instruction.index} out of bounds`,
            completed: false,
          };
        }
        if (newState.registers.accumulator === null) {
          return {
            state: newState,
            success: false,
            error: 'Accumulator is empty',
            completed: false,
          };
        }
        newState.array[instruction.index] = newState.registers.accumulator;
        newState.currentLine++;
        break;
        
      case InstructionType.MOVE_POINTER:
        if (!newState.pointers[instruction.pointerId]) {
          newState.pointers[instruction.pointerId] = 0;
        }
        const newPosition = newState.pointers[instruction.pointerId] + instruction.offset;
        if (newPosition < 0 || newPosition >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Pointer ${instruction.pointerId} would move out of bounds`,
            completed: false,
          };
        }
        newState.pointers[instruction.pointerId] = newPosition;
        newState.currentLine++;
        break;
        
      case InstructionType.COMPARE:
        if (instruction.leftIndex < 0 || instruction.leftIndex >= newState.array.length ||
            instruction.rightIndex < 0 || instruction.rightIndex >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Comparison indices out of bounds',
            completed: false,
          };
        }
        const left = newState.array[instruction.leftIndex];
        const right = newState.array[instruction.rightIndex];
        
        if (left === right) {
          newState.registers.comparisonResult = 'EQUAL';
        } else if (left > right) {
          newState.registers.comparisonResult = 'GREATER';
        } else {
          newState.registers.comparisonResult = 'LESS';
        }
        newState.currentLine++;
        break;
        
      case InstructionType.JUMP_IF:
        if (newState.registers.comparisonResult === null) {
          return {
            state: newState,
            success: false,
            error: 'No comparison result available',
            completed: false,
          };
        }
        let shouldJump = false;
        switch (instruction.condition) {
          case 'EQUAL':
            shouldJump = newState.registers.comparisonResult === 'EQUAL';
            break;
          case 'NOT_EQUAL':
            shouldJump = newState.registers.comparisonResult !== 'EQUAL';
            break;
          case 'GREATER':
            shouldJump = newState.registers.comparisonResult === 'GREATER';
            break;
          case 'LESS':
            shouldJump = newState.registers.comparisonResult === 'LESS';
            break;
          case 'GREATER_EQUAL':
            shouldJump = newState.registers.comparisonResult === 'GREATER' || 
                        newState.registers.comparisonResult === 'EQUAL';
            break;
          case 'LESS_EQUAL':
            shouldJump = newState.registers.comparisonResult === 'LESS' || 
                        newState.registers.comparisonResult === 'EQUAL';
            break;
        }
        if (shouldJump) {
          newState.currentLine = instruction.targetLine;
        } else {
          newState.currentLine++;
        }
        break;
        
      case InstructionType.JUMP:
        if (instruction.targetLine < 0 || instruction.targetLine >= newState.instructions.length) {
          return {
            state: newState,
            success: false,
            error: `Jump target ${instruction.targetLine} out of bounds`,
            completed: false,
          };
        }
        newState.currentLine = instruction.targetLine;
        break;
        
      case InstructionType.INCREMENT:
        if (instruction.index < 0 || instruction.index >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Index ${instruction.index} out of bounds`,
            completed: false,
          };
        }
        newState.array[instruction.index]++;
        newState.currentLine++;
        break;
        
      case InstructionType.DECREMENT:
        if (instruction.index < 0 || instruction.index >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Index ${instruction.index} out of bounds`,
            completed: false,
          };
        }
        newState.array[instruction.index]--;
        newState.currentLine++;
        break;
        
      case InstructionType.NOOP:
        newState.currentLine++;
        break;
        
      default:
        return {
          state: newState,
          success: false,
          error: `Unknown instruction type: ${(instruction as any).type}`,
          completed: false,
        };
    }
    
    newState.stepCount++;
    
    return {
      state: newState,
      success: true,
      completed: newState.currentLine >= newState.instructions.length,
    };
  } catch (error) {
    return {
      state: newState,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      completed: false,
    };
  }
}

/**
 * Rewind to previous state
 */
export function rewindStep(state: ExecutionState): ExecutionState | null {
  if (state.history.length === 0) {
    return null;
  }
  
  const previousState = state.history[state.history.length - 1];
  const newState = cloneState(previousState);
  newState.history = state.history.slice(0, -1);
  
  return newState;
}

