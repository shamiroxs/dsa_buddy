/**
 * Execution state model for the VM
 * Tracks array state, pointers, registers, and execution position
 */

export interface ExecutionState {
  // Array state
  array: number[];
  
  // Single pointer (index position in array)
  mocoPointer: number;
  chocoPointer: number;
  
  // Hand register (temporary storage - like holding a value)
  hand: number | null;
  
  // Execution state
  currentLine: number;
  stepCount: number;
  
  // Program
  instructions: any[]; // Will be typed with Instruction from engine
  
  // Label map for jumps (label name -> line number)
  labelMap: Record<string, number>;
  
  // History for rewind
  history: ExecutionState[];
}

export function createInitialState(
  initialArray: number[],
  instructions: any[]
): ExecutionState {
  // Build label map from LABEL instructions
  const labelMap: Record<string, number> = {};
  instructions.forEach((inst: any, index: number) => {
    if (inst.type === 'LABEL' && inst.labelName) {
      labelMap[inst.labelName] = index;
    }
  });
  
  return {
    array: [...initialArray],
    mocoPointer: 0,
    chocoPointer: 0,
    hand: null,
    currentLine: 0,
    stepCount: 0,
    instructions,
    labelMap,
    history: [],
  };
}

export function cloneState(state: ExecutionState): ExecutionState {
  return {
    array: [...state.array],
    mocoPointer: state.mocoPointer,
    chocoPointer: state.chocoPointer,
    hand: state.hand,
    currentLine: state.currentLine,
    stepCount: state.stepCount,
    instructions: state.instructions,
    labelMap: { ...state.labelMap },
    history: [...state.history],
  };
}



