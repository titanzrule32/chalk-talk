import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { PlayerCard } from './PlayerCard';
import { CreatePlayerModal } from './CreatePlayerModal';
import { Button } from '../shared/Button';

export function PlayerSelectScreen() {
  const { players, selectPlayer, createPlayer, deletePlayer } = usePlayer();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const handleSelect = (id: string) => {
    selectPlayer(id);
    navigate('/play');
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 pt-6 text-center">
        <h1 className="mb-1 text-4xl font-bold text-chalk-navy" style={{ fontFamily: 'var(--font-family-display)' }}>
          Chalk Talk
        </h1>
        <p className="text-lg text-chalk-muted">Sports Trivia for Kids!</p>
      </div>

      <h2 className="mb-3 text-center text-xl font-bold text-chalk-text">
        Who's Playing?
      </h2>

      {players.length > 0 ? (
        <div className="mb-4 flex flex-col gap-3">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onSelect={() => handleSelect(player.id)}
              onDelete={() => deletePlayer(player.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mb-4 rounded-2xl bg-white p-8 text-center shadow-md">
          <p className="text-5xl">&#127944;</p>
          <p className="mt-3 text-lg font-semibold text-chalk-text">
            No players yet!
          </p>
          <p className="text-chalk-muted">Create a player to get started.</p>
        </div>
      )}

      <Button
        onClick={() => setShowCreate(true)}
        size="lg"
        className="w-full"
      >
        + New Player
      </Button>

      <CreatePlayerModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createPlayer}
      />
    </div>
  );
}
