interface ClueBarProps {
  clues: string[];
  revealedCount: number;
}

export function ClueBar({ clues, revealedCount }: ClueBarProps) {
  if (revealedCount === 0) return null;

  return (
    <div className="mb-3 flex flex-col gap-1.5">
      {clues.slice(0, revealedCount).map((clue, i) => (
        <div
          key={i}
          className="animate-slide-up rounded-xl bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-800 shadow-sm"
        >
          &#128161; {clue}
        </div>
      ))}
    </div>
  );
}
