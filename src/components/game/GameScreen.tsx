import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameMode } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { getMode1Questions, getMode2Questions } from '../../data';
import { selectRoundQuestions } from '../../hooks/useQuestionCycler';
import { useGameEngine } from '../../hooks/useGameEngine';
import { Mode1Round } from './Mode1Round';
import { Mode2Round } from './Mode2Round';
import { ROUND_SIZE, MODE1_MAX_ROUND } from '../../utils/scoring';

interface GameScreenProps {
  mode: GameMode;
}

export function GameScreen({ mode }: GameScreenProps) {
  const navigate = useNavigate();
  const { activePlayer, updateAfterRound } = usePlayer();
  const engine = useGameEngine();
  const [initialized, setInitialized] = useState(false);
  const [roundQuestionIds, setRoundQuestionIds] = useState<string[]>([]);
  const [newSeenIds, setNewSeenIds] = useState<string[]>([]);

  // Initialize the round
  useEffect(() => {
    if (!activePlayer || initialized) return;

    const seenIds = mode === 1 ? activePlayer.mode1SeenIds : activePlayer.mode2SeenIds;
    const pool =
      mode === 1
        ? getMode1Questions(activePlayer.tier).map((q) => q.id)
        : getMode2Questions(activePlayer.tier).map((q) => q.id);

    if (pool.length === 0) {
      navigate('/play');
      return;
    }

    const { selectedIds, newSeenIds: updatedSeenIds } = selectRoundQuestions(
      pool,
      seenIds,
    );
    setRoundQuestionIds(selectedIds);
    setNewSeenIds(updatedSeenIds);
    engine.startRound(mode, selectedIds);
    setInitialized(true);
  }, [activePlayer, mode, initialized, navigate, engine]);

  // Handle round completion
  useEffect(() => {
    if (!engine.gameState?.roundComplete || !activePlayer) return;

    const gs = engine.gameState;
    const maxScore = mode === 1 ? MODE1_MAX_ROUND : gs.score; // For mode 2, max is variable
    const correct = gs.answers.filter((a) => a.correct).length;
    const seenIds = newSeenIds.length > 0
      ? newSeenIds.filter((id) => !activePlayer[mode === 1 ? 'mode1SeenIds' : 'mode2SeenIds'].includes(id))
      : roundQuestionIds;

    updateAfterRound(mode, gs.score, maxScore, correct, seenIds, gs.streak);

    // Navigate to results
    const params = new URLSearchParams({
      mode: String(mode),
      score: String(gs.score),
      total: String(mode === 1 ? MODE1_MAX_ROUND : ROUND_SIZE * 3),
      correct: String(correct),
      streak: String(gs.streak),
    });
    navigate(`/results?${params.toString()}`);
  }, [engine.gameState?.roundComplete, activePlayer, mode, newSeenIds, roundQuestionIds, updateAfterRound, navigate, engine.gameState]);

  if (!engine.gameState || !initialized) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-lg text-chalk-muted">Loading...</p>
      </div>
    );
  }

  const gs = engine.gameState;

  if (mode === 1) {
    return (
      <Mode1Round
        questionIds={gs.questionIds}
        questionIndex={gs.questionIndex}
        score={gs.score}
        streak={gs.streak}
        onCityAnswer={engine.submitMode1CityAnswer}
        onTeamAnswer={engine.submitMode1TeamAnswer}
        onNextQuestion={engine.nextQuestion}
      />
    );
  }

  return (
    <Mode2Round
      questionIds={gs.questionIds}
      questionIndex={gs.questionIndex}
      score={gs.score}
      streak={gs.streak}
      lifelinesUsed={gs.lifelinesUsed}
      onAnswer={engine.submitMode2Answer}
      onNextQuestion={engine.nextQuestion}
      onHalfCourt={engine.useHalfCourt}
      onBenchSwap={engine.useBenchSwap}
      usedHalfCourtOnCurrent={gs.usedHalfCourtOnCurrent}
    />
  );
}
