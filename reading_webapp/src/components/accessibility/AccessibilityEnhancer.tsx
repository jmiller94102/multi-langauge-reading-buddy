import React, { useEffect, useCallback, useState } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityEnhancerProps {
  theme: ThemeStyle;
  children: React.ReactNode;
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

export const AccessibilityEnhancer: React.FC<AccessibilityEnhancerProps> = ({
  theme,
  children,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderMode: false,
    keyboardNavigation: true
  });
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  // Load accessibility settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('readquest_accessibility');
      if (saved) {
        const savedSettings = JSON.parse(saved);
        setSettings(savedSettings);
        applyAccessibilitySettings(savedSettings);
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }, []);

  // Apply accessibility settings to the DOM
  const applyAccessibilitySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (newSettings.highContrast) {
      root.style.setProperty('--accessibility-contrast', '1.5');
      root.classList.add('high-contrast');
    } else {
      root.style.removeProperty('--accessibility-contrast');
      root.classList.remove('high-contrast');
    }

    // Large text mode
    if (newSettings.largeText) {
      root.style.setProperty('--accessibility-text-scale', '1.25');
      root.classList.add('large-text');
    } else {
      root.style.removeProperty('--accessibility-text-scale');
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--accessibility-motion', 'none');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--accessibility-motion');
      root.classList.remove('reduced-motion');
    }

    // Screen reader mode
    if (newSettings.screenReaderMode) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }, []);

  // Update settings and persist
  const updateSettings = useCallback((newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    applyAccessibilitySettings(newSettings);
    
    try {
      localStorage.setItem('readquest_accessibility', JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }

    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  }, [applyAccessibilitySettings, onSettingsChange]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A: Toggle accessibility panel
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setShowAccessibilityPanel(prev => !prev);
        announceToScreenReader(
          showAccessibilityPanel 
            ? 'Accessibility panel closed' 
            : 'Accessibility panel opened'
        );
      }

      // Escape: Close accessibility panel
      if (event.key === 'Escape' && showAccessibilityPanel) {
        setShowAccessibilityPanel(false);
        announceToScreenReader('Accessibility panel closed');
      }

      // Tab navigation enhancement
      if (event.key === 'Tab') {
        const focusableElements = getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
        
        if (event.shiftKey) {
          // Shift + Tab (previous)
          if (currentIndex <= 0) {
            event.preventDefault();
            focusableElements[focusableElements.length - 1]?.focus();
          }
        } else {
          // Tab (next)
          if (currentIndex >= focusableElements.length - 1) {
            event.preventDefault();
            focusableElements[0]?.focus();
          }
        }
      }

      // Arrow key navigation for quiz options
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        const quizOptions = document.querySelectorAll('[role="radio"], [role="option"]');
        if (quizOptions.length > 0) {
          const currentIndex = Array.from(quizOptions).indexOf(document.activeElement as Element);
          if (currentIndex >= 0) {
            event.preventDefault();
            let nextIndex;
            
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
              nextIndex = (currentIndex + 1) % quizOptions.length;
            } else {
              nextIndex = currentIndex === 0 ? quizOptions.length - 1 : currentIndex - 1;
            }
            
            (quizOptions[nextIndex] as HTMLElement).focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, showAccessibilityPanel]);

  // Get all focusable elements
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="radio"]:not([disabled])',
      '[role="option"]:not([disabled])'
    ].join(', ');

    return Array.from(document.querySelectorAll(selectors)) as HTMLElement[];
  }, []);

  // Screen reader announcements
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Focus management
  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target.id || target.getAttribute('data-testid')) {
        setFocusedElement(target.id || target.getAttribute('data-testid') || 'unknown');
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  return (
    <>
      {/* Accessibility Panel Toggle */}
      <button
        onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: `${theme.primary}e0`,
          color: theme.text,
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: `0 4px 12px ${theme.primary}40`,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Toggle accessibility options (Alt + A)"
        title="Accessibility Options (Alt + A)"
      >
        ♿
      </button>

      {/* Accessibility Panel */}
      {showAccessibilityPanel && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: theme.background,
            border: `2px solid ${theme.primary}`,
            borderRadius: '12px',
            padding: '20px',
            zIndex: 1001,
            boxShadow: `0 8px 24px ${theme.primary}40`,
            minWidth: '280px',
            maxWidth: '320px'
          }}
          role="dialog"
          aria-labelledby="accessibility-panel-title"
          aria-modal="true"
        >
          <h3 
            id="accessibility-panel-title"
            style={{ 
              margin: '0 0 16px 0', 
              color: theme.text,
              fontSize: '18px',
              fontWeight: '600'
            }}
          >
            Accessibility Options
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* High Contrast */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSettings({ ...settings, highContrast: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
                aria-describedby="high-contrast-desc"
              />
              <span style={{ color: theme.text, fontSize: '14px' }}>High Contrast Mode</span>
            </label>
            <p id="high-contrast-desc" style={{ 
              fontSize: '12px', 
              color: `${theme.text}80`, 
              margin: '0 0 8px 24px',
              lineHeight: '1.3'
            }}>
              Increases contrast for better visibility
            </p>

            {/* Large Text */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => updateSettings({ ...settings, largeText: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
                aria-describedby="large-text-desc"
              />
              <span style={{ color: theme.text, fontSize: '14px' }}>Large Text</span>
            </label>
            <p id="large-text-desc" style={{ 
              fontSize: '12px', 
              color: `${theme.text}80`, 
              margin: '0 0 8px 24px',
              lineHeight: '1.3'
            }}>
              Makes text 25% larger for easier reading
            </p>

            {/* Reduced Motion */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSettings({ ...settings, reducedMotion: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
                aria-describedby="reduced-motion-desc"
              />
              <span style={{ color: theme.text, fontSize: '14px' }}>Reduce Motion</span>
            </label>
            <p id="reduced-motion-desc" style={{ 
              fontSize: '12px', 
              color: `${theme.text}80`, 
              margin: '0 0 8px 24px',
              lineHeight: '1.3'
            }}>
              Minimizes animations and transitions
            </p>

            {/* Screen Reader Mode */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.screenReaderMode}
                onChange={(e) => updateSettings({ ...settings, screenReaderMode: e.target.checked })}
                style={{ width: '16px', height: '16px' }}
                aria-describedby="screen-reader-desc"
              />
              <span style={{ color: theme.text, fontSize: '14px' }}>Screen Reader Mode</span>
            </label>
            <p id="screen-reader-desc" style={{ 
              fontSize: '12px', 
              color: `${theme.text}80`, 
              margin: '0 0 8px 24px',
              lineHeight: '1.3'
            }}>
              Optimizes interface for screen readers
            </p>
          </div>

          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: `1px solid ${theme.primary}20`,
            fontSize: '12px',
            color: `${theme.text}70`
          }}>
            <p style={{ margin: '0 0 4px 0' }}>Keyboard Shortcuts:</p>
            <p style={{ margin: '0' }}>Alt + A: Toggle this panel</p>
            <p style={{ margin: '0' }}>Tab/Shift+Tab: Navigate</p>
            <p style={{ margin: '0' }}>Arrow keys: Quiz options</p>
          </div>

          <button
            onClick={() => setShowAccessibilityPanel(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: theme.text,
              fontSize: '18px',
              cursor: 'pointer',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close accessibility panel"
          >
            ×
          </button>
        </div>
      )}

      {/* Screen Reader Live Region */}
      <div
        id="accessibility-announcements"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      />

      {/* Focus Indicator Enhancement */}
      {focusedElement && settings.keyboardNavigation && (
        <style>{`
          *:focus {
            outline: 3px solid ${theme.accent} !important;
            outline-offset: 2px !important;
            border-radius: 4px;
          }
          
          .high-contrast *:focus {
            outline: 4px solid #ffff00 !important;
            outline-offset: 3px !important;
          }
        `}</style>
      )}

      {/* Accessibility CSS Enhancements */}
      <style>{`
        .high-contrast {
          filter: contrast(1.5) !important;
        }
        
        .large-text {
          font-size: calc(1em * 1.25) !important;
        }
        
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .screen-reader-mode .sr-only {
          position: static !important;
          width: auto !important;
          height: auto !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
          clip: auto !important;
          white-space: normal !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @media (prefers-contrast: high) {
          * {
            filter: contrast(1.5) !important;
          }
        }
      `}</style>

      {children}
    </>
  );
};
