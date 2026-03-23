import { useState } from 'react';
import type { DifficultyTier } from '../../types';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

interface CreatePlayerModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, tier: DifficultyTier) => void;
}

const tiers: { value: DifficultyTier; label: string; ages: string; desc: string }[] = [
  { value: 'rookie', label: 'Rookie', ages: '5-6', desc: 'NFL, NBA, MLB' },
  { value: 'pro', label: 'Pro', ages: '7-8', desc: '+ NHL, MLS, College' },
  { value: 'legend', label: 'Legend', ages: '9-10', desc: '+ Soccer, Golf, Olympics' },
];

export function CreatePlayerModal({
  open,
  onClose,
  onCreate,
}: CreatePlayerModalProps) {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<DifficultyTier>('rookie');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed, tier);
    setName('');
    setTier('rookie');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 text-center text-2xl font-bold text-chalk-text">
        New Player
      </h2>

      <label className="mb-1 block text-sm font-semibold text-chalk-muted">
        Your Name
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={20}
        placeholder="Enter your name"
        className="mb-4 w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg outline-none focus:border-chalk-blue"
        autoFocus
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <label className="mb-2 block text-sm font-semibold text-chalk-muted">
        Difficulty
      </label>
      <div className="mb-5 flex flex-col gap-2">
        {tiers.map((t) => (
          <button
            key={t.value}
            onClick={() => setTier(t.value)}
            className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
              tier === t.value
                ? 'border-chalk-blue bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{t.label}</span>
              <span className="text-sm text-chalk-muted">Ages {t.ages}</span>
            </div>
            <p className="mt-0.5 text-sm text-chalk-muted">{t.desc}</p>
          </button>
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!name.trim()}
        size="lg"
        className="w-full"
      >
        Let's Go!
      </Button>
    </Modal>
  );
}
