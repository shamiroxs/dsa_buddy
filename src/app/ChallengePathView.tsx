/**
 * Duolingo-style vertical challenge path
 * Level 1 at the top, progressing downward
 */

import { challenges } from '../engine/challenges/challenges';
import { useGameStore } from '../orchestrator/store';
import { Difficulty } from '../engine/challenges/types';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function ChallengePathView() {
  const { selectChallenge } = useGameStore();

  const getNodeColor = (difficulty: Difficulty, unlocked: boolean) => {
    if (!unlocked) return 'bg-gray-700';

    switch (difficulty) {
      case Difficulty.EASY:
        return 'bg-green-500';
      case Difficulty.MEDIUM:
        return 'bg-yellow-500';
      case Difficulty.HARD:
        return 'bg-red-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Algorithm Express
        </h1>
        <p className="text-gray-400 mb-12 text-center">
          Enter into your compartment
        </p>

        <div className="relative flex flex-col items-center">
          {/* Vertical path line */}
          <div className="absolute top-0 bottom-0 w-1 bg-gray-700 rounded" />

          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative z-10 flex flex-col items-center mb-16"
            >
              {/* Node */}
              <button
                disabled={!challenge.unlocked}
                onClick={() =>
                  challenge.unlocked && selectChallenge(challenge.id)
                }
                className={clsx(
                  'w-16 h-16 rounded-full flex items-center justify-center',
                  'text-white font-bold text-lg shadow-lg',
                  'transition-transform active:scale-95',
                  challenge.unlocked && 'hover:scale-105',
                  getNodeColor(challenge.difficulty, challenge.unlocked)
                )}
              >
                {index + 1}
              </button>

              {/* Title */}
              <div className="mt-3 text-right max-w-[200px]">
                <p
                  className={clsx(
                    'font-semibold',
                    challenge.unlocked
                      ? 'text-white'
                      : 'text-gray-500'
                  )}
                >
                  {challenge.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {challenge.difficulty}
                </p>
              </div>

              {/* Lock indicator */}
              {!challenge.unlocked && (
                <div className="absolute -bottom-6 text-gray-500 text-xs">
                  🔒 Locked
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
