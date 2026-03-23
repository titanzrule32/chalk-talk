import { useParams, Navigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { GameScreen } from '../components/game/GameScreen';

export function Game() {
  const { mode } = useParams<{ mode: string }>();
  const { activePlayer } = usePlayer();

  if (!activePlayer) return <Navigate to="/" replace />;
  if (mode !== 'mode1' && mode !== 'mode2') return <Navigate to="/play" replace />;

  const gameMode = mode === 'mode1' ? 1 : 2;

  return <GameScreen mode={gameMode} />;
}
