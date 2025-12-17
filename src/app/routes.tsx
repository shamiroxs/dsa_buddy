/**
 * Simple routing (no React Router needed for MVP)
 * Just challenge selection and game view
 */

import { challenges } from '../engine/challenges/challenges';
import { useGameStore } from '../orchestrator/store';
import { useEffect } from 'react';
import { GameView } from './GameView';
import { ChallengeListView } from './ChallengeListView';

export function Routes() {
  const { currentChallenge, setChallenges, initializeChallenge } = useGameStore();
  
  useEffect(() => {
    // Load challenges
    setChallenges(challenges);
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('dsa-buddy-progress');
    if (savedProgress) {
      // Could update challenge unlock status based on progress
      // For MVP, we'll keep it simple
    }
  }, [setChallenges]);
  
  useEffect(() => {
    // Initialize challenge when selected
    if (currentChallenge) {
      initializeChallenge();
    }
  }, [currentChallenge, initializeChallenge]);
  
  if (currentChallenge) {
    return <GameView />;
  }
  
  return <ChallengeListView />;
}

