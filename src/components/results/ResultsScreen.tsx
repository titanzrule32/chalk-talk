import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { Button } from '../shared/Button';

export function ResultsScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activePlayer } = usePlayer();

  const mode = Number(searchParams.get('mode')) as 1 | 2;
  const score = Number(searchParams.get('score') ?? 0);
  const total = Number(searchParams.get('total') ?? 0);
  const correct = Number(searchParams.get('correct') ?? 0);
  const streak = Number(searchParams.get('streak') ?? 0);

  const highScore = activePlayer
    ? mode === 1
      ? activePlayer.highScores.mode1
      : activePlayer.highScores.mode2
    : 0;
  const isNewHigh = score > 0 && score >= highScore;

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const modeLabel = mode === 1 ? 'Geography Quiz' : 'Sports Knowledge';

  let message = 'Keep trying!';
  if (percentage >= 90) message = 'Amazing job!';
  else if (percentage >= 70) message = 'Great work!';
  else if (percentage >= 50) message = 'Good effort!';
  else if (percentage >= 30) message = 'Nice try!';

  return (
    <div className="flex flex-1 flex-col items-center pt-8">
      <h1 className="mb-2 text-3xl font-bold text-chalk-navy">
        {modeLabel}
      </h1>
      <p className="mb-6 text-lg text-chalk-muted">Round Complete!</p>

      {/* Score Card */}
      <div className="mb-6 w-full rounded-2xl bg-white p-6 text-center shadow-lg">
        <p className="text-5xl font-bold text-chalk-blue animate-count-up">
          {score}
        </p>
        <p className="mt-1 text-chalk-muted">
          out of {total} points
        </p>

        {isNewHigh && (
          <div className="mt-3 animate-pop-in rounded-xl bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
            &#127942; New Personal Best!
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid w-full grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-chalk-green">{correct}</p>
          <p className="text-xs text-chalk-muted">Correct</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-chalk-red">{Math.abs(10 - correct)}</p>
          <p className="text-xs text-chalk-muted">Wrong</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-chalk-orange">
            {streak > 0 ? streak : '-'}
          </p>
          <p className="text-xs text-chalk-muted">Streak</p>
        </div>
      </div>

      <p className="mb-6 text-xl font-bold text-chalk-text">{message}</p>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3">
        <Button
          onClick={() => navigate(`/play/mode${mode}`)}
          size="lg"
          className="w-full"
        >
          Play Again
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate('/play')}
          size="md"
          className="w-full"
        >
          Change Mode
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          size="md"
          className="w-full"
        >
          Switch Player
        </Button>
      </div>
    </div>
  );
}
