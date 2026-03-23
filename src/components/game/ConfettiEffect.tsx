import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  intensity?: 'small' | 'big';
}

export function ConfettiEffect({ trigger, intensity = 'small' }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return;

    if (intensity === 'big') {
      // Big celebration
      const end = Date.now() + 800;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#22c55e', '#3b82f6', '#facc15', '#a855f7'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#22c55e', '#3b82f6', '#facc15', '#a855f7'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else {
      // Small pop
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#3b82f6', '#facc15'],
      });
    }
  }, [trigger, intensity]);

  return null;
}
