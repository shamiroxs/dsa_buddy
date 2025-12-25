import { useGameStore } from '../orchestrator/store';

const STEPS = [
  {
    title: 'Welcome 👋',
    text: 'Scroll down ↓',
  },
  
  {
    title: 'Step 1: PICK',
    text: 'Click PICK to grab the number under MOCO.',
  },
  {
    title: 'Step 2: MOVE',
    text: 'Click MOVE_RIGHT to move MOCO.',
  },
  {
    title: 'Step 3: PUT',
    text: 'Click PUT to place the number.',
  },
  {
    title: 'Step 4: Run',
    text: 'Click Run/Step to vitualize.',
  },
];

export function TutorialOverlay() {
  const {
    isTutorialActive,
    tutorialStep,
    nextTutorialStep,
    endTutorial,
  } = useGameStore();

  if (!isTutorialActive) return null;

  const step = STEPS[Math.min(tutorialStep, STEPS.length - 1)];

  const handleClickAnywhere = (e: React.PointerEvent) => {
    if (tutorialStep !== 0) return;
  
    // Only accept direct taps, not drag/scroll
    if (e.pointerType === 'touch' && e.movementX === 0 && e.movementY === 0) {
      nextTutorialStep();
    }
  
    // Mouse click (desktop)
    if (e.pointerType === 'mouse') {
      nextTutorialStep();
    }
  };
  

  const isBlocking = tutorialStep === 0;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isBlocking ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
      }`}
      onPointerUp={handleClickAnywhere}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/5" />

      {/* Coach box */}
      <div className="absolute top-4 right-4 bg-gray-800 text-white rounded-lg p-4 max-w-sm shadow-xl pointer-events-auto">
        <h4 className="font-semibold mb-1">{step.title}</h4>
        <p className="text-sm text-gray-300">{step.text}</p>

        <button
          onClick={endTutorial}
          className="mt-3 text-xs text-gray-400 hover:text-white"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
