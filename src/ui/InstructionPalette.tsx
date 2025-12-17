/**
 * Instruction palette for building programs
 * Drag-and-drop or click-to-add interface
 */

import { useGameStore } from '../orchestrator/store';
import { InstructionType } from '../engine/instructions/types';
import type { Instruction } from '../engine/instructions/types';
import {
  createLoad,
  createStore,
  createMovePointer,
  createCompare,
  createJumpIf,
  createJump,
  createIncrement,
  createDecrement,
  createNoop,
} from '../engine/instructions/factory';

const instructionTemplates = [
  { type: InstructionType.LOAD, label: 'LOAD', description: 'Load value from array index' },
  { type: InstructionType.STORE, label: 'STORE', description: 'Store value to array index' },
  { type: InstructionType.MOVE_POINTER, label: 'MOVE', description: 'Move pointer position' },
  { type: InstructionType.COMPARE, label: 'COMPARE', description: 'Compare two array values' },
  { type: InstructionType.JUMP_IF, label: 'JUMP_IF', description: 'Conditional jump' },
  { type: InstructionType.JUMP, label: 'JUMP', description: 'Unconditional jump' },
  { type: InstructionType.INCREMENT, label: 'INCREMENT', description: 'Increment array value' },
  { type: InstructionType.DECREMENT, label: 'DECREMENT', description: 'Decrement array value' },
  { type: InstructionType.NOOP, label: 'NOOP', description: 'No operation' },
];

export function InstructionPalette() {
  const { playerInstructions, addInstruction } = useGameStore();
  
  const handleAddInstruction = (type: InstructionType) => {
    const lineNumber = playerInstructions.length;
    let instruction: Instruction;
    
    // Create instruction with default values (user can edit later)
    switch (type) {
      case InstructionType.LOAD:
        instruction = createLoad(0, lineNumber);
        break;
      case InstructionType.STORE:
        instruction = createStore(0, lineNumber);
        break;
      case InstructionType.MOVE_POINTER:
        instruction = createMovePointer('ptr1', 1, lineNumber);
        break;
      case InstructionType.COMPARE:
        instruction = createCompare(0, 1, lineNumber);
        break;
      case InstructionType.JUMP_IF:
        instruction = createJumpIf('EQUAL', lineNumber + 1, lineNumber);
        break;
      case InstructionType.JUMP:
        instruction = createJump(lineNumber + 1, lineNumber);
        break;
      case InstructionType.INCREMENT:
        instruction = createIncrement(0, lineNumber);
        break;
      case InstructionType.DECREMENT:
        instruction = createDecrement(0, lineNumber);
        break;
      case InstructionType.NOOP:
        instruction = createNoop(lineNumber);
        break;
      default:
        return;
    }
    
    addInstruction(instruction);
  };
  
  return (
    <div className="instruction-palette bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Instructions</h3>
      <div className="grid grid-cols-3 gap-2">
        {instructionTemplates.map((template) => (
          <button
            key={template.type}
            onClick={() => handleAddInstruction(template.type)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
            title={template.description}
          >
            {template.label}
          </button>
        ))}
      </div>
      
      {/* Current program */}
      <div className="mt-4">
        <h4 className="text-gray-400 text-sm mb-2">Your Program</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {playerInstructions.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No instructions yet</div>
          ) : (
            playerInstructions.map((inst, idx) => (
              <InstructionLine key={inst.id} instruction={inst} lineNumber={idx} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function InstructionLine({ instruction, lineNumber }: { instruction: Instruction; lineNumber: number }) {
  const { removeInstruction } = useGameStore();
  
  const formatInstruction = (inst: Instruction): string => {
    switch (inst.type) {
      case InstructionType.LOAD:
        return `LOAD [${inst.index}]`;
      case InstructionType.STORE:
        return `STORE [${inst.index}]`;
      case InstructionType.MOVE_POINTER:
        return `MOVE ${inst.pointerId} ${inst.offset > 0 ? '+' : ''}${inst.offset}`;
      case InstructionType.COMPARE:
        return `COMPARE [${inst.leftIndex}] vs [${inst.rightIndex}]`;
      case InstructionType.JUMP_IF:
        return `JUMP_IF ${inst.condition} → ${inst.targetLine + 1}`;
      case InstructionType.JUMP:
        return `JUMP → ${inst.targetLine + 1}`;
      case InstructionType.INCREMENT:
        return `INCREMENT [${inst.index}]`;
      case InstructionType.DECREMENT:
        return `DECREMENT [${inst.index}]`;
      case InstructionType.NOOP:
        return 'NOOP';
      default:
        return 'UNKNOWN';
    }
  };
  
  return (
    <div className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded text-sm">
      <span className="text-gray-400 w-6">{lineNumber + 1}</span>
      <span className="text-white font-mono flex-1">{formatInstruction(instruction)}</span>
      <button
        onClick={() => removeInstruction(instruction.id)}
        className="text-red-400 hover:text-red-300"
      >
        ×
      </button>
    </div>
  );
}

