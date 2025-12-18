/**
 * Execution timeline visualization
 * Shows current instruction and step count
 */

import { motion } from 'framer-motion';
import type { Instruction } from '../engine/instructions/types';
import { InstructionType } from '../engine/instructions/types';

interface ExecutionTimelineProps {
  currentLine: number;
  totalLines: number;
  stepCount: number;
  currentInstruction: Instruction | null;
}

export function ExecutionTimeline({
  currentLine,
  totalLines,
  stepCount,
  currentInstruction,
}: ExecutionTimelineProps) {
  return (
    <div className="execution-timeline bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-400">
          Step: <span className="text-white font-semibold">{stepCount}</span>
        </div>
        <div className="text-sm text-gray-400">
          Line: <span className="text-white font-semibold">{currentLine + 1}</span> / {totalLines}
        </div>
      </div>
      
      {currentInstruction && (
        <motion.div
          className="bg-blue-900/30 border border-blue-500 rounded p-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs text-blue-300 mb-1">Current Instruction</div>
          <div className="text-white font-mono text-sm">
            {formatInstruction(currentInstruction)}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function formatInstruction(instruction: Instruction): string {
  switch (instruction.type) {
    case InstructionType.MOVE_LEFT:
      return 'MOVE_LEFT';
    case InstructionType.MOVE_RIGHT:
      return 'MOVE_RIGHT';
    case InstructionType.SET_POINTER:
      return `SET_POINTER ${instruction.index}`;
    case InstructionType.PICK:
      return 'PICK';
    case InstructionType.PUT:
      return 'PUT';
    case InstructionType.IF_GREATER:
      return `IF_GREATER ${instruction.label}`;
    case InstructionType.IF_LESS:
      return `IF_LESS ${instruction.label}`;
    case InstructionType.IF_EQUAL:
      return `IF_EQUAL ${instruction.label}`;
    case InstructionType.JUMP:
      return `JUMP ${instruction.label}`;
    case InstructionType.LABEL:
      return `${instruction.labelName}:`;
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
}
