export type GameMode = 1 | 2;

export type Mode1Phase = 'show-logo' | 'pick-city' | 'pick-team' | 'feedback' | 'complete';
export type Mode2Phase = 'show-question' | 'feedback' | 'complete';

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  attempts?: number;
  usedLifeline?: string;
  pointsEarned: number;
}

export interface GameState {
  mode: GameMode;
  questionIndex: number;
  questionIds: string[];
  score: number;
  streak: number;
  // Mode 1
  mode1Phase: Mode1Phase;
  mode1CityAttempts: number;
  mode1CityCorrect: boolean;
  // Mode 2
  mode2Phase: Mode2Phase;
  lifelinesUsed: {
    halfCourt: boolean;
    benchSwap: boolean;
  };
  usedHalfCourtOnCurrent: boolean;
  // Feedback
  lastAnswerCorrect: boolean | null;
  isProcessing: boolean;
  // Results
  roundComplete: boolean;
  answers: AnswerRecord[];
}
