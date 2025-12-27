/**
 * Virtual Machine for executing instructions
 * Pure logic, no React dependencies
 */


import type { Instruction } from '../engine/instructions/types';
import { InstructionType } from '../engine/instructions/types';
import type { ExecutionState } from './executionModel';
import { cloneState } from './executionModel';

export type ExecutionErrorContext =
  | { kind: 'INSTRUCTION'; line: number }
  | { kind: 'POINTER'; target: 'MOCO' | 'CHOCO' }
  | { kind: 'ARRAY_INDEX'; index: number }
  | { kind: 'ARRAY_RANGE'; from: number; to: number };

export interface ExecutionResult {
  state: ExecutionState;
  success: boolean;
  error?: string;
  errorContext?: ExecutionErrorContext;
  completed: boolean;
}

function getPointer(state: ExecutionState, target: 'MOCO' | 'CHOCO'): number {
  return target === 'MOCO' ? state.mocoPointer : state.chocoPointer;
}

function setPointer(
  state: ExecutionState,
  target: 'MOCO' | 'CHOCO',
  value: number
): void {
  if (target === 'MOCO') {
    state.mocoPointer = value;
  } else {
    state.chocoPointer = value;
  }
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
      case InstructionType.MOVE_LEFT: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr <= 0) {
          return {
            state: newState,
            success: false,
            error: 'Cannot move left: pointer already at start',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        setPointer(newState, instruction.target, ptr - 1);
        newState.currentLine++;
        break;
      }
      
        
      case InstructionType.MOVE_RIGHT: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr >= newState.array.length - 1) {
          return {
            state: newState,
            success: false,
            error: 'Cannot move right: pointer already at end',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        setPointer(newState, instruction.target, ptr + 1);
        newState.currentLine++;
        break;
      }
      
      case InstructionType.MOVE_TO_END: {
        setPointer(
          newState,
          instruction.target,
          newState.array.length - 1
        );
        newState.currentLine++;
        break;
      }   
        
      case InstructionType.SET_POINTER:
        if (instruction.index < 0 || instruction.index >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: `Index ${instruction.index} out of bounds`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
        setPointer(newState, instruction.target, instruction.index);
        newState.currentLine++;
        break;
        
      case InstructionType.PICK: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        newState.hand = newState.array[ptr];
        newState.currentLine++;
        break;
      }
        
        
      case InstructionType.PUT: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        newState.array[ptr] = newState.hand;
        newState.currentLine++;
        break;
      }
      
        
      case InstructionType.IF_GREATER: {
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        const targetLine = newState.labelMap[instruction.label];
        if (targetLine === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        if (newState.hand > newState.array[ptr]) {
          newState.currentLine = targetLine;
        } else {
          newState.currentLine++;
        }
      
        break;
      }
        
      case InstructionType.IF_LESS: {
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        const targetLine = newState.labelMap[instruction.label];
        if (targetLine === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        if (newState.hand < newState.array[ptr]) {
          newState.currentLine = targetLine;
        } else {
          newState.currentLine++;
        }
      
        break;
      }
      
      case InstructionType.IF_EQUAL: {
        if (newState.hand === null) {
          return {
            state: newState,
            success: false,
            error: 'Hand is empty (use PICK first)',
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        const targetLine = newState.labelMap[instruction.label];
        if (targetLine === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        if (newState.hand === newState.array[ptr]) {
          newState.currentLine = targetLine;
        } else {
          newState.currentLine++;
        }
      
        break;
      }     
           
      case InstructionType.IF_END: {
        const ptr = getPointer(newState, instruction.target);
        const targetLine = newState.labelMap[instruction.label];
      
        if (targetLine === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        if (ptr === newState.array.length - 1) {
          newState.currentLine = targetLine;
        } else {
          newState.currentLine++;
        }
      
        break;
      }     
        
      case InstructionType.IF_MEET: {
        const targetLine = newState.labelMap[instruction.label];
      
        if (targetLine === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        if (newState.mocoPointer === newState.chocoPointer) {
          newState.currentLine = targetLine;
        } else {
          newState.currentLine++;
        }
      
        break;
      }
      
      case InstructionType.JUMP:
        const jumpTarget = newState.labelMap[instruction.label];
        if (jumpTarget === undefined) {
          return {
            state: newState,
            success: false,
            error: `Label "${instruction.label}" not found`,
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
        newState.currentLine = jumpTarget;
        break;
        
      case InstructionType.LABEL:
        // Labels are no-ops during execution (they're processed during initialization)
        newState.currentLine++;
        break;
        
      case InstructionType.SWAP: {
        const moco = newState.mocoPointer;
        const choco = newState.chocoPointer;
      
        if (
          moco < 0 || moco >= newState.array.length ||
          choco < 0 || choco >= newState.array.length
        ) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'INSTRUCTION',
              line: newState.currentLine,
            },
            completed: false,
          };
        }
      
        const temp = newState.array[moco];
        newState.array[moco] = newState.array[choco];
        newState.array[choco] = temp;
      
        newState.currentLine++;
        break;
      }  
      case InstructionType.SWAP_WITH_NEXT: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length - 1) {
          return {
            state: newState,
            success: false,
            error: 'Cannot swap: pointer at or beyond last element',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        const temp = newState.array[ptr];
        newState.array[ptr] = newState.array[ptr + 1];
        newState.array[ptr + 1] = temp;
      
        newState.currentLine++;
        break;
      }
          
        
      case InstructionType.INCREMENT_VALUE: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        newState.array[ptr]++;
        newState.currentLine++;
        break;
      }
      
        
      case InstructionType.DECREMENT_VALUE: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr < 0 || ptr >= newState.array.length) {
          return {
            state: newState,
            success: false,
            error: 'Pointer out of bounds',
            errorContext: {
              kind: 'POINTER',
              target: instruction.target,
            },
            completed: false,
          };
        }
      
        newState.array[ptr]--;
        newState.currentLine++;
        break;
      }
      
        
      case InstructionType.WAIT:
        // Consumes a step but does nothing
        newState.currentLine++;
        break;
        
      default:
        return {
          state: newState,
          success: false,
          error: `Unknown instruction type: ${(instruction as any).type}`,
          errorContext: {
            kind: 'INSTRUCTION',
            line: newState.currentLine,
          },
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
