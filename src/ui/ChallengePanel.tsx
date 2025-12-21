/**
 * Challenge information panel
 * Shows challenge description, initial/target arrays, and validation results
 */

import { useCurrentChallenge, useValidationResult, useArrayState } from '../orchestrator/selectors';
import { ArrayView } from '../renderer/ArrayView';
import { motion } from 'framer-motion';

export function ChallengePanel() {
  const challenge = useCurrentChallenge();
  const validationResult = useValidationResult();
  const currentArray = useArrayState();
  
  if (!challenge) {
    return (
      <div className="challenge-panel bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400">Select a challenge to begin</div>
      </div>
    );
  }
  
  return (
    <div className="challenge-panel bg-gray-800 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-white text-xl font-bold mb-2">{challenge.title}</h2>
        <p className="text-gray-300 text-sm mb-2">{challenge.description}</p>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            challenge.difficulty === 'EASY' ? 'bg-green-600' :
            challenge.difficulty === 'MEDIUM' ? 'bg-yellow-600' :
            'bg-red-600'
          }`}>
            {challenge.difficulty}
          </span>
          {challenge.maxSteps && (
            <span className="text-gray-400 text-xs">
              Optimal: ≤{challenge.maxSteps} steps
            </span>
          )}
        </div>
      </div>
      
      {/* Initial Array */}
      <div className="mb-4">
        <h3 className="text-gray-400 text-sm mb-2">Initial Array</h3>
        <ArrayView array={challenge.initialArray} />
      </div>
          
      {/* Validation Result */}
      {validationResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded ${
            validationResult.success
              ? 'bg-green-900/30 border border-green-500'
              : 'bg-red-900/30 border border-red-500'
          }`}
        >
          <div className={`font-semibold ${
            validationResult.success ? 'text-green-300' : 'text-red-300'
          }`}>
            {validationResult.success ? '✓ Success!' : '✗ Failed'}
          </div>
          <div className="text-sm text-gray-300 mt-1">{validationResult.message}</div>
          <div className="text-xs text-gray-400 mt-1">
            Steps: {validationResult.stepCount}
            {challenge.maxSteps && (
              <span className={validationResult.optimized ? 'text-green-400' : 'text-yellow-400'}>
                {' '}({validationResult.optimized ? 'Optimized' : 'Not optimized'})
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}




