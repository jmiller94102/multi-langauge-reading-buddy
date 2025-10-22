import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  duration?: number; // Duration in ms
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

export const Confetti: React.FC<ConfettiProps> = ({
  duration = 3000,
  particleCount = 50,
  colors = ['#3b82f6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6'],
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // Percentage
        y: -10, // Start above screen
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5, // 0.5 to 1
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 2, // -1 to 1
        velocityY: Math.random() * 2 + 2, // 2 to 4
        rotationSpeed: (Math.random() - 0.5) * 10, // -5 to 5
      });
    }
    setParticles(newParticles);

    // Auto-cleanup after duration
    const timer = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, particleCount, colors, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
            animation: `confetti-fall ${duration}ms linear forwards`,
            animationDelay: `${Math.random() * 200}ms`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(120vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
