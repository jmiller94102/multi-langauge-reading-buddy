import React from 'react';
import { WordAudioButton } from './WordAudioButton';
import { KoreanPhoneticsPanel } from './KoreanPhoneticsPanel';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface InteractiveTextProps {
  text: string;
  language: 'english' | 'korean';
  theme: ThemeStyle;
  audioEnabled: boolean;
  koreanPhoneticsEnabled?: boolean;
  blendLevel?: number; // 0-10 for Korean blend level
  phoneticDisplayType?: 'simplified' | 'IPA' | 'both';
  onUsageTracked?: (data: { action: string; word: string; success: boolean }) => void;
  onKoreanUsageTracked?: (data: { action: string; korean: string; success: boolean }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({
  text,
  language,
  theme,
  audioEnabled,
  koreanPhoneticsEnabled = false,
  blendLevel = 0,
  phoneticDisplayType = 'both',
  onUsageTracked,
  onKoreanUsageTracked,
  className,
  style
}) => {
  // Split text into words while preserving punctuation and spacing
  const tokenizeText = (text: string) => {
    // Split on word boundaries but keep the separators
    return text.split(/(\s+|[.,!?;:()"\-—])/);
  };

  const tokens = tokenizeText(text);

  const renderToken = (token: string, index: number) => {
    // Check if token is a word (contains letters)
    const isEnglishWord = /[a-zA-Z]/.test(token);
    const isKoreanWord = /[가-힣]/.test(token);
    const isWord = isEnglishWord || isKoreanWord;
    
    if (isWord) {
      // Korean word with phonetics support
      if (isKoreanWord && koreanPhoneticsEnabled) {
        return (
          <KoreanPhoneticsPanel
            key={index}
            koreanText={token}
            displayType={phoneticDisplayType}
            onPhoneticsModeChange={() => {}} // Placeholder for mode changes
            autoPlayAudio={blendLevel <= 5} // Auto-play for lower levels
            theme={theme}
            blendLevel={blendLevel}
            enabled={koreanPhoneticsEnabled}
            onUsageTracked={onKoreanUsageTracked}
          />
        );
      }
      
      // English word with audio support
      if (isEnglishWord && audioEnabled) {
        return (
          <WordAudioButton
            key={index}
            word={token}
            language={language}
            theme={theme}
            enabled={audioEnabled}
            onUsageTracked={onUsageTracked}
          />
        );
      }
      
      // Korean word without phonetics (fallback)
      if (isKoreanWord && !koreanPhoneticsEnabled) {
        return <span key={index} style={{ color: theme.accent }}>{token}</span>;
      }
    }
    
    // Return punctuation, spaces, or non-word tokens as-is
    return <span key={index}>{token}</span>;
  };

  return (
    <div className={className} style={style}>
      {tokens.map((token, index) => renderToken(token, index))}
    </div>
  );
};
