import React, { useState, useEffect } from 'react';
import type { PetEvolutionTrack } from '@/types/pet';
import { PetCharacter } from './PetCharacter';

interface EvolutionAnimationProps {
  track: PetEvolutionTrack;
  onComplete: () => void;
}

type AnimationPhase = 'pre-evolution' | 'glow' | 'spin' | 'flash' | 'reveal' | 'celebration' | 'complete';

export const EvolutionAnimation: React.FC<EvolutionAnimationProps> = ({ track, onComplete }) => {
  const [phase, setPhase] = useState<AnimationPhase>('pre-evolution');

  // Track-specific glow colors
  const glowColors: Record<PetEvolutionTrack, { from: string; to: string; gradient: string }> = {
    knowledge: {
      from: 'from-blue-400',
      to: 'to-yellow-500',
      gradient: 'bg-gradient-to-r from-blue-400 to-yellow-500',
    },
    coolness: {
      from: 'from-pink-400',
      to: 'to-purple-500',
      gradient: 'bg-gradient-to-r from-pink-400 to-purple-500',
    },
    culture: {
      from: 'from-green-400',
      to: 'to-blue-500',
      gradient: 'bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 to-purple-500',
    },
  };

  const currentColor = glowColors[track];

  // Animation phase timing
  useEffect(() => {
    const timings: Record<AnimationPhase, number> = {
      'pre-evolution': 1000,
      'glow': 1000,
      'spin': 2000,
      'flash': 500,
      'reveal': 1000,
      'celebration': 1500,
      'complete': 0,
    };

    const phaseOrder: AnimationPhase[] = [
      'pre-evolution',
      'glow',
      'spin',
      'flash',
      'reveal',
      'celebration',
      'complete',
    ];

    const currentIndex = phaseOrder.indexOf(phase);
    const nextPhase = phaseOrder[currentIndex + 1];

    if (phase === 'complete') {
      onComplete();
      return;
    }

    if (!nextPhase) {
      return; // Safety check - should never happen
    }

    const timer = setTimeout(() => {
      setPhase(nextPhase);
    }, timings[phase]);

    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-96 h-96">
        {/* Pre-Evolution: Pet jumps */}
        {phase === 'pre-evolution' && (
          <div className="absolute inset-0 flex items-center justify-center animate-bounce">
            <PetCharacter emotion="excited" size="xlarge" animate={false} />
          </div>
        )}

        {/* Glow Effect: Pet begins to glow */}
        {phase === 'glow' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="relative z-10">
                <PetCharacter emotion="excited" size="xlarge" animate={false} />
              </div>
              <div
                className={`absolute inset-0 ${currentColor.gradient} rounded-full blur-2xl opacity-50 animate-pulse`}
                style={{ transform: 'scale(1.5)' }}
              />
            </div>
          </div>
        )}

        {/* Spin: Pet spins rapidly while glowing */}
        {phase === 'spin' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="animate-spin relative z-10">
                <PetCharacter emotion="excited" size="xlarge" animate={false} />
              </div>
              <div
                className={`absolute inset-0 ${currentColor.gradient} rounded-full blur-3xl opacity-70 animate-ping`}
                style={{ transform: 'scale(2)' }}
              />
              {/* Particle swirl effect */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 ${currentColor.gradient} rounded-full`}
                  style={{
                    top: '50%',
                    left: '50%',
                    animation: `orbit ${2 + i * 0.2}s linear infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Flash: Bright white flash */}
        {phase === 'flash' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-white animate-ping" />
            <div className="relative z-10 scale-150 opacity-0">
              <PetCharacter emotion="excited" size="xlarge" animate={false} />
            </div>
          </div>
        )}

        {/* Reveal: New evolution form appears with spotlight */}
        {phase === 'reveal' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative animate-fade-in-scale">
              <div className="relative z-10">
                <PetCharacter emotion="excited" size="xlarge" animate={false} />
              </div>
              {/* Spotlight effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-200 to-transparent blur-xl opacity-60" />
              {/* Light rays */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 bg-yellow-300 opacity-30"
                  style={{
                    height: '200px',
                    transform: `rotate(${i * 30}deg) translateY(-100px)`,
                    transformOrigin: 'bottom center',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Celebration: Confetti and sparkles */}
        {phase === 'celebration' && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="relative animate-bounce-gentle">
              <PetCharacter emotion="love" size="xlarge" animate={true} />
            </div>

            {/* Confetti particles */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 ${
                  ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'][
                    i % 5
                  ]
                } rounded-sm`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `confetti-fall ${1 + Math.random()}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}

            {/* Star sparkles */}
            {[...Array(10)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-yellow-400 text-2xl animate-twinkle"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animation label */}
      <div className="absolute bottom-20 text-center text-white font-bold text-child-lg animate-pulse">
        {phase === 'pre-evolution' && '✨ Get ready!'}
        {phase === 'glow' && '🌟 Evolution starting...'}
        {phase === 'spin' && '⚡ Transforming...'}
        {phase === 'flash' && ''}
        {phase === 'reveal' && '🎉 Evolution complete!'}
        {phase === 'celebration' && '🎊 Congratulations!'}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(80px) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(80px) rotate(-360deg);
          }
        }

        @keyframes confetti-fall {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out forwards;
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 1s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .animate-twinkle {
          animation: twinkle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
