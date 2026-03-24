import useSound from 'use-sound';

const MUTE_KEY = 'chalk-talk-muted';

function isMuted(): boolean {
  return localStorage.getItem(MUTE_KEY) === 'true';
}

export function useAppSounds() {
  const [rawCorrect] = useSound('/assets/sounds/correct.mp3', { volume: 0.5 });
  const [rawWrong] = useSound('/assets/sounds/wrong.mp3', { volume: 0.4 });
  const [rawFanfare] = useSound('/assets/sounds/fanfare.mp3', { volume: 0.6 });
  const [rawClick] = useSound('/assets/sounds/click.mp3', { volume: 0.3 });
  const [rawCheer] = useSound('/assets/sounds/cheer.mp3', { volume: 0.5 });
  const [rawWhistle] = useSound('/assets/sounds/whistle.mp3', { volume: 0.4 });
  const [rawTrumpet] = useSound('/assets/sounds/trumpet.mp3', { volume: 0.5 });

  const guard = (fn: () => void) => () => { if (!isMuted()) fn(); };

  return {
    playCorrect: guard(rawCorrect),
    playWrong: guard(rawWrong),
    playFanfare: guard(rawFanfare),
    playClick: guard(rawClick),
    playCheer: guard(rawCheer),
    playWhistle: guard(rawWhistle),
    playTrumpet: guard(rawTrumpet),
  };
}

export { MUTE_KEY };
