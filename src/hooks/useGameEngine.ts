import { useState, useCallback } from 'react';
import type { GameMode, GameState, AnswerRecord } from '../types';
import { scoreMode1City, scoreMode1Team, scoreMode2 } from '../utils/scoring';

function createInitialState(mode: GameMode, questionIds: string[]): GameState {
  return {
    mode,
    questionIndex: 0,
    questionIds,
    score: 0,
    streak: 0,
    mode1Phase: 'pick-city',
    mode1CityAttempts: 0,
    mode1CityCorrect: false,
    mode2Phase: 'show-question',
    lifelinesUsed: { halfCourt: false, benchSwap: false },
    usedHalfCourtOnCurrent: false,
    lastAnswerCorrect: null,
    isProcessing: false,
    roundComplete: false,
    answers: [],
  };
}

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startRound = useCallback((mode: GameMode, questionIds: string[]) => {
    setGameState(createInitialState(mode, questionIds));
  }, []);

  const submitMode1CityAnswer = useCallback((correct: boolean) => {
    setGameState((prev) => {
      if (!prev || prev.isProcessing) return prev;
      const attempts = prev.mode1CityAttempts + 1;

      if (correct) {
        return {
          ...prev,
          mode1CityAttempts: attempts,
          mode1CityCorrect: true,
          mode1Phase: 'feedback' as const,
          lastAnswerCorrect: true,
          isProcessing: true,
        };
      }

      // Wrong answer
      if (attempts >= 3) {
        // Failed all 3 - move to team name phase
        return {
          ...prev,
          mode1CityAttempts: attempts,
          mode1CityCorrect: false,
          mode1Phase: 'feedback' as const,
          lastAnswerCorrect: false,
          isProcessing: true,
        };
      }

      // More attempts available
      return {
        ...prev,
        mode1CityAttempts: attempts,
        lastAnswerCorrect: false,
        isProcessing: true,
      };
    });
  }, []);

  const proceedToTeamName = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        mode1Phase: 'pick-team' as const,
        lastAnswerCorrect: null,
        isProcessing: false,
      };
    });
  }, []);

  const submitMode1TeamAnswer = useCallback((correct: boolean) => {
    setGameState((prev) => {
      if (!prev || prev.isProcessing) return prev;

      const cityPoints = scoreMode1City(prev.mode1CityAttempts, prev.mode1CityCorrect);
      const teamPoints = scoreMode1Team(correct);
      const totalPoints = cityPoints + teamPoints;

      const record: AnswerRecord = {
        questionId: prev.questionIds[prev.questionIndex]!,
        correct: prev.mode1CityCorrect && correct,
        attempts: prev.mode1CityAttempts,
        pointsEarned: totalPoints,
      };

      const newStreak = correct ? prev.streak + 1 : 0;

      return {
        ...prev,
        score: prev.score + totalPoints,
        streak: newStreak,
        answers: [...prev.answers, record],
        mode1Phase: 'feedback' as const,
        lastAnswerCorrect: correct,
        isProcessing: true,
      };
    });
  }, []);

  const submitMode2Answer = useCallback((correct: boolean) => {
    setGameState((prev) => {
      if (!prev || prev.isProcessing) return prev;

      const points = scoreMode2(correct, prev.usedHalfCourtOnCurrent);
      const newStreak = correct ? prev.streak + 1 : 0;

      // Streak bonus: +1 for every 3 consecutive correct
      let bonus = 0;
      if (correct && newStreak > 0 && newStreak % 3 === 0) {
        bonus = 1;
      }

      const record: AnswerRecord = {
        questionId: prev.questionIds[prev.questionIndex]!,
        correct,
        usedLifeline: prev.usedHalfCourtOnCurrent ? 'halfCourt' : undefined,
        pointsEarned: points + bonus,
      };

      return {
        ...prev,
        score: prev.score + points + bonus,
        streak: newStreak,
        answers: [...prev.answers, record],
        mode2Phase: 'feedback' as const,
        lastAnswerCorrect: correct,
        isProcessing: true,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;

      const nextIndex = prev.questionIndex + 1;
      if (nextIndex >= prev.questionIds.length) {
        return { ...prev, roundComplete: true, isProcessing: false };
      }

      return {
        ...prev,
        questionIndex: nextIndex,
        mode1Phase: 'pick-city' as const,
        mode1CityAttempts: 0,
        mode1CityCorrect: false,
        mode2Phase: 'show-question' as const,
        usedHalfCourtOnCurrent: false,
        lastAnswerCorrect: null,
        isProcessing: false,
      };
    });
  }, []);

  const useHalfCourt = useCallback(() => {
    setGameState((prev) => {
      if (!prev || prev.lifelinesUsed.halfCourt) return prev;
      return {
        ...prev,
        lifelinesUsed: { ...prev.lifelinesUsed, halfCourt: true },
        usedHalfCourtOnCurrent: true,
      };
    });
  }, []);

  const useBenchSwap = useCallback((newQuestionId: string) => {
    setGameState((prev) => {
      if (!prev || prev.lifelinesUsed.benchSwap) return prev;
      const newIds = [...prev.questionIds];
      newIds[prev.questionIndex] = newQuestionId;
      return {
        ...prev,
        questionIds: newIds,
        lifelinesUsed: { ...prev.lifelinesUsed, benchSwap: true },
        usedHalfCourtOnCurrent: false,
      };
    });
  }, []);

  const clearProcessing = useCallback(() => {
    setGameState((prev) => (prev ? { ...prev, isProcessing: false } : prev));
  }, []);

  return {
    gameState,
    startRound,
    submitMode1CityAnswer,
    proceedToTeamName,
    submitMode1TeamAnswer,
    submitMode2Answer,
    nextQuestion,
    useHalfCourt,
    useBenchSwap,
    clearProcessing,
  };
}
