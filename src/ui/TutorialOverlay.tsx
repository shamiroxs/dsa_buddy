import { useGameStore } from '../orchestrator/store';
import { useEffect, useRef, useState } from 'react';
import { runExecution } from '../orchestrator/controller';

import {
  useIsTutorialActive,
  useTutorialStepContent,
  useTutorialBlocksUI,
} from '../tutorial/selectors';

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
  
  const isTutorialActive = useIsTutorialActive();
  const step = useTutorialStepContent();
  const blocksUI = useTutorialBlocksUI();
  const {
    maybeCompleteTutorial, 
    endTutorial,
  } = useGameStore();

  const [isBottom, setIsBottom] = useState(true);
  const scrollHandledRef = useRef(false);

  useEffect(() => {
    if (!isTutorialActive || !blocksUI) return;

    const handleScroll = () => {
      if (scrollHandledRef.current) return;
      scrollHandledRef.current = true;
      maybeCompleteTutorial('SCROLL');
    };

    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTutorialActive, blocksUI, maybeCompleteTutorial]);
  /*
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
  */

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportMiddle = window.innerHeight / 2;

      // No scroll OR above middle → bottom
      if (scrollY === 0 || scrollY <= viewportMiddle) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    handleScroll(); // run once on mount (handles "no scroll")

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isTutorialActive) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        blocksUI ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
      }`}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Coach box */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 right-0
          pointer-events-auto
          bg-gray-900/90 backdrop-blur-md
          ring-1 ring-yellow-400/40
          px-6 py-4
          flex items-center justify-between
          rounded-xl
          shadow-2xl
          animate-in fade-in slide-in-from-bottom-4 duration-300
          ${isBottom ? 'bottom-6 border-t' : 'top-6 border-b'}
          ${blocksUI ? 'animate-pulse duration-[6s]' : ''}
        `}
      >
        {/* Speaker */}
        <div className="absolute -top-3 left-6 bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded">
          Coach
        </div>

        {/* Text */}
        <div className="mx-auto text-center max-w-3xl w-[92%]">
          <h4 className="font-semibold text-white leading-tight">
            {step?.title}
          </h4>
          <p className="text-sm text-gray-300 mt-1">
            {step?.text}
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={endTutorial}
          className="text-xs text-gray-400 hover:text-white ml-6 shrink-0"
        >
          Skip
        </button>
      </div>

      
    </div>
  );
}
