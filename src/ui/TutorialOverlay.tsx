import { useGameStore } from '../orchestrator/store';
import { useEffect, useRef } from 'react';
import { runExecution } from '../orchestrator/controller';

const STEPS = [
  {
    title: `Welcome aboard 👋`,
    text: 'Scroll ↓ to begin.',
  },
  
  {
    title: 'Decide what MOCO carries',
    text: 'Pick takes the number from the seat.',
  },
  {
    title: 'Where MOCO stands matters',
    text: 'Move MOCO between seats',
  },
  {
    title: 'Make the change',
    text: 'Put places the value into the current seat.',
  },
  {
    title: 'Watch what you created',
    text: 'Run or step through your orders.',
  },
];

export function TutorialOverlay() {
  const {
    isTutorialActive,
    tutorialStep,
    nextTutorialStep,
    endTutorial,
  } = useGameStore();

  const prevStepRef = useRef<number | null>(null);

  useEffect(() => {
    if (tutorialStep !== 0) return;

    const handleScroll = () => {
      nextTutorialStep();
    };

    window.addEventListener('scroll', handleScroll, { once: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [tutorialStep, nextTutorialStep]);

  useEffect(() => {
  
    if (
      isTutorialActive &&
      tutorialStep >= 2 &&
      tutorialStep <= 3
    ) {
      runExecution(500); // 🚀 auto-run
    }
  
    prevStepRef.current = tutorialStep;
  }, [tutorialStep, isTutorialActive]);

  if (!isTutorialActive) return null;

  const step = STEPS[Math.min(tutorialStep, STEPS.length - 1)];

  const isBlocking = tutorialStep === 0;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isBlocking ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
      }`}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Coach box */}
      
      <div
        className={`absolute bottom-64 right-4 ring-2 ring-yellow-400 bg-gray-900 text-white rounded-lg p-4 max-w-sm shadow-xl pointer-events-auto
          ${tutorialStep === 0 ? 'animate-pulse duration-[4s]' : ''}`}
      >
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
