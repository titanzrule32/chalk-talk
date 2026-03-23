export function scoreMode1City(attempts: number, correct: boolean): number {
  if (!correct) return 0;
  if (attempts === 1) return 3;
  if (attempts === 2) return 2;
  return 1;
}

export function scoreMode1Team(correct: boolean): number {
  return correct ? 1 : 0;
}

export function scoreMode2(correct: boolean, usedHalfCourt: boolean): number {
  if (!correct) return 0;
  return usedHalfCourt ? 1 : 3;
}

export function streakBonus(consecutiveCorrect: number): number {
  return Math.floor(consecutiveCorrect / 3);
}

export const MODE1_MAX_PER_QUESTION = 4;
export const MODE2_MAX_PER_QUESTION = 3;
export const ROUND_SIZE = 10;
export const MODE1_MAX_ROUND = MODE1_MAX_PER_QUESTION * ROUND_SIZE;
export const MODE2_MAX_ROUND_BASE = MODE2_MAX_PER_QUESTION * ROUND_SIZE;
