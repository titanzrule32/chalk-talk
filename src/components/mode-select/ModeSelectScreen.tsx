import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';

export function ModeSelectScreen() {
  const navigate = useNavigate();
  const { activePlayer } = usePlayer();

  if (!activePlayer) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 pt-4 text-center">
        <p className="text-chalk-muted">
          Playing as{' '}
          <span className="font-bold text-chalk-text">
            {activePlayer.name}
          </span>
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-1 text-sm text-chalk-blue underline"
        >
          Switch Player
        </button>
      </div>

      <h2 className="mb-5 text-center text-2xl font-bold text-chalk-text">
        Pick a Game Mode
      </h2>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/play/mode1')}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            &#127758;
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-chalk-text">
              Geography Quiz
            </h3>
            <p className="text-sm text-chalk-muted">
              Match team logos to their cities and names!
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/play/mode2')}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
            &#129504;
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-chalk-text">
              Sports Knowledge
            </h3>
            <p className="text-sm text-chalk-muted">
              Test your knowledge of recent sports events!
            </p>
          </div>
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold text-chalk-muted">Your Stats</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-chalk-navy">
              {activePlayer.totalGames}
            </p>
            <p className="text-xs text-chalk-muted">Games</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-chalk-navy">
              {activePlayer.longestStreak}
            </p>
            <p className="text-xs text-chalk-muted">Best Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-chalk-navy">
              {Math.max(
                activePlayer.highScores.mode1,
                activePlayer.highScores.mode2,
              )}
            </p>
            <p className="text-xs text-chalk-muted">High Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}
