/**
 * Instruction palette for building programs
 * Drag-and-drop or click-to-add interface
 */


import { useState } from 'react';
import { useGameStore } from '../orchestrator/store';
import { InstructionType } from '../engine/instructions/types';
import type { Instruction } from '../engine/instructions/types';
import {
  createMoveLeft,
  createMoveRight,
  createMoveToEnd,
  createSetPointer,
  createPick,
  createPut,
  createIfGreater,
  createIfLess,
  createIfEqual,
  createIfEnd,
  createIfMeet,
  createJump,
  createLabel,
  createSwap,
  createSwapWithNext,
  createIncrementValue,
  createDecrementValue,
  createWait,
} from '../engine/instructions/factory';

//const pointer: 'MOCO' | 'CHOCO' = 'MOCO';
//const POINTERS: Array<'MOCO' | 'CHOCO'> = ['MOCO', 'CHOCO'];

const instructionTemplates = [
  { type: InstructionType.MOVE_LEFT, label: 'MOVE_LEFT', description: 'Move pointer left (pointer -= 1)' },
  { type: InstructionType.MOVE_RIGHT, label: 'MOVE_RIGHT', description: 'Move pointer right (pointer += 1)' },
  { type: InstructionType.MOVE_TO_END, label: 'MOVE_TO_END', description: 'Move pointer to end (pointer = length - 1)' },
  { type: InstructionType.SET_POINTER, label: 'SET_POINTER', description: 'Set pointer to index' },
  { type: InstructionType.PICK, label: 'PICK', description: 'Pick value at pointer into hand' },
  { type: InstructionType.PUT, label: 'PUT', description: 'Put hand value at pointer' },
  { type: InstructionType.IF_GREATER, label: 'IF_GREATER', description: 'Jump if hand > current value' },
  { type: InstructionType.IF_LESS, label: 'IF_LESS', description: 'Jump if hand < current value' },
  { type: InstructionType.IF_EQUAL, label: 'IF_EQUAL', description: 'Jump if hand === current value' },
  { 
    type: InstructionType.IF_END, 
    label: 'IF_END', 
    description: 'Jump if pointer is at last element' 
  },  
  { type: InstructionType.IF_MEET, label: 'IF_MEET', description: 'Jump if moco === choco' },
  { type: InstructionType.JUMP, label: 'JUMP', description: 'Jump to label' },
  { type: InstructionType.LABEL, label: 'LABEL', description: 'Define a label' },
  { type: InstructionType.SWAP, label: 'SWAP', description: 'Swap moco and choco value' },
  { type: InstructionType.SWAP_WITH_NEXT, label: 'SWAP_WITH_NEXT', description: 'Swap current with next element' },
  { type: InstructionType.INCREMENT_VALUE, label: 'INCREMENT_VALUE', description: 'Increment value at pointer' },
  { type: InstructionType.DECREMENT_VALUE, label: 'DECREMENT_VALUE', description: 'Decrement value at pointer' },
  { type: InstructionType.WAIT, label: 'WAIT', description: 'Wait (no operation)' },
];

