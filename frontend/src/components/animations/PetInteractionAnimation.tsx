import React, { useEffect, useState } from 'react';

export type PetInteractionType = 'feed' | 'play' | 'boost';

interface PetInteractionAnimationProps {
  type: PetInteractionType;
  message?: string;
  onComplete: () => void;
}

export const PetInteractionAnimation: React.FC<PetInteractionAnimationProps> = ({
  type,
  message,
  onComplete,
}) => {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setShow(true), 50);

    // Generate particles based on interaction type
    const emoji = type === 'feed' ? '❤️' : type === 'play' ? '⭐' : '✨';
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji,
      x: Math.random() * 100 - 50, // -50 to 50
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);

    // Auto-close after 1.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  const getConfig = () => {
    switch (type) {
      case 'feed':
        return {
          icon: '🍖',
          title: 'Yummy!',
          bgColor: 'from-amber-500 to-orange-500',
        };
      case 'play':
        return {
          icon: '🎮',
          title: 'So fun!',
          bgColor: 'from-blue-500 to-cyan-500',
        };
      case 'boost':
        return {
          icon: '⚡',
          title: 'Supercharged!',
          bgColor: 'from-purple-500 to-pink-500',
        };
    }
  };

  const config = getConfig();

  return (
    <>
      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed z-50 text-2xl pointer-events-none"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            top: `calc(50% + ${particle.y}px)`,
            animation: 'float-away 1.5s ease-out forwards',
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Message Popup */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className={`bg-gradient-to-br ${config.bgColor} text-white rounded-2xl shadow-2xl p-6 min-w-[200px]`}>
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">{config.icon}</div>
            <h3 className="text-xl font-bold">{config.title}</h3>
            {message && <p className="text-sm opacity-90 mt-1">{message}</p>}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes float-away {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx, 0), var(--ty, -100px)) scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
};
