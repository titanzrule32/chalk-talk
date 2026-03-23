import type { PlayerProfile } from '../../types';

const tierLabels = {
  rookie: { label: 'Rookie', color: 'bg-green-100 text-green-700' },
  pro: { label: 'Pro', color: 'bg-blue-100 text-blue-700' },
  legend: { label: 'Legend', color: 'bg-purple-100 text-purple-700' },
} as const;

interface PlayerCardProps {
  player: PlayerProfile;
  onSelect: () => void;
  onDelete: () => void;
}

export function PlayerCard({ player, onSelect, onDelete }: PlayerCardProps) {
  const tier = tierLabels[player.tier];

  return (
    <button
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chalk-navy text-xl font-bold text-white">
        {player.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 text-left">
        <p className="text-lg font-bold text-chalk-text">{player.name}</p>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tier.color}`}
          >
            {tier.label}
          </span>
          <span className="text-xs text-chalk-muted">
            {player.totalGames} games
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
        aria-label={`Delete ${player.name}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </button>
  );
}
