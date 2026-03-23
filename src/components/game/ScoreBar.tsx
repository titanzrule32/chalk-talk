interface ScoreBarProps {
  score: number;
  questionIndex: number;
  totalQuestions: number;
  streak: number;
}

export function ScoreBar({ score, questionIndex, totalQuestions, streak }: ScoreBarProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-2 shadow-sm">
      <div className="text-sm font-bold text-chalk-navy">
        Score: <span className="text-chalk-blue">{score}</span>
      </div>
      <div className="text-sm font-semibold text-chalk-muted">
        {questionIndex + 1} / {totalQuestions}
      </div>
      <div className="flex items-center gap-1 text-sm font-bold">
        {streak >= 3 && <span className="text-chalk-orange">&#128293;</span>}
        {streak > 0 && (
          <span className="text-chalk-orange">{streak}</span>
        )}
      </div>
    </div>
  );
}
