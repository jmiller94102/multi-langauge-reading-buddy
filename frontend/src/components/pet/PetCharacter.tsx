import React from 'react';
import type { PetEmotion } from '@/types/pet';

interface PetCharacterProps {
  emotion?: PetEmotion;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animate?: boolean;
}

export const PetCharacter: React.FC<PetCharacterProps> = ({
  emotion = 'happy',
  size = 'large',
  animate = true,
}) => {
  // Size mapping
  const sizeMap = {
    small: 60,
    medium: 80,
    large: 120,
    xlarge: 180,
  };

  const dimension = sizeMap[size];

  // Eye expressions based on emotion
  const getEyeExpression = () => {
    switch (emotion) {
      case 'happy':
        return {
          leftEye: { cx: 45, cy: 65, rx: 12, ry: 16 },
          rightEye: { cx: 75, cy: 65, rx: 12, ry: 16 },
          pupils: true,
          sparkle: true,
        };
      case 'excited':
      case 'love':
        return {
          leftEye: { cx: 45, cy: 65, rx: 14, ry: 18 },
          rightEye: { cx: 75, cy: 65, rx: 14, ry: 18 },
          pupils: true,
          sparkle: true,
          hearts: emotion === 'love',
        };
      case 'sad':
        return {
          leftEye: { cx: 45, cy: 68, rx: 10, ry: 14 },
          rightEye: { cx: 75, cy: 68, rx: 10, ry: 14 },
          pupils: true,
          sparkle: false,
        };
      case 'angry':
        return {
          leftEye: { cx: 45, cy: 65, rx: 10, ry: 12 },
          rightEye: { cx: 75, cy: 65, rx: 10, ry: 12 },
          pupils: true,
          sparkle: false,
          angry: true,
        };
      case 'bored':
        return {
          leftEye: { cx: 45, cy: 70, rx: 12, ry: 6 },
          rightEye: { cx: 75, cy: 70, rx: 12, ry: 6 },
          pupils: false,
          sparkle: false,
        };
      case 'hungry':
        return {
          leftEye: { cx: 45, cy: 65, rx: 11, ry: 15 },
          rightEye: { cx: 75, cy: 65, rx: 11, ry: 15 },
          pupils: true,
          sparkle: false,
        };
      default:
        return {
          leftEye: { cx: 45, cy: 65, rx: 12, ry: 16 },
          rightEye: { cx: 75, cy: 65, rx: 12, ry: 16 },
          pupils: true,
          sparkle: false,
        };
    }
  };

  // Mouth expressions based on emotion
  const getMouthPath = () => {
    switch (emotion) {
      case 'happy':
        return 'M 45 85 Q 60 95 75 85'; // Happy smile
      case 'excited':
        return 'M 45 85 Q 60 100 75 85'; // Wide smile
      case 'love':
        return 'M 48 85 Q 60 92 72 85'; // Gentle smile
      case 'sad':
        return 'M 45 95 Q 60 88 75 95'; // Frown
      case 'angry':
        return 'M 45 90 L 75 90'; // Straight line
      case 'bored':
        return 'M 50 88 L 70 88'; // Small line
      case 'hungry':
        return 'M 50 85 Q 60 90 70 85'; // Small smile
      default:
        return 'M 45 85 Q 60 92 75 85';
    }
  };

  const eyeExpression = getEyeExpression();
  const mouthPath = getMouthPath();

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 120 140"
      className={animate ? 'pet-character' : ''}
      style={{ display: 'inline-block' }}
    >
      {/* Body (yellow rounded rectangle) */}
      <rect
        x="20"
        y="50"
        width="80"
        height="70"
        rx="35"
        ry="35"
        fill="#FFE66D"
        stroke="#2C5F8D"
        strokeWidth="3"
      />

      {/* Ears (blue rounded shapes on top) */}
      <ellipse
        cx="35"
        cy="35"
        rx="18"
        ry="28"
        fill="#2C5F8D"
        stroke="#2C5F8D"
        strokeWidth="2"
      />
      <ellipse
        cx="85"
        cy="35"
        rx="18"
        ry="28"
        fill="#2C5F8D"
        stroke="#2C5F8D"
        strokeWidth="2"
      />

      {/* Head (yellow circle overlapping body) */}
      <circle
        cx="60"
        cy="70"
        r="38"
        fill="#FFE66D"
        stroke="#2C5F8D"
        strokeWidth="3"
      />

      {/* Left Eye (white oval with blue iris and black pupil) */}
      <ellipse
        cx={eyeExpression.leftEye.cx}
        cy={eyeExpression.leftEye.cy}
        rx={eyeExpression.leftEye.rx}
        ry={eyeExpression.leftEye.ry}
        fill="#FFFFFF"
        stroke="#2C5F8D"
        strokeWidth="2"
      />
      {/* Left Iris */}
      <ellipse
        cx={eyeExpression.leftEye.cx}
        cy={eyeExpression.leftEye.cy}
        rx={eyeExpression.leftEye.rx * 0.7}
        ry={eyeExpression.leftEye.ry * 0.7}
        fill="#2C5F8D"
      />
      {/* Left Pupil */}
      {eyeExpression.pupils && (
        <>
          <circle
            cx={eyeExpression.leftEye.cx - 2}
            cy={eyeExpression.leftEye.cy - 2}
            r={eyeExpression.leftEye.rx * 0.35}
            fill="#000000"
          />
          {eyeExpression.sparkle && (
            <circle
              cx={eyeExpression.leftEye.cx + 3}
              cy={eyeExpression.leftEye.cy - 5}
              r={2}
              fill="#FFFFFF"
            />
          )}
        </>
      )}

      {/* Right Eye */}
      <ellipse
        cx={eyeExpression.rightEye.cx}
        cy={eyeExpression.rightEye.cy}
        rx={eyeExpression.rightEye.rx}
        ry={eyeExpression.rightEye.ry}
        fill="#FFFFFF"
        stroke="#2C5F8D"
        strokeWidth="2"
      />
      {/* Right Iris */}
      <ellipse
        cx={eyeExpression.rightEye.cx}
        cy={eyeExpression.rightEye.cy}
        rx={eyeExpression.rightEye.rx * 0.7}
        ry={eyeExpression.rightEye.ry * 0.7}
        fill="#2C5F8D"
      />
      {/* Right Pupil */}
      {eyeExpression.pupils && (
        <>
          <circle
            cx={eyeExpression.rightEye.cx - 2}
            cy={eyeExpression.rightEye.cy - 2}
            r={eyeExpression.rightEye.rx * 0.35}
            fill="#000000"
          />
          {eyeExpression.sparkle && (
            <circle
              cx={eyeExpression.rightEye.cx + 3}
              cy={eyeExpression.rightEye.cy - 5}
              r={2}
              fill="#FFFFFF"
            />
          )}
        </>
      )}

      {/* Angry eyebrows */}
      {eyeExpression.angry && (
        <>
          <line
            x1="35"
            y1="55"
            x2="50"
            y2="58"
            stroke="#2C5F8D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="58"
            x2="85"
            y2="55"
            stroke="#2C5F8D"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Rosy cheeks (pink circles) */}
      <ellipse
        cx="28"
        cy="80"
        rx="8"
        ry="6"
        fill="#FFB3BA"
        opacity="0.7"
      />
      <ellipse
        cx="92"
        cy="80"
        rx="8"
        ry="6"
        fill="#FFB3BA"
        opacity="0.7"
      />

      {/* Mouth (curved path) */}
      <path
        d={mouthPath}
        fill="none"
        stroke="#2C5F8D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Love hearts (floating above head) */}
      {eyeExpression.hearts && (
        <>
          <path
            d="M 35 30 C 35 25 30 22 26 22 C 22 22 20 25 20 28 C 20 32 24 36 30 40 C 36 36 40 32 40 28 C 40 25 38 22 34 22 C 30 22 25 25 25 30"
            fill="#FF6B9D"
            opacity="0.8"
            className="heart-float"
          />
          <path
            d="M 85 25 C 85 21 81 19 78 19 C 75 19 73 21 73 24 C 73 27 76 30 81 33 C 86 30 89 27 89 24 C 89 21 87 19 84 19 C 81 19 77 21 77 25"
            fill="#FF6B9D"
            opacity="0.8"
            className="heart-float-delayed"
          />
        </>
      )}

      {/* Arms (simple rounded rectangles) */}
      <rect
        x="8"
        y="70"
        width="12"
        height="35"
        rx="6"
        ry="6"
        fill="#FFE66D"
        stroke="#2C5F8D"
        strokeWidth="3"
      />
      <rect
        x="100"
        y="70"
        width="12"
        height="35"
        rx="6"
        ry="6"
        fill="#FFE66D"
        stroke="#2C5F8D"
        strokeWidth="3"
      />

      {/* Legs (simple rounded rectangles) */}
      <rect
        x="35"
        y="115"
        width="14"
        height="20"
        rx="7"
        ry="7"
        fill="#FFE66D"
        stroke="#2C5F8D"
        strokeWidth="3"
      />
      <rect
        x="71"
        y="115"
        width="14"
        height="20"
        rx="7"
        ry="7"
        fill="#FFE66D"
        stroke="#2C5F8D"
        strokeWidth="3"
      />

      {/* Animations */}
      <style>{`
        .pet-character {
          animation: gentle-bounce 2s ease-in-out infinite;
        }

        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .heart-float {
          animation: float-up 2s ease-in-out infinite;
        }

        .heart-float-delayed {
          animation: float-up 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-15px);
            opacity: 0;
          }
        }
      `}</style>
    </svg>
  );
};
