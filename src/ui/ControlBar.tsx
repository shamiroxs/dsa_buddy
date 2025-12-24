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
import { useIsExecuting, useIsPaused } from '../orchestrator/selectors';

export function ControlBar() {
  const isExecuting = useIsExecuting();
  const isPaused = useIsPaused();
  
  return (
    <div className="control-bar bg-gray-800 rounded-lg p-3 sm:p-4 flex flex-row items-stretch sm:items-center justify-center gap-3">
      <button
        onClick={executeSingleStep}
        disabled={isExecuting && !isPaused}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold"
      >
        ▶ Step
      </button>
      
      {!isExecuting || isPaused ? (
        <button
          onClick={() => runExecution(500)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          ⏩ Run
        </button>
      ) : (
        <button
          onClick={pauseExecution}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold"
        >
          ⏸ Pause
        </button>
      )}
      
      <button
        onClick={rewindSingleStep}
        disabled={isExecuting && !isPaused}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded font-semibold"
      >
        ⏪ Rewind
      </button>
      
      <button
        onClick={resetExecution}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
      >
        ↺ Reset
      </button>
    </div>
  );
}

