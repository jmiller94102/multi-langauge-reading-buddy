import React from 'react';
import { Button } from '@/components/common/Button';
import type { PetEvolutionTrack, PetEvolutionStage } from '@/types/pet';
import { EVOLUTION_STAGE_NAMES, getBonusForStage } from '@/data/petEvolution';
import { PetCharacter } from './PetCharacter';

interface EvolutionModalProps {
  petName: string;
  track: PetEvolutionTrack;
  newStage: PetEvolutionStage;
  onClose: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({ petName, track, newStage, onClose }) => {
  const stageName = EVOLUTION_STAGE_NAMES[track][newStage];
  const bonus = getBonusForStage(track, newStage);

  // Get track-specific display info
  const trackInfo: Record<PetEvolutionTrack, { color: string; emoji: string; label: string }> = {
    knowledge: { color: 'blue', emoji: '📚', label: 'Knowledge Track' },
    coolness: { color: 'purple', emoji: '😎', label: 'Coolness Track' },
    culture: { color: 'green', emoji: '🌍', label: 'Culture Track' },
  };

  const info = trackInfo[track];

  // Get bonus type text
  const getBonusText = () => {
    if ('xpBonus' in bonus && bonus.xpBonus > 0) {
      return `+${bonus.xpBonus}% XP Bonus`;
    }
    if ('coinBonus' in bonus && bonus.coinBonus > 0) {
      return `+${bonus.coinBonus} Coins Bonus`;
    }
    if ('languageBonus' in bonus && bonus.languageBonus > 0) {
      return `+${bonus.languageBonus}% Language XP Bonus`;
    }
    return 'New abilities unlocked!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-scale">
        {/* Header with confetti background */}
        <div className="relative bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 py-6 px-6 text-center">
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                🎉
              </div>
            ))}
          </div>
          <h2 className="text-child-xl font-black text-white relative z-10 drop-shadow-lg">
            🎉 Evolution Complete! 🎉
          </h2>
        </div>

        {/* Content */}
        <div className="py-6 px-6 space-y-5">
          {/* Pet display */}
          <div className="text-center">
            <div className="mb-3 animate-bounce-gentle flex justify-center">
              <PetCharacter emotion="love" size="xlarge" animate={true} />
            </div>
            <h3 className="text-child-lg font-bold text-gray-900 mb-1">
              {petName} evolved to
            </h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{info.emoji}</span>
              <p className="text-child-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {stageName}!
              </p>
              <span className="text-2xl">{info.emoji}</span>
            </div>
            <p className="text-child-xs text-gray-600">
              {info.label} • Stage {newStage}
            </p>
          </div>

          {/* New abilities */}
          <div className={`bg-${info.color}-50 border-2 border-${info.color}-300 rounded-lg py-4 px-4`}>
            <h4 className="text-child-sm font-bold text-gray-900 mb-2 flex items-center justify-center gap-1.5">
              <span className="text-lg">✨</span>
              New Abilities Unlocked
            </h4>
            <div className="space-y-2">
              {/* Main bonus */}
              <div className={`bg-${info.color}-100 rounded-lg py-2 px-3 border border-${info.color}-200`}>
                <p className="text-child-xs font-bold text-gray-900 text-center">
                  {getBonusText()}
                </p>
              </div>

              {/* Bonus description */}
              <p className="text-[11px] text-gray-700 text-center leading-relaxed">
                {bonus.description}
              </p>
            </div>
          </div>

          {/* Stats comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
              <p className="text-[10px] font-semibold text-gray-600 mb-1">Previous Stage</p>
              <p className="text-child-base font-bold text-gray-900">
                {newStage > 0 ? EVOLUTION_STAGE_NAMES[track][(newStage - 1) as PetEvolutionStage] : '-'}
              </p>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg py-3 px-2 border-2 border-purple-300">
              <p className="text-[10px] font-semibold text-purple-700 mb-1">Current Stage</p>
              <p className="text-child-base font-bold text-purple-900">{stageName}</p>
            </div>
          </div>

          {/* Continue button */}
          <Button
            variant="primary"
            size="large"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            aria-label="Continue to dashboard"
          >
            <span className="text-child-base font-bold flex items-center justify-center gap-2">
              <span>🎊</span>
              <span>Awesome! Let's Continue</span>
              <span>🎊</span>
            </span>
          </Button>
        </div>

        {/* Sparkles animation around modal */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-400 text-3xl animate-twinkle-slow"
              style={{
                top: `${10 + (i * 80) / 8}%`,
                left: i % 2 === 0 ? '-10px' : 'calc(100% - 10px)',
                animationDelay: `${i * 0.2}s`,
              }}
            >
              ✨
            </div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes bounce-gentle {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 1.5s ease-in-out infinite;
        }

        @keyframes twinkle-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-twinkle-slow {
          animation: twinkle-slow 2s ease-in-out infinite;
        }

        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
