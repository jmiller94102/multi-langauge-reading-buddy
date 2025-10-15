import * as React from 'react';
import Confetti from 'react-confetti';

export interface ConfettiAnimationProps {
  trigger: boolean;
  duration?: number;
  onComplete?: () => void;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  trigger,
  duration = 3000,
  onComplete,
}) => {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete]);

  if (!isActive) return null;

  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      recycle={false}
      numberOfPieces={200}
      gravity={0.3}
    />
  );
};

ConfettiAnimation.displayName = 'ConfettiAnimation';
