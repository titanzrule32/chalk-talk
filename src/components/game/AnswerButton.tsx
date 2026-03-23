interface AnswerButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'wrong' | 'eliminated';
}

const stateStyles = {
  default:
    'bg-white border-slate-200 text-chalk-text hover:border-chalk-blue hover:bg-blue-50 active:scale-[0.97]',
  correct:
    'bg-green-100 border-chalk-green text-green-800',
  wrong:
    'bg-red-100 border-chalk-red text-red-800 animate-wrong',
  eliminated:
    'bg-slate-50 border-slate-100 text-slate-300 line-through pointer-events-none',
};

export function AnswerButton({
  label,
  onClick,
  disabled = false,
  state = 'default',
}: AnswerButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || state !== 'default'}
      className={`min-h-[56px] w-full rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold transition-all ${stateStyles[state]} disabled:pointer-events-none`}
    >
      {label}
    </button>
  );
}
