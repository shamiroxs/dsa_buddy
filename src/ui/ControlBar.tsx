/**
 * Control bar for execution controls
 * Step, Run, Pause, Rewind, Reset
 */

import {
  executeSingleStep,
  runExecution,
  pauseExecution,
  rewindSingleStep,
  resetExecution,
} from '../orchestrator/controller';
import { useGameStore } from '../orchestrator/store';
import { useIsExecuting, useIsPaused } from '../orchestrator/selectors';

export function ControlBar() {
  const isExecuting = useIsExecuting();
  const isPaused = useIsPaused();
  const { isTutorialActive, tutorialStep, endTutorial } = useGameStore();

  const highlightRun =
    isTutorialActive && tutorialStep === 4;

  
  return (
    <div className="control-bar bg-gray-800 rounded-lg p-3 flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={() => {
          if (isTutorialActive && tutorialStep === 4) {
            endTutorial();
          }
          executeSingleStep();
        }}
        disabled={isExecuting && !isPaused}
        className={`
          bg-blue-600 hover:bg-blue-700
          disabled:bg-gray-600 disabled:cursor-not-allowed
          text-white px-4 py-2 rounded font-semibold
          ${highlightRun ? 'ring-2 ring-green-400 animate-pulse' : ''}
        `}
      >
        ▶ Step
      </button>

      
      {!isExecuting || isPaused ? (
        <button
        onClick={() => {
          if (isTutorialActive && tutorialStep === 4) {
            endTutorial();
          }
          runExecution(500);
        }}
        className={`
          bg-green-600 hover:bg-green-700
          text-white px-4 py-2 rounded font-semibold
          ${highlightRun ? 'ring-2 ring-green-400 animate-pulse' : ''}
        `}
      >
        ⏩ Run
      </button>
      
      ) : (
        <button
          onClick={pauseExecution}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold text-sm sm:text-base"
        >
          ⏸ Pause
        </button>
      )}
      
      <button
        onClick={rewindSingleStep}
        disabled={isExecuting && !isPaused}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold text-sm sm:text-base"
      >
        ⏪ Rewind
      </button>
      
      <button
        onClick={resetExecution}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm sm:text-base"
      >
        ↺ Reset
      </button>
    </div>
  );
}

