export type DifficultyTier = 'rookie' | 'pro' | 'legend';

export interface RoundHistoryEntry {
  mode: 1 | 2;
  score: number;
  maxScore: number;
  date: string;
  questionsCorrect: number;
  questionsTotal: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  tier: DifficultyTier;
  createdAt: string;
  mode1SeenIds: string[];
  mode2SeenIds: string[];
  highScores: {
    mode1: number;
    mode2: number;
  };
  currentStreak: number;
  longestStreak: number;
  totalGames: number;
  roundHistory: RoundHistoryEntry[];
}
