/**
 * Main game view
 * Combines all UI components
 * Supports dual pointers (MOCO / CHOCO)
 */

import { motion } from 'framer-motion';

import {
  useCurrentChallenge,
  usePlayerInstructions,
  useExecutionError,
  useArrayState,
  useMocoPointer,
  useChocoPointer,
  useHand,
  useCurrentLine,
  useStepCount,
  useCurrentInstruction,
} from '../orchestrator/selectors';

import { useGameStore } from '../orchestrator/store';

import { ChallengePanel } from '../ui/ChallengePanel';
import { InstructionPalette } from '../ui/InstructionPalette';
import { TutorialOverlay } from '../ui/TutorialOverlay';
import { ControlBar } from '../ui/ControlBar';

import { ArrayView } from '../renderer/ArrayView';
import { PointerView } from '../renderer/PointerView';
import { ExecutionTimeline } from '../renderer/ExecutionTimeline';

export function GameView() {
  const challenge = useCurrentChallenge();
  if (!challenge) return;
  const allowedPointers = challenge.capabilities.allowedPointers;

  const showMoco = allowedPointers.includes('MOCO');
  const showChoco = allowedPointers.includes('CHOCO');

  const { setCurrentChallenge } = useGameStore();

  const instructions = usePlayerInstructions();
  const executionError = useExecutionError();

  const array = useArrayState();
  const rawMocoPointer = useMocoPointer();
  const rawChocoPointer = useChocoPointer();
  
  const mocoPointer = showMoco ? rawMocoPointer : undefined;
  const chocoPointer = showChoco ? rawChocoPointer : undefined;
  

  const hand = useHand();
  const currentLine = useCurrentLine();
  const stepCount = useStepCount();
  const currentInstruction = useCurrentInstruction();

  if (!challenge) return null;

  const totalLines = instructions.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentChallenge(null)}
              className="text-gray-400 hover:text-white mb-2"
            >
              ← Back to Challenges
            </button>
            <h1 className="text-2xl font-bold text-white">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {executionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-900/30 border border-red-500 rounded-lg p-3"
          >
            <div className="text-red-300 font-semibold">
              Execution Error
            </div>
            <div className="text-red-200 text-sm mt-1">
              {executionError}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4">

          {/* ================= LEFT ================= */}
          <div className="lg:col-span-1">
            <ChallengePanel />
          </div>

          {/* ================= CENTER ================= */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">
                Visualization
              </h3>

              {/* Hand */}
              {hand !== null && (
                <div className="mb-4 bg-blue-900/30 border border-blue-500 rounded p-3">
                  <div className="text-xs text-blue-300 mb-1">
                    Hand
                  </div>
                  <div className="text-white font-mono text-lg font-bold">
                    {hand}
                  </div>
                </div>
              )}

              {/* Pointers */}
              {array.length > 0 && (
                <div className="mb-4">
                  <PointerView
                    arrayLength={array.length}
                    mocoPointer={mocoPointer}
                    chocoPointer={chocoPointer}
                  />
                </div>
              )}


              {/* Array */}
              <div className="mb-4 flex justify-center">
              <ArrayView
                array={array}
                mocoPointer={mocoPointer}
                chocoPointer={chocoPointer}
              />

              </div>

              {/* Timeline */}
              <ExecutionTimeline
                currentLine={currentLine}
                totalLines={totalLines}
                stepCount={stepCount}
                currentInstruction={currentInstruction}
              />
            <ControlBar />
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <TutorialOverlay />
              <InstructionPalette />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