export function InstructionPalette() {
  const { playerInstructions, addInstruction } = useGameStore();
  
  // Generate unique label name
  const generateUniqueLabelName = (): string => {
    const existingLabels = new Set<string>();
    playerInstructions.forEach((inst) => {
      if (inst.type === 'LABEL' && 'labelName' in inst) {
        existingLabels.add(inst.labelName);
      }
    });
    
    let counter = 1;
    let labelName = 'label1';
    while (existingLabels.has(labelName)) {
      counter++;
      labelName = `label${counter}`;
    }
    return labelName;
  };
  
  const handleAddInstruction = (type: InstructionType, pointer: 'MOCO' | 'CHOCO') => {
    const lineNumber = playerInstructions.length;
    let instruction: Instruction;
    
    // Create instruction with default values (user can edit later)
    switch (type) {
      case InstructionType.MOVE_LEFT:
        instruction = createMoveLeft(pointer, lineNumber);
        break;

      case InstructionType.MOVE_RIGHT:
        instruction = createMoveRight(pointer, lineNumber);
        break;
      case InstructionType.MOVE_TO_END:
        instruction = createMoveToEnd(pointer, lineNumber);
        break;

      case InstructionType.SET_POINTER:
        instruction = createSetPointer(pointer,0, lineNumber);
        break;
      case InstructionType.PICK:
        instruction = createPick(pointer, lineNumber);
        break;
      case InstructionType.PUT:
        instruction = createPut(pointer, lineNumber);
        break;
      case InstructionType.IF_GREATER:
        instruction = createIfGreater(pointer, generateUniqueLabelName(), lineNumber);
        break;
      case InstructionType.IF_LESS:
        instruction = createIfLess(pointer, generateUniqueLabelName(), lineNumber);
        break;
      case InstructionType.IF_EQUAL:
        instruction = createIfEqual(pointer, generateUniqueLabelName(), lineNumber);
        break;
      case InstructionType.IF_END:
        instruction = createIfEnd(pointer, generateUniqueLabelName(), lineNumber);
        break;
      case InstructionType.IF_MEET:
        instruction = createIfMeet(generateUniqueLabelName(), lineNumber);
        break;
        
      case InstructionType.JUMP:
        instruction = createJump(generateUniqueLabelName(), lineNumber);
        break;
      case InstructionType.LABEL:
        instruction = createLabel(generateUniqueLabelName(), lineNumber);
        break;
      case InstructionType.SWAP:
        instruction = createSwap(lineNumber);
        break;
      case InstructionType.SWAP_WITH_NEXT:
        instruction = createSwapWithNext(pointer, lineNumber);
        break;
      case InstructionType.INCREMENT_VALUE:
        instruction = createIncrementValue(pointer, lineNumber);
        break;
      case InstructionType.DECREMENT_VALUE:
        instruction = createDecrementValue(pointer, lineNumber);
        break;
      case InstructionType.WAIT:
        instruction = createWait(lineNumber);
        break;
      default:
        return;
    }
    
    addInstruction(instruction);
  };
  
  return (
    <div className="instruction-palette bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">Instructions</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* MOCO */}
        <div className="bg-blue-900/40 rounded-lg p-3">
          <h4 className="text-blue-300 font-semibold mb-2 text-center">
            MOCO
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {instructionTemplates.map((template) => (
              <button
                key={`moco-${template.type}`}
                onClick={() => handleAddInstruction(template.type, 'MOCO')}
                className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                title={template.description}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* CHOCO */}
        <div className="bg-red-900/40 rounded-lg p-3">
          <h4 className="text-red-300 font-semibold mb-2 text-center">
            CHOCO
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {instructionTemplates.map((template) => (
              <button
                key={`choco-${template.type}`}
                onClick={() => handleAddInstruction(template.type, 'CHOCO')}
                className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                title={template.description}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
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
  const { removeInstruction, updateInstruction, playerInstructions } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  
  // Get all existing label names for validation
  const getExistingLabels = (): Set<string> => {
    const labels = new Set<string>();
    playerInstructions.forEach((inst) => {
      if (inst.type === 'LABEL' && 'labelName' in inst) {
        labels.add(inst.labelName);
      }
    });
    return labels;
  };
  
  const handleEdit = () => {
    if (instruction.type === 'SET_POINTER' && 'index' in instruction) {
      setEditValue(instruction.index.toString());
    } else if (instruction.type === 'LABEL' && 'labelName' in instruction) {
      setEditValue(instruction.labelName);
    } else if (
      (instruction.type === 'IF_GREATER' || 
       instruction.type === 'IF_LESS' || 
       instruction.type === 'IF_EQUAL' ||
       instruction.type === 'IF_END' ||
       instruction.type === 'IF_MEET' || 
       instruction.type === 'JUMP') &&
      'label' in instruction
    ) {
      setEditValue(instruction.label);
    } else {
      return; // No editable parameter
    }
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (!isEditing) return;
    
    let updatedInstruction: Instruction | null = null;
    
    if (instruction.type === 'SET_POINTER' && 'index' in instruction) {
      const index = parseInt(editValue, 10);
      if (!isNaN(index) && index >= 0) {
        updatedInstruction = {
          ...instruction,
          index,
        };
      }
    } else if (instruction.type === 'LABEL' && 'labelName' in instruction) {
      const labelName = editValue.trim();
      if (labelName.length > 0) {
        // Check for duplicates (excluding current instruction)
        const existingLabels = getExistingLabels();
        existingLabels.delete(instruction.labelName); // Remove current label from check
        if (!existingLabels.has(labelName)) {
          updatedInstruction = {
            ...instruction,
            labelName,
          };
        } else {
          alert(`Label "${labelName}" already exists!`);
          return;
        }
      }
    } else if (
      (instruction.type === 'IF_GREATER' || 
       instruction.type === 'IF_LESS' || 
       instruction.type === 'IF_EQUAL' ||
       instruction.type === 'IF_END' || 
       instruction.type === 'IF_MEET' ||
       instruction.type === 'JUMP') &&
      'label' in instruction
    ) {
      const label = editValue.trim();
      if (label.length > 0) {
        updatedInstruction = {
          ...instruction,
          label,
        };
      }
    }
    
    if (updatedInstruction) {
      updateInstruction(instruction.id, updatedInstruction);
    }
    
    setIsEditing(false);
    setEditValue('');
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };
  
  const formatInstruction = (inst: Instruction): string => {
    switch (inst.type) {
      case InstructionType.MOVE_LEFT:
        return 'MOVE_LEFT';
      case InstructionType.MOVE_RIGHT:
        return 'MOVE_RIGHT';
      case InstructionType.MOVE_TO_END:
        return 'MOVE_TO_END';
      case InstructionType.SET_POINTER:
        return `SET_POINTER ${inst.index}`;
      case InstructionType.PICK:
        return 'PICK';
      case InstructionType.PUT:
        return 'PUT';
      case InstructionType.IF_GREATER:
        return `IF_GREATER ${inst.label}`;
      case InstructionType.IF_LESS:
        return `IF_LESS ${inst.label}`;
      case InstructionType.IF_EQUAL:
        return `IF_EQUAL ${inst.label}`;
      case InstructionType.IF_END:
        return `IF_END ${inst.label}`;
      case InstructionType.IF_MEET:
        return `IF_MEET ${inst.label}`;
    
      case InstructionType.JUMP:
        return `JUMP ${inst.label}`;
      case InstructionType.LABEL:
        return `${inst.labelName}:`;
      case InstructionType.SWAP:
        return 'SWAP';
      case InstructionType.SWAP_WITH_NEXT:
        return 'SWAP_WITH_NEXT';
      case InstructionType.INCREMENT_VALUE:
        return 'INCREMENT_VALUE';
      case InstructionType.DECREMENT_VALUE:
        return 'DECREMENT_VALUE';
      case InstructionType.WAIT:
        return 'WAIT';
      default:
        return 'UNKNOWN';
    }
  };
  
  const hasEditableParameter = 
    instruction.type === 'SET_POINTER' ||
    instruction.type === 'LABEL' ||
    instruction.type === 'IF_GREATER' ||
    instruction.type === 'IF_LESS' ||
    instruction.type === 'IF_EQUAL' ||
    instruction.type === 'IF_END' ||
    instruction.type === 'IF_MEET' ||
    instruction.type === 'JUMP';
  
  if (isEditing && hasEditableParameter) {
    return (
      <div className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded text-sm">
        <span className="text-gray-400 w-6">{lineNumber + 1}</span>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-white font-mono">
            {instruction.type === 'SET_POINTER' ? 'SET_POINTER' :
             instruction.type === 'LABEL' ? '' :
             instruction.type}
          </span>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm font-mono"
            autoFocus
            placeholder={
              instruction.type === 'SET_POINTER' ? 'index' :
              instruction.type === 'LABEL' ? 'label name' :
              'label'
            }
          />
          <button
            onClick={handleSave}
            className="text-green-400 hover:text-green-300 text-xs"
            title="Save (Enter)"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-300 text-xs"
            title="Cancel (Esc)"
          >
            ×
          </button>
        </div>
      </div>
    );
  }
  const pointerColor = (inst: any) => {
    if (!('pointer' in inst)) return 'text-white';
    return inst.pointer === 'MOCO'
      ? 'text-blue-300'
      : 'text-red-300';
  };
  
  return (
    <div className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded text-sm group">
      <span className="text-gray-400 w-6">{lineNumber + 1}</span>
      <span
        className={`font-mono flex-1 ${pointerColor(instruction)} ${
          hasEditableParameter ? 'cursor-pointer hover:opacity-80' : ''
        }`}
        onClick={hasEditableParameter ? handleEdit : undefined}
      >
        {formatInstruction(instruction)}
      </span>

      <button
        onClick={() => removeInstruction(instruction.id)}
        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}