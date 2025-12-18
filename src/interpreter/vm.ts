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
      case InstructionType.MOVE_LEFT:
        if (newState.pointer <= 0) {
          return {
            state: newState,
            success: false,
            error: 'Cannot move left: pointer already at start',
            completed: false,
          };
        }
        newState.pointer--;
        newState.currentLine++;
        break;
        
      case InstructionType.MOVE_RIGHT:
        if (newState.pointer >= newState.array.length - 1) {
          return {
            state: newState,
            success: false,
            error: 'Cannot move right: pointer already at end',
            completed: false,
          };
        }
        newState.pointer++;
        newState.currentLine++;
        break;
        
      case InstructionType.SET_POINTER:
        if (instruction.index < 0 || instruction.index >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Index ${instruction.index} out of bounds`,
            completed: false,
          };
        }
        newState.pointer = instruction.index;
        newState.currentLine++;
        break;
        
      case InstructionType.PICK:
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        newState.hand = newState.array[newState.pointer];
        newState.currentLine++;
        break;
        
      case InstructionType.PUT:
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            completed: false,
          };
        }
        newState.array[newState.pointer] = newState.hand;
        newState.currentLine++;
        break;
        
      case InstructionType.IF_GREATER:
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            completed: false,
          };
        }
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        const targetLine = newState.labelMap[instruction.label];
        if (targetLine === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            completed: false,
          };
        }
        if (newState.hand > newState.array[newState.pointer]) {
          newState.currentLine = targetLine;
        } else {
          newState.currentLine++;
        }
        break;
        
      case InstructionType.IF_LESS:
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            completed: false,
          };
        }
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        const targetLineLess = newState.labelMap[instruction.label];
        if (targetLineLess === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            completed: false,
          };
        }
        if (newState.hand < newState.array[newState.pointer]) {
          newState.currentLine = targetLineLess;
        } else {
          newState.currentLine++;
        }
        break;
        
      case InstructionType.IF_EQUAL:
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            completed: false,
          };
        }
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        const targetLineEqual = newState.labelMap[instruction.label];
        if (targetLineEqual === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            completed: false,
          };
        }
        if (newState.hand === newState.array[newState.pointer]) {
          newState.currentLine = targetLineEqual;
        } else {
          newState.currentLine++;
        }
        break;
        
      case InstructionType.JUMP:
        const jumpTarget = newState.labelMap[instruction.label];
        if (jumpTarget === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            completed: false,
          };
        }
        newState.currentLine = jumpTarget;
        break;
        
      case InstructionType.LABEL:
        // Labels are no-ops during execution (they're processed during initialization)
        newState.currentLine++;
        break;
        
      case InstructionType.SWAP_WITH_NEXT:
        if (newState.pointer < 0 || newState.pointer >= newState.array.length - 1) {
          return {
            state: newState,
            success: false,
            error: 'Cannot swap: pointer at or beyond last element',
            completed: false,
          };
        }
        const temp = newState.array[newState.pointer];
        newState.array[newState.pointer] = newState.array[newState.pointer + 1];
        newState.array[newState.pointer + 1] = temp;
        newState.currentLine++;
        break;
        
      case InstructionType.INCREMENT_VALUE:
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        newState.array[newState.pointer]++;
        newState.currentLine++;
        break;
        
      case InstructionType.DECREMENT_VALUE:
        if (newState.pointer < 0 || newState.pointer >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            completed: false,
          };
        }
        newState.array[newState.pointer]--;
        newState.currentLine++;
        break;
        
      case InstructionType.WAIT:
        // Consumes a step but does nothing
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
