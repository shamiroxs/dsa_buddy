/**
 * Challenge selection view
 * Shows list of available challenges
 */

import { challenges } from '../engine/challenges/challenges';
import { useGameStore } from '../orchestrator/store';
import { Difficulty } from '../engine/challenges/types';
import { LockedOverlay } from '../ui/LockedOverlay';
import { motion } from 'framer-motion';

export function ChallengeListView() {
  const { selectChallenge } = useGameStore();
  
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return 'bg-green-600';
      case Difficulty.MEDIUM:
        return 'bg-yellow-600';
      case Difficulty.HARD:
        return 'bg-red-600';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">DSA Buddy</h1>
        <p className="text-gray-400 mb-8">Learn algorithms through interactive gameplay</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => challenge.unlocked && selectChallenge(challenge.id)}
            >
              {!challenge.unlocked && <LockedOverlay challengeTitle={challenge.title} />}
              
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">{challenge.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Array: [{challenge.initialArray.join(', ')}]</span>
                {challenge.maxSteps && (
                  <span>Optimal: ≤{challenge.maxSteps} steps</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}




