import { useState, useMemo, useCallback } from 'react';
import type { Mode2Question } from '../../types';
import { getMode2ById, getMode2Questions } from '../../data';
import { shuffle } from '../../utils/shuffle';
import { AnswerButton } from './AnswerButton';
import { FeedbackOverlay } from './FeedbackOverlay';
import { ScoreBar } from './ScoreBar';
import { LifelineBar } from './LifelineBar';
import { usePlayer } from '../../context/PlayerContext';

interface Mode2RoundProps {
  questionIds: string[];
  questionIndex: number;
  score: number;
  streak: number;
  lifelinesUsed: { halfCourt: boolean; benchSwap: boolean };
  onAnswer: (correct: boolean) => void;
  onNextQuestion: () => void;
  onHalfCourt: () => void;
  onBenchSwap: (newQuestionId: string) => void;
  usedHalfCourtOnCurrent: boolean;
}

export function Mode2Round({
  questionIds,
  questionIndex,
  score,
  streak,
  lifelinesUsed,
  onAnswer,
  onNextQuestion,
  onHalfCourt,
  onBenchSwap,
  usedHalfCourtOnCurrent,
}: Mode2RoundProps) {
  const { activePlayer } = usePlayer();
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const questionId = questionIds[questionIndex]!;
  const question = getMode2ById(questionId);

  const shuffledOptions = useMemo(() => {
    if (!question) return [];
    return shuffle([...question.options]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const resetForNext = useCallback(() => {
    setShowFeedback(false);
    setLastCorrect(false);
    setSelectedAnswer(null);
    setEliminatedOptions([]);
    setIsProcessing(false);
    onNextQuestion();
  }, [onNextQuestion]);

  if (!question) return <div>Question not found</div>;

  const handleAnswer = (answer: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedAnswer(answer);
    const correct = answer === question.correct_answer;
    setLastCorrect(correct);
    onAnswer(correct);

    setTimeout(() => {
      setShowFeedback(true);
    }, 600);
  };

  const handleHalfCourt = () => {
    if (isProcessing || lifelinesUsed.halfCourt) return;
    onHalfCourt();

    // Remove 2 wrong options
    const wrongOptions = shuffledOptions.filter(
      (opt) => opt !== question.correct_answer,
    );
    const toEliminate = shuffle(wrongOptions).slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  const handleBenchSwap = () => {
    if (isProcessing || lifelinesUsed.benchSwap) return;

    // Find a replacement question not already in this round
    const allQuestions = activePlayer
      ? getMode2Questions(activePlayer.tier)
      : [];
    const available = allQuestions.filter(
      (q: Mode2Question) => !questionIds.includes(q.id),
    );

    if (available.length > 0) {
      const replacement = available[Math.floor(Math.random() * available.length)]!;
      onBenchSwap(replacement.id);
      setSelectedAnswer(null);
      setEliminatedOptions([]);
      setIsProcessing(false);
    }
  };

  const getButtonState = (option: string) => {
    if (eliminatedOptions.includes(option)) return 'eliminated' as const;
    if (!selectedAnswer) return 'default' as const;
    if (option === question.correct_answer) return 'correct' as const;
    if (selectedAnswer === option) return 'wrong' as const;
    return 'default' as const;
  };

  return (
    <div className="flex flex-1 flex-col">
      <ScoreBar
        score={score}
        questionIndex={questionIndex}
        totalQuestions={questionIds.length}
        streak={streak}
      />

      {!showFeedback ? (
        <>
          <div className="mb-4 rounded-2xl bg-white p-5 shadow-md">
            <p className="text-center text-xl font-bold leading-relaxed text-chalk-text">
              {question.question}
            </p>
          </div>

          <LifelineBar
            halfCourtUsed={lifelinesUsed.halfCourt}
            benchSwapUsed={lifelinesUsed.benchSwap}
            onHalfCourt={handleHalfCourt}
            onBenchSwap={handleBenchSwap}
            disabled={isProcessing}
          />

          <div className="flex flex-col gap-2">
            {shuffledOptions.map((option) => (
              <AnswerButton
                key={option}
                label={option}
                onClick={() => handleAnswer(option)}
                disabled={isProcessing}
                state={getButtonState(option)}
              />
            ))}
          </div>

          {usedHalfCourtOnCurrent && !isProcessing && (
            <p className="mt-2 text-center text-xs text-chalk-muted">
              Half Court used - correct answer worth 1 point
            </p>
          )}
        </>
      ) : (
        <FeedbackOverlay
          correct={lastCorrect}
          message={
            lastCorrect
              ? question.explanation
              : `${question.correct_answer} - ${question.explanation}`
          }
          onComplete={resetForNext}
        />
      )}
    </div>
  );
}
