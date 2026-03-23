import { shuffle } from '../utils/shuffle';
import { ROUND_SIZE } from '../utils/scoring';

export interface CyclerResult {
  selectedIds: string[];
  newSeenIds: string[];
}

export function selectRoundQuestions(
  allIds: string[],
  seenIds: string[],
): CyclerResult {
  let unseenIds = allIds.filter((id) => !seenIds.includes(id));

  // If not enough unseen questions, reset the cycle
  let resetSeenIds = false;
  if (unseenIds.length < ROUND_SIZE) {
    resetSeenIds = true;
    unseenIds = [...allIds];
  }

  const shuffled = shuffle(unseenIds);
  const selectedIds = shuffled.slice(0, Math.min(ROUND_SIZE, shuffled.length));

  const newSeenIds = resetSeenIds ? [...selectedIds] : [...seenIds, ...selectedIds];

  return { selectedIds, newSeenIds };
}
