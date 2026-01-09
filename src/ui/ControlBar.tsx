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
import {
  useTutorialHighlight,
  useTutorialCompletesOn,
  useIsTutorialActive,
} from '../tutorial/selectors';

export function ControlBar() {
  const isExecuting = useIsExecuting();
  const isPaused = useIsPaused();
  const { endTutorial } = useGameStore();
  const {
    maybeCompleteTutorial,
    dismissSuccessHint,
  } = useGameStore();

  const isActive = useIsTutorialActive();
  const validationResult = useGameStore((s) => s.validationResult);
  const successHintDismissed = useGameStore((s) => s.successHintDismissed);

  const highlightRewind =
    validationResult?.success && !successHintDismissed;

  const highlightRun = useTutorialHighlight(
    'CONTROL_BAR',
    { control: 'RUN' }
  ) && isActive;
  
  const completesOnRun =
    useTutorialCompletesOn('RUN_CLICK');

  const onAnyControlClick = () => {
    if (validationResult?.success) {
      dismissSuccessHint();
    }
  };

  const onStep = () => {
    onAnyControlClick();
    executeSingleStep();
    endTutorial
  };

  const onRun = () => {
    onAnyControlClick();
    runExecution(500);

    if (completesOnRun) {
      maybeCompleteTutorial('RUN_CLICK');
      endTutorial
    }
  };

  const onPause = () => {
    onAnyControlClick();
    pauseExecution();
  };

  const onRewind = () => {
    onAnyControlClick();
    rewindSingleStep();
  };

  const onReset = () => {
    onAnyControlClick();
    resetExecution();
  };

  return (
    <div className="control-bar bg-gray-800 rounded-lg p-3 flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={onStep}
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
        onClick={onRun}
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
          onClick={onPause}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold text-sm sm:text-base"
        >
          ⏸ Pause
        </button>
      )}
      
      <button
        onClick={onRewind}
        disabled={isExecuting && !isPaused}
        className={`
          bg-purple-600 hover:bg-purple-700
          disabled:bg-gray-600 disabled:cursor-not-allowed
          text-white px-4 py-2 rounded font-semibold
          text-sm sm:text-base
          ${highlightRewind ? 'ring-2 ring-green-400 animate-pulse' : ''}
        `}
      >
        ⏪ Rewind
      </button>

      
      <button
        onClick={onReset}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm sm:text-base"
      >
        ↺ Reset
      </button>
    </div>
  );
}

