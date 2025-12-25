/**
 * Instruction palette for building programs
 * Drag-and-drop or click-to-add interface
 */


import { useState } from 'react';
import { useRef, useLayoutEffect, useMemo } from 'react';
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

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';


//const pointer: 'MOCO' | 'CHOCO' = 'MOCO';
//const POINTERS: Array<'MOCO' | 'CHOCO'> = ['MOCO', 'CHOCO'];

type DragItem =
  | { source: 'PALETTE'; instructionType: InstructionType; pointer: 'MOCO' | 'CHOCO'; isGlobal?: boolean; }
  | { source: 'PROGRAM'; instructionId: string };

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

const globalInstructionTypes: InstructionType[] = [
  InstructionType.SWAP,
  InstructionType.IF_MEET,
  InstructionType.JUMP,
  InstructionType.LABEL,
  InstructionType.WAIT,
];

const OWNER_STYLE_MAP = {
  MOCO: {
    bg: 'bg-blue-700',
    border: 'border-blue-400',
    text: 'text-white',
  },
  CHOCO: {
    bg: 'bg-red-700',
    border: 'border-red-400',
    text: 'text-white',
  },
  BOTH: {
    bg: 'bg-purple-700',
    border: 'border-purple-400',
    text: 'text-white',
  },
} as const;


