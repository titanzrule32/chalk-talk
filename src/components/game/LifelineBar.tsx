interface LifelineBarProps {
  halfCourtUsed: boolean;
  benchSwapUsed: boolean;
  onHalfCourt: () => void;
  onBenchSwap: () => void;
  disabled?: boolean;
}

export function LifelineBar({
  halfCourtUsed,
  benchSwapUsed,
  onHalfCourt,
  onBenchSwap,
  disabled = false,
}: LifelineBarProps) {
  return (
    <div className="mb-4 flex gap-3">
      <button
        onClick={onHalfCourt}
        disabled={halfCourtUsed || disabled}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all active:scale-95 ${
          halfCourtUsed
            ? 'border-slate-100 bg-slate-50 text-slate-300'
            : 'border-chalk-purple bg-purple-50 text-chalk-purple hover:bg-purple-100'
        } disabled:pointer-events-none`}
      >
        <span>&#189;</span>
        Half Court
      </button>
      <button
        onClick={onBenchSwap}
        disabled={benchSwapUsed || disabled}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all active:scale-95 ${
          benchSwapUsed
            ? 'border-slate-100 bg-slate-50 text-slate-300'
            : 'border-chalk-orange bg-orange-50 text-chalk-orange hover:bg-orange-100'
        } disabled:pointer-events-none`}
      >
        <span>&#128260;</span>
        Bench Swap
      </button>
    </div>
  );
}
