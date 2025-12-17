/**
 * Execution timeline visualization
 * Shows current instruction and step count
 */

import { motion } from 'framer-motion';
import type { Instruction } from '../engine/instructions/types';

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
    case 'LOAD':
      return `LOAD [${instruction.index}]`;
    case 'STORE':
      return `STORE [${instruction.index}]`;
    case 'MOVE_POINTER':
      return `MOVE ${instruction.pointerId} ${instruction.offset > 0 ? '+' : ''}${instruction.offset}`;
    case 'COMPARE':
      return `COMPARE [${instruction.leftIndex}] vs [${instruction.rightIndex}]`;
    case 'JUMP_IF':
      return `JUMP_IF ${instruction.condition} → line ${instruction.targetLine + 1}`;
    case 'JUMP':
      return `JUMP → line ${instruction.targetLine + 1}`;
    case 'INCREMENT':
      return `INCREMENT [${instruction.index}]`;
    case 'DECREMENT':
      return `DECREMENT [${instruction.index}]`;
    case 'NOOP':
      return 'NOOP';
    default:
      return 'UNKNOWN';
  }
}