export function InstructionPalette() {
  const { playerInstructions, addInstruction, clearPlayerInstructions, executionState } = useGameStore();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,      // 👈 critical for mobile
        tolerance: 5,
      },
    })
  );
  
  
  const { reorderInstructions, removeInstruction } = useGameStore();
  const { currentChallenge } = useGameStore();

  const capabilities = currentChallenge?.capabilities;
  const allowedPointers = capabilities?.allowedPointers ?? ['MOCO', 'CHOCO'];
  const allowedInstructions = new Set(
    capabilities?.allowedInstructions ?? Object.values(InstructionType)
  );

  const pointerInstructionTemplates = instructionTemplates.filter(
    (t) =>
      !globalInstructionTypes.includes(t.type) &&
      allowedInstructions.has(t.type)
  );

  const globalInstructionTemplates = instructionTemplates.filter(
    (t) =>
      globalInstructionTypes.includes(t.type) &&
      allowedInstructions.has(t.type)
  );


  const programContainerRef = useRef<HTMLDivElement | null>(null);

  // instruction.id → DOMRect
  const instructionRects = useRef<Map<string, DOMRect>>(new Map());

  
  const currentLine = executionState?.currentLine ?? null;
  
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
    if (!allowedInstructions.has(type)) return;
    
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
  const [activeDragItem, setActiveDragItem] = useState<DragItem | null>(null);

  function ProgramDropzone({ children }: { children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({
      id: 'PROGRAM_DROPZONE',
    });
  
    return (
      <div
        ref={setNodeRef}
        className={`space-y-1 flex-1 overflow-y-auto rounded p-1 scrollbar-transparent ${
          isOver ? 'ring-2 ring-green-400' : ''
        }`}
      >
        {children}
      </div>
    );
  }
  
  type InstructionOwner = 'MOCO' | 'CHOCO' | 'BOTH';

  function getInstructionOwner(inst: Instruction): InstructionOwner {
    // Global instructions (no target)
    if (!('target' in inst) || inst.target === undefined) {
      return 'BOTH';
    }

    // Pointer-based instructions
    return inst.target;
  }
  
  function getInstructionStyle(inst: Instruction) {
    const owner = getInstructionOwner(inst);
    return OWNER_STYLE_MAP[owner];
  }
  
  
  function DraggablePaletteItem({
    template,
    pointer,
    isGlobal = false,
  }: {
    template: { type: InstructionType; label: string; description: string };
    pointer: 'MOCO' | 'CHOCO';
    isGlobal?: boolean;
  }) {
    const { isTutorialActive, tutorialStep } = useGameStore();

    const shouldPulse =
      isTutorialActive &&
      (
        (tutorialStep === 1 && template.type === InstructionType.PICK) ||
        (tutorialStep === 2 && template.type === InstructionType.MOVE_RIGHT) ||
        (tutorialStep === 3 && template.type === InstructionType.PUT)
      );

    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: `palette-${pointer}-${template.type}`,
        data: {
          source: 'PALETTE',
          instructionType: template.type,
          pointer,
          isGlobal,
        } satisfies DragItem,
      });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    // Set button color based on pointer
    const buttonClass = isGlobal
      ? 'bg-purple-700 hover:bg-purple-600 text-white'
      : pointer === 'MOCO'
      ? 'bg-blue-700 hover:bg-blue-600 text-white'
      : 'bg-red-700 hover:bg-red-600 text-white';

    return (
      <button
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        onClick={() => handleAddInstruction(template.type, pointer)}
        className={`${buttonClass} 
          ${shouldPulse ? 'animate-pulse ring-2 ring-yellow-400' : ''}
          px-3 py-2 rounded text-sm transition-colors select-none touch-none`
        }
        title={template.description}
      >
        {template.label}
      </button>
    );
  }
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
  
  function FlowchartBlock({
    instruction,
    onEdit,
  }: {
    instruction: Instruction;
    lineNumber: number;
    onEdit?: () => void; // optional click handler for editing
  }) {
    //const { removeInstruction } = useGameStore();
    const style = getInstructionStyle(instruction);
  
    const hasEditableParameter =
      instruction.type === InstructionType.SET_POINTER ||
      instruction.type === InstructionType.LABEL ||
      instruction.type === InstructionType.IF_GREATER ||
      instruction.type === InstructionType.IF_LESS ||
      instruction.type === InstructionType.IF_EQUAL ||
      instruction.type === InstructionType.IF_END ||
      instruction.type === InstructionType.IF_MEET ||
      instruction.type === InstructionType.JUMP;
  
    return (
      <div
        className={`
          relative
          max-w-sm
          flex items-center justify-between
          px-5 py-0.5
          rounded-lg
          border
          shadow-md
          transition
          ${style.bg}
          ${style.border}
          ${style.text}
          font-mono
          text-sm
          group
          select-none
          touch-none
        `}
      >  
        {/* Instruction text */}
        <div
          className={`
            flex-1
            text-center
            select-none
            ${hasEditableParameter ? 'cursor-pointer hover:opacity-90' : ''}
          `}
          onClick={hasEditableParameter ? onEdit : undefined}
          title={hasEditableParameter ? 'Click to edit' : undefined}
        >
          {formatInstruction(instruction)}
        </div>
      </div>
    );
  }

  const labelMap = useMemo(() => {
    const map = new Map<string, Instruction>();
    playerInstructions.forEach((inst) => {
      if (inst.type === InstructionType.LABEL && 'labelName' in inst) {
        map.set(inst.labelName, inst);
      }
    });
    return map;
  }, [playerInstructions]);

  const arrows = useMemo(() => {
    const results: Array<{
      from: Instruction;
      to: Instruction;
      color: string;
    }> = [];
  
    for (const inst of playerInstructions) {
      if (!('label' in inst)) continue;
      const target = labelMap.get(inst.label);
      if (!target) continue;
  
      const owner = getInstructionOwner(inst);
      const color =
        owner === 'MOCO'
          ? '#3b82f6'
          : owner === 'CHOCO'
          ? '#ef4444'
          : '#a855f7';
  
      results.push({ from: inst, to: target, color });
    }
  
    return results;
  }, [playerInstructions, labelMap]);
  
  const instructionTransforms = useRef<
    Map<string, { x: number; y: number }>
  >(new Map());


  function SortableInstructionLine({
    instruction,
    index,
    isActive,
  }: {
    instruction: Instruction;
    index: number;
    isActive: boolean;
  }) {
    const rowRef = useRef<HTMLDivElement | null>(null);

    const { updateInstruction, playerInstructions } = useGameStore();
  
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: instruction.id,
        data: {
          source: 'PROGRAM',
          instructionId: instruction.id,
        } satisfies DragItem,
      });
      useLayoutEffect(() => { 
        if (!rowRef.current) return; 
        const rect = rowRef.current.getBoundingClientRect(); 
        instructionRects.current.set(instruction.id, rect); 

        return () => { 
          instructionRects.current.delete(instruction.id); 
        }; 
      
      }, [instruction.id, transform]);

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
  
    const hasEditableParameter =
      instruction.type === InstructionType.SET_POINTER ||
      instruction.type === InstructionType.LABEL ||
      instruction.type === InstructionType.IF_GREATER ||
      instruction.type === InstructionType.IF_LESS ||
      instruction.type === InstructionType.IF_EQUAL ||
      instruction.type === InstructionType.IF_END ||
      instruction.type === InstructionType.IF_MEET ||
      instruction.type === InstructionType.JUMP;
  
    const handleEdit = () => {
      if (instruction.type === InstructionType.SET_POINTER && 'index' in instruction) {
        setEditValue(instruction.index.toString());
      } else if (instruction.type === InstructionType.LABEL && 'labelName' in instruction) {
        setEditValue(instruction.labelName);
      } else if ('label' in instruction) {
        setEditValue(instruction.label);
      } else {
        return;
      }
      setIsEditing(true);
    };
  
    const handleSave = () => {
      let updatedInstruction: Instruction | null = null;
  
      if (instruction.type === InstructionType.SET_POINTER && 'index' in instruction) {
        const indexValue = parseInt(editValue, 10);
        if (!isNaN(indexValue) && indexValue >= 0) {
          updatedInstruction = { ...instruction, index: indexValue };
        }
      } else if (instruction.type === InstructionType.LABEL && 'labelName' in instruction) {
        const labelName = editValue.trim();
        if (labelName.length > 0) {
          const existingLabels = new Set(
            playerInstructions
              .filter((i) => i.type === InstructionType.LABEL)
              .map((i: any) => i.labelName)
          );
          existingLabels.delete(instruction.labelName);
          if (!existingLabels.has(labelName)) {
            updatedInstruction = { ...instruction, labelName };
          } else {
            alert(`Label "${labelName}" already exists`);
            return;
          }
        }
      } else if ('label' in instruction) {
        const label = editValue.trim();
        if (label.length > 0) {
          updatedInstruction = { ...instruction, label };
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

    return (
      <div
        id={instruction.id}
        ref={(node) => {
          setNodeRef(node);
          rowRef.current = node;
        }}

        style={style}
        {...attributes}
        {...listeners}
        className="flex justify-center"
      >
        <div className="flex flex-col items-center">
    
          {/* Instruction row (arrow is positioned relative to THIS only) */}
          <div className="relative flex justify-center">
            {isActive && (
              <span
                className="
                  absolute
                  -left-2
                  -translate-x-full
                  top-1/2
                  -translate-y-1/2
                  text-green-400
                  text-lg
                  select-none
                "
              >
                ▶
              </span>
            )}
    
            {isEditing && hasEditableParameter ? (
              <div className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded text-sm w-full max-w-sm">
                <span className="text-gray-400 w-6">{index + 1}</span>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                  className="flex-1 bg-gray-600 text-white px-2 py-1 rounded font-mono"
                />
                <button
                  onClick={handleSave}
                  className="text-green-400 hover:text-green-300 text-xs"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-300 text-xs"
                >
                  ×
                </button>
              </div>
            ) : (
              <FlowchartBlock
                instruction={instruction}
                lineNumber={index}
                onEdit={hasEditableParameter ? handleEdit : undefined}
              />
            )}
          </div>
    
          {/* Down arrow (separate row, NOT affecting centering) */}
          {index < playerInstructions.length - 1 && (
            <div className="text-gray-400 text-sm leading-none mt-0.5 select-none">
              ↓
            </div>
          )}
        </div>
      </div>
    );  
      
  }
  
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeData = active.data.current as DragItem;
    const overData = over?.data.current as DragItem | undefined;
  
    // PROGRAM instruction handling
    if (activeData?.source === 'PROGRAM') {
      const droppedInProgram =
        over?.id === 'PROGRAM_DROPZONE' ||
        overData?.source === 'PROGRAM';
  
      // Delete only if dropped outside program
      if (!droppedInProgram) {
        removeInstruction(activeData.instructionId);
        return;
      }
    }
  
    // Reorder inside program
    if (
      activeData?.source === 'PROGRAM' &&
      overData?.source === 'PROGRAM'
    ) {
      const from = playerInstructions.findIndex(i => i.id === activeData.instructionId);
      const to = playerInstructions.findIndex(i => i.id === overData.instructionId);
      if (from !== to) reorderInstructions(from, to);
      return;
    }
  
    // Palette → Program
    if (
      activeData?.source === 'PALETTE' &&
      (over?.id === 'PROGRAM_DROPZONE' ||
        overData?.source === 'PROGRAM')
    ) {
      handleAddInstruction(activeData.instructionType, activeData.pointer);
    }
  };
  
  function PaletteDragPreview({
    instructionType,
    pointer,
    isGlobal,
  }: {
    instructionType: InstructionType;
    pointer: 'MOCO' | 'CHOCO';
    isGlobal?: boolean;
  }) {
    const template = instructionTemplates.find(
      (t) => t.type === instructionType
    );
  
    if (!template) return null;
  
    const buttonClass = isGlobal
      ? 'bg-purple-700 text-white'
      : pointer === 'MOCO'
      ? 'bg-blue-700 text-white'
      : 'bg-red-700 text-white';

    return (
      <div
        className={`${buttonClass} px-3 py-2 rounded text-sm shadow-lg`}
      >
        {template.label}
      </div>
    );
  }

  const getVisualRect = (id: string) => {
    const rect = instructionRects.current.get(id);
    if (!rect) return null;
  
    const t = instructionTransforms.current.get(id);
    if (!t) return rect;
  
    return {
      ...rect,
      top: rect.top + t.y,
      bottom: rect.bottom + t.y,
      left: rect.left + t.x,
      right: rect.right + t.x,
    };
  };
  
  function ProgramArrowsOverlay() {
    const container = programContainerRef.current;
    if (!container) return null;
    
  
    const containerRect = container.getBoundingClientRect();
    const laneX = containerRect.width < 360
      ? containerRect.width * 0.82
      : containerRect.width * 0.9;

    return (
      <svg
        className="absolute top-0 left-8 w-full h-full pointer-events-none"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="3.5"
            refY="2"
            orient="auto"
          >
            <path d="M0,0 L0,4 L4,2 z" fill="currentColor" />
          </marker>
        </defs>
  
        {arrows.map(({ from, to, color }) => {
          const fromRect = getVisualRect(from.id);
          const toRect = getVisualRect(to.id);          
          if (!fromRect || !toRect) return null;
  
          const startX = fromRect.right - containerRect.left * 4.5;
          const startY = fromRect.top + fromRect.height / 3 - containerRect.top;
  
          const endX = toRect.right - containerRect.left * 5;
          const endY = toRect.top + toRect.height / 3 - containerRect.top;
  
          const d = `
            M ${startX} ${startY}
            C ${laneX} ${startY},
              ${laneX} ${endY},
              ${endX} ${endY}
          `;
  
          return (
            <path
              key={`${from.id}->${to.id}`}
              d={d}
              stroke={color}
              strokeWidth={4}
              fill="none"
              markerEnd="url(#arrowhead)"
              opacity={0.7}
            />
          );
        })}
      </svg>
    );
  }
  
  
  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        setActiveDragItem(event.active.data.current as DragItem);
      }}
      onDragEnd={(event) => {
        handleDragEnd(event);
        setActiveDragItem(null);
      }}
      onDragCancel={() => {
        setActiveDragItem(null);
      }}
    >
      <div className="instruction-palette bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Instructions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Current program */}
          <div
            ref={programContainerRef}
            className="w-full lg:w-1/2 mt-4 flex flex-col min-h-0 max-h-[126vh] relative"
          >

            <div className="flex items-center mb-2">
              <button
                onClick={() => {
                  if (playerInstructions.length === 0) return;
                  clearPlayerInstructions();
                }}
                title="Clear program"
                className="
                  text-gray-400
                  hover:text-red-400
                  transition
                  text-xl
                  leading-none
                "
              >
                ⟲
              </button>

              <h4 className="text-gray-400 text-sm mx-auto">Your Program</h4>
            </div>
            <ProgramArrowsOverlay />
            <ProgramDropzone>
            <SortableContext
              items={playerInstructions.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              

                {playerInstructions.length === 0 ? (
                  <div className="text-gray-500 text-sm italic">
                    No instructions yet
                  </div>
                ) : (
                  playerInstructions.map((inst, idx) => (
                    <SortableInstructionLine
                      key={inst.id}
                      instruction={inst}
                      index={idx}
                      isActive={currentLine === idx}
                    />
                  ))
                )}
              

            </SortableContext>
            </ProgramDropzone>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Global Instructions */}
            {globalInstructionTemplates.length > 0 && (
            <div className="flex justify-center">
              <div className="bg-gray-700/60 rounded-lg p-3 w-full max-w-md">
                <h4 className="text-gray-300 font-semibold mb-2 text-center">
                  BOTH
                </h4>

                <SortableContext
                  items={globalInstructionTemplates.map(
                    (t) => `palette-MOCO-${t.type}`
                  )}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-2 gap-2 justify-center">
                    {globalInstructionTemplates.map((template) => (
                      <DraggablePaletteItem
                        key={`global-${template.type}`}
                        template={template}
                        pointer="MOCO"
                        isGlobal
                      />
                    ))}
                  </div>
                </SortableContext>

              </div>
            </div>
            )}

            {/* MOCO */}
            {allowedPointers.includes('MOCO') && (
            <div className="bg-gray-700/60 rounded-lg p-3 w-full max-w-md">
              <h4 className="text-blue-300 font-semibold mb-2 text-center">
                MOCO
              </h4>

              <SortableContext
                items={pointerInstructionTemplates.map(
                  (t) => `palette-MOCO-${t.type}`
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-2">
                  {pointerInstructionTemplates.map((template) => (
                    <DraggablePaletteItem
                      key={`moco-${template.type}`}
                      template={template}
                      pointer="MOCO"
                    />
                  ))}
                </div>
              </SortableContext>

            </div>
            )}

            {/* CHOCO */}
            {allowedPointers.includes('CHOCO') && (
            <div className="bg-gray-700/60 rounded-lg p-3 w-full max-w-md">
              <h4 className="text-red-300 font-semibold mb-2 text-center">
                CHOCO
              </h4>

              <SortableContext
                items={pointerInstructionTemplates.map(
                  (t) => `palette-CHOCO-${t.type}`
                )}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-2">
                  {pointerInstructionTemplates.map((template) => (
                    <DraggablePaletteItem
                      key={`choco-${template.type}`}
                      template={template}
                      pointer="CHOCO"
                    />
                  ))}
                </div>
              </SortableContext>

            </div>
            )}
          </div>
          

        </div>

        
        
      </div>
      <DragOverlay>
        {activeDragItem?.source === 'PALETTE' ? (
          <div className="pointer-events-none">
            <PaletteDragPreview
              instructionType={activeDragItem.instructionType}
              pointer={activeDragItem.pointer}
              isGlobal={activeDragItem.isGlobal}
            />
          </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
}

