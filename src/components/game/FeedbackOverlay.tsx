import { useEffect } from 'react';

interface FeedbackOverlayProps {
  correct: boolean;
  message?: string;
  onComplete: () => void;
  duration?: number;
}

export function FeedbackOverlay({
  correct,
  message,
  onComplete,
  duration = 3200,
}: FeedbackOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div
      className={`animate-pop-in mb-4 rounded-2xl p-4 text-center shadow-md ${
        correct
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      <p className="text-3xl">{correct ? '\u2705' : '\u274C'}</p>
      <p className="mt-1 text-lg font-bold">
        {correct ? 'Correct!' : 'Not quite!'}
      </p>
      {message && <p className="mt-1 text-sm">{message}</p>}
    </div>
  );
}
