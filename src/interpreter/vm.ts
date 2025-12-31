/**
 * Virtual Machine for executing instructions
 * Pure logic, no React dependencies
 */


import type { Instruction } from '../engine/instructions/types';
import { InstructionType } from '../engine/instructions/types';
import type { ExecutionState } from './executionModel';
import { cloneState } from './executionModel';

export type ExecutionErrorContext =
  | { kind: 'INSTRUCTION'; instructionId: string }
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
//copied form setPointer
function setValue(
  state: ExecutionState,
  target: 'MOCO' | 'CHOCO',
  value: number
): void {
  const ptr = target === 'MOCO'
    ? state.mocoPointer
    : state.chocoPointer;

  state.array[ptr] = value;
}


function instructionError(
  state: ExecutionState,
  instruction: Instruction,
  message: string
): ExecutionResult {
  return {
    state,
    success: false,
    error: message,
    errorContext: {
      kind: 'INSTRUCTION',
      instructionId: instruction.id,
    },
    completed: false,
  };
}

/**
 * Execute a single instruction
 */
export function executeStep(state: ExecutionState): ExecutionResult {
  const newState = cloneState(state);
  newState.history.push(cloneState(state));

  const stack = newState.executionStack;

  // Program finished
  if (stack.length === 0) {
    newState.currentInstructionId = null;
    return {
      state: newState,
      success: false,
      error: 'Program completed',
      completed: true,
    };
  }

  const frame = stack[stack.length - 1];

  // End of current frame
  if (frame.line >= frame.instructions.length) {
    stack.pop();

    if (stack.length === 0) {
      newState.currentInstructionId = null;
      return {
        state: newState,
        success: true,
        completed: true,
      };
    }

    // Resume parent frame
    stack[stack.length - 1].line++;
    newState.stepCount++;

    return {
      state: newState,
      success: true,
      completed: false,
    };
  }

  const instruction = frame.instructions[frame.line] as Instruction;
  newState.currentInstructionId = instruction.id;

  try {
    switch (instruction.type) {

      /* ─────────────── IF BLOCKS ─────────────── */

      case InstructionType.IF_LESS: {
        if (newState.hand === null) {
          return instructionError(newState, instruction, 'Hand is empty');
        }

        const ptr = getPointer(newState, instruction.target);

        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }

        if (newState.hand < newState.array[ptr]) {
          stack.push({ instructions: instruction.body, line: 0 });
        } else {
          frame.line++;
        }
        break;
      }

      case InstructionType.IF_GREATER: {
        if (newState.hand === null) {
          return instructionError(newState, instruction, 'Hand is empty');
        }

        const ptr = getPointer(newState, instruction.target);

        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }

        if (newState.hand > newState.array[ptr]) {
          stack.push({ instructions: instruction.body, line: 0 });
        } else {
          frame.line++;
        }
        break;
      }

      case InstructionType.IF_EQUAL: {
        if (newState.hand === null) {
          return instructionError(newState, instruction, 'Hand is empty');
        }

        const ptr = getPointer(newState, instruction.target);

        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }

        if (newState.hand === newState.array[ptr]) {
          stack.push({ instructions: instruction.body, line: 0 });
        } else {
          frame.line++;
        }
        break;
      }

      case InstructionType.IF_NOT_EQUAL: {
        if (newState.hand === null) {
          return instructionError(newState, instruction, 'Hand is empty');
        }

        const ptr = getPointer(newState, instruction.target);

        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }

        if (newState.hand !== newState.array[ptr]) {
          stack.push({ instructions: instruction.body, line: 0 });
        } else {
          frame.line++;
        }
        break;
      }

      case InstructionType.IF_END: {
        const ptr = getPointer(newState, instruction.target);
      
        if (ptr === newState.array.length - 1) {
          const targetLine = newState.labelMap[instruction.label];
          if (targetLine === undefined) {
            return instructionError(
              newState,
              instruction,
              `Label "${instruction.label}" not found`
            );
          }
      
          // Jump always resets to top-level frame
          newState.executionStack = [
            {
              instructions: newState.executionStack[0].instructions,
              line: targetLine,
            },
          ];
        } else {
          frame.line++;
        }
        break;
      }
      
      case InstructionType.IF_MEET: {
        if (newState.mocoPointer === newState.chocoPointer) {
          const targetLine = newState.labelMap[instruction.label];
          if (targetLine === undefined) {
            return instructionError(
              newState,
              instruction,
              `Label "${instruction.label}" not found`
            );
          }
      
          newState.executionStack = [
            {
              instructions: newState.executionStack[0].instructions,
              line: targetLine,
            },
          ];
        } else {
          frame.line++;
        }
        break;
      }
      

      /* ─────────────── JUMP / LABEL ─────────────── */

      case InstructionType.JUMP: {
        const target = newState.labelMap[instruction.label];
        if (target === undefined) {
          return instructionError(
            newState,
            instruction,
            `Label "${instruction.label}" not found`
          );
        }

        // Reset stack to top-level frame
        newState.executionStack = [
          {
            instructions: newState.executionStack[0].instructions,
            line: target,
          },
        ];
        break;
      }

      case InstructionType.LABEL:
        frame.line++;
        break;

      /* ─────────────── NORMAL INSTRUCTIONS ─────────────── */

      case InstructionType.MOVE_LEFT: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr <= 0) {
          return instructionError(newState, instruction, 'Cannot move left');
        }
        setPointer(newState, instruction.target, ptr - 1);
        frame.line++;
        break;
      }

      case InstructionType.MOVE_RIGHT: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr >= newState.array.length - 1) {
          return instructionError(newState, instruction, 'Cannot move right');
        }
        setPointer(newState, instruction.target, ptr + 1);
        frame.line++;
        break;
      }

      case InstructionType.MOVE_TO_END:
        setPointer(newState, instruction.target, newState.array.length - 1);
        frame.line++;
        break;

      case InstructionType.SET_POINTER:
        if (
          instruction.index < 0 ||
          instruction.index >= newState.array.length
        ) {
          return instructionError(newState, instruction, 'Index out of bounds');
        }
        setPointer(newState, instruction.target, instruction.index);
        frame.line++;
        break;

      case InstructionType.SET_VALUE:
        if (
          instruction.value < 0 
        ) {
          return instructionError(newState, instruction, 'Value should be positive');
        }
        setValue(newState, instruction.target, instruction.value);
        frame.line++;
        break;

      case InstructionType.PICK: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }
        newState.hand = newState.array[ptr];
        frame.line++;
        break;
      }

      case InstructionType.PUT: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }
        if (newState.hand === null) {
          return instructionError(newState, instruction, 'Hand is empty');
        }
        newState.array[ptr] = newState.hand;
        frame.line++;
        break;
      }

      case InstructionType.SWAP: {
        const m = newState.mocoPointer;
        const c = newState.chocoPointer;
        if (
          m < 0 || m >= newState.array.length ||
          c < 0 || c >= newState.array.length
        ) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }
        const temp = newState.array[m];
        newState.array[m] = newState.array[c];
        newState.array[c] = temp;
        frame.line++;
        break;
      }

      case InstructionType.SWAP_WITH_NEXT: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr < 0 || ptr >= newState.array.length - 1) {
          return instructionError(newState, instruction, 'Cannot swap');
        }
        const temp = newState.array[ptr];
        newState.array[ptr] = newState.array[ptr + 1];
        newState.array[ptr + 1] = temp;
        frame.line++;
        break;
      }

      case InstructionType.INCREMENT_VALUE: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }
        newState.array[ptr]++;
        frame.line++;
        break;
      }

      case InstructionType.DECREMENT_VALUE: {
        const ptr = getPointer(newState, instruction.target);
        if (ptr < 0 || ptr >= newState.array.length) {
          return instructionError(newState, instruction, 'Pointer out of bounds');
        }
        newState.array[ptr]--;
        frame.line++;
        break;
      }

      case InstructionType.WAIT:
        frame.line++;
        break;

      default:
        return instructionError(newState, instruction, 'Unknown instruction');
    }

    newState.stepCount++;
    const topFrame = newState.executionStack[0];

    newState.currentLine = topFrame
      ? topFrame.line
      : newState.instructions.length;
    
    return {
      state: newState,
      success: true,
      completed: false,
    };

  } catch (err) {
    return {
      state: newState,
      success: false,
      error: err instanceof Error ? err.message : 'Execution error',
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
