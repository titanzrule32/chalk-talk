import { useState } from 'react';
import { MUTE_KEY } from '../../hooks/useAppSounds';

export function MuteButton() {
  const [muted, setMuted] = useState(
    () => localStorage.getItem(MUTE_KEY) === 'true',
  );

  const toggle = () => {
    const next = !muted;
    localStorage.setItem(MUTE_KEY, String(next));
    setMuted(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-100"
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {muted ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-chalk-muted">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-chalk-navy">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) }
    </button>
  );
}
