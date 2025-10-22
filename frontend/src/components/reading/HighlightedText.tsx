import React, { useMemo } from 'react';

interface HighlightedTextProps {
  text: string;
  currentWordIndex: number;
  className?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  currentWordIndex,
  className = '',
}) => {
  // Split text into words while preserving punctuation
  const words = useMemo(() => {
    return text.split(/\s+/).map((word, index) => ({
      word,
      index,
    }));
  }, [text]);

  return (
    <div className={`leading-relaxed ${className}`}>
      {words.map(({ word, index }) => {
        const isHighlighted = index === currentWordIndex;

        return (
          <span
            key={index}
            className={`inline-block transition-all duration-150 ${
              isHighlighted
                ? 'bg-yellow-300 text-gray-900 font-semibold px-1 rounded scale-110 shadow-sm'
                : 'text-gray-900'
            }`}
            style={{
              transformOrigin: 'center',
            }}
          >
            {word}{' '}
          </span>
        );
      })}
    </div>
  );
};
