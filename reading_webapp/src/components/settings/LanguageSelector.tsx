import React from 'react';

interface LanguageOption {
  code: string; // 'ko', 'ja', 'zh', 'it', 'es', 'ar'
  name: string; // 'Korean', 'Japanese', etc.
  nativeName: string; // '한국어', '日本語', etc.
  flag: string; // Emoji flag
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onChange: (language: string) => void;
  disabled?: boolean;
}

const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵'
  },
  {
    code: 'zh',
    name: 'Mandarin',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦'
  }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onChange,
  disabled = false
}) => {
  const selectedOption = AVAILABLE_LANGUAGES.find(lang => lang.name === currentLanguage) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="language-selector">
      <label
        htmlFor="secondary-language"
        style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 500,
          fontSize: '14px'
        }}
      >
        Secondary Language
      </label>

      <select
        id="secondary-language"
        value={currentLanguage}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease',
          minHeight: '44px', // Child-friendly touch target
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          backgroundSize: '20px',
          paddingRight: '40px'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option
            key={lang.code}
            value={lang.name}
            style={{
              backgroundColor: '#1a1a2e',
              color: 'white',
              padding: '12px'
            }}
          >
            {lang.flag} {lang.name} ({lang.nativeName})
          </option>
        ))}
      </select>

      {/* Language Description */}
      <p
        style={{
          marginTop: '8px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontStyle: 'italic'
        }}
      >
        Selected: {selectedOption.flag} {selectedOption.name} ({selectedOption.nativeName})
      </p>

      {/* Blend Level Preview */}
      <div
        style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <strong>Blend Levels:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li>Level 0: 100% English</li>
          <li>Levels 1-3: Progressive {selectedOption.name} hints</li>
          <li>Levels 4-5: Mixed English-{selectedOption.name} sentences</li>
          <li>Level 6: 100% {selectedOption.name}</li>
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
