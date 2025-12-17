/**
 * Main game view
 * Combines all UI components
 */

import { useCurrentChallenge, usePlayerInstructions, useExecutionError } from '../orchestrator/selectors';
import { useGameStore } from '../orchestrator/store';
import { ChallengePanel } from '../ui/ChallengePanel';
import { InstructionPalette } from '../ui/InstructionPalette';
import { ControlBar } from '../ui/ControlBar';
import { ArrayView } from '../renderer/ArrayView';
import { PointerView } from '../renderer/PointerView';
import { ExecutionTimeline } from '../renderer/ExecutionTimeline';
import { useArrayState, usePointers, useCurrentLine, useStepCount, useCurrentInstruction } from '../orchestrator/selectors';
import { motion } from 'framer-motion';

export function GameView() {
  const challenge = useCurrentChallenge();
  const { setCurrentChallenge } = useGameStore();
  const playerInstructions = usePlayerInstructions();
  const array = useArrayState();
  const pointers = usePointers();
  const currentLine = useCurrentLine();
  const stepCount = useStepCount();
  const currentInstruction = useCurrentInstruction();
  const executionError = useExecutionError();
  
  if (!challenge) {
    return null;
  }
  
  const totalLines = playerInstructions.length || 0;
  
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentChallenge(null)}
              className="text-gray-400 hover:text-white mb-2"
            >
              ← Back to Challenges
            </button>
            <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
          </div>
        </div>
        
        {/* Error Display */}
        {executionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-900/30 border border-red-500 rounded-lg p-3"
          >
            <div className="text-red-300 font-semibold">Execution Error</div>
            <div className="text-red-200 text-sm mt-1">{executionError}</div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Challenge Info */}
          <div className="lg:col-span-1">
            <ChallengePanel />
          </div>
          
          {/* Middle Column: Visualization */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Visualization</h3>
              
              {/* Pointers */}
              {Object.keys(pointers).length > 0 && (
                <div className="mb-4">
                  <PointerView
                    pointers={pointers}
                    arrayLength={array.length}
                  />
                </div>
              )}
              
              {/* Array */}
              <div className="mb-4 flex justify-center">
                <ArrayView array={array} />
              </div>
              
              {/* Execution Timeline */}
              <ExecutionTimeline
                currentLine={currentLine}
                totalLines={totalLines}
                stepCount={stepCount}
                currentInstruction={currentInstruction}
              />
            </div>
          </div>
          
          {/* Right Column: Instructions & Controls */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <InstructionPalette />
              <ControlBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

