import useSound from 'use-sound';

export function useAppSounds() {
  const [playCorrect] = useSound('/assets/sounds/correct.mp3', {
    volume: 0.5,
  });
  const [playWrong] = useSound('/assets/sounds/wrong.mp3', {
    volume: 0.4,
  });
  const [playFanfare] = useSound('/assets/sounds/fanfare.mp3', {
    volume: 0.6,
  });
  const [playClick] = useSound('/assets/sounds/click.mp3', {
    volume: 0.3,
  });
  const [playCheer] = useSound('/assets/sounds/cheer.mp3', {
    volume: 0.5,
  });
  const [playWhistle] = useSound('/assets/sounds/whistle.mp3', {
    volume: 0.4,
  });
  const [playTrumpet] = useSound('/assets/sounds/trumpet.mp3', {
    volume: 0.5,
  });

  return {
    playCorrect,
    playWrong,
    playFanfare,
    playClick,
    playCheer,
    playWhistle,
    playTrumpet,
  };
}
