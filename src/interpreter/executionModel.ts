/**
 * Execution state model for the VM
 * Tracks array state, pointers, registers, and execution position
 */

export interface ExecutionState {
  // Array state
  array: number[];
  
  // Pointers (index positions in array)
  pointers: Record<string, number>;
  
  // Registers (temporary storage)
  registers: {
    accumulator: number | null;
    comparisonResult: 'EQUAL' | 'NOT_EQUAL' | 'GREATER' | 'LESS' | 'GREATER_EQUAL' | 'LESS_EQUAL' | null;
  };
  
  // Execution state
  currentLine: number;
  stepCount: number;
  
  // Program
  instructions: any[]; // Will be typed with Instruction from engine
  
  // History for rewind
  history: ExecutionState[];
}

export function createInitialState(
  initialArray: number[],
  instructions: any[]
): ExecutionState {
  return {
    array: [...initialArray],
    pointers: {},
    registers: {
      accumulator: null,
      comparisonResult: null,
    },
    currentLine: 0,
    stepCount: 0,
    instructions,
    history: [],
  };
}

export function cloneState(state: ExecutionState): ExecutionState {
  return {
    array: [...state.array],
    pointers: { ...state.pointers },
    registers: {
      accumulator: state.registers.accumulator,
      comparisonResult: state.registers.comparisonResult,
    },
    currentLine: state.currentLine,
    stepCount: state.stepCount,
    instructions: state.instructions,
    history: [...state.history],
  };
}

