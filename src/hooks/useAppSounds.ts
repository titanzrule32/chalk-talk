import useSound from 'use-sound';

export function useAppSounds() {
  const [playCorrect] = useSound('/assets/sounds/correct.mp3', {
    volume: 0.5,
  });
  const [playWrong] = useSound('/assets/sounds/wrong.mp3', {
    volume: 0.5,
  });
  const [playFanfare] = useSound('/assets/sounds/fanfare.mp3', {
    volume: 0.6,
  });
  const [playClick] = useSound('/assets/sounds/click.mp3', {
    volume: 0.3,
  });

  return { playCorrect, playWrong, playFanfare, playClick };
}
