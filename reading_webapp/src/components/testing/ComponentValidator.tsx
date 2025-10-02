import React, { useState } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface ValidationResult {
  component: string;
  status: 'pass' | 'fail' | 'warning' | 'testing';
  message: string;
  timestamp: number;
}

interface ComponentValidatorProps {
  theme: ThemeStyle;
  onValidationComplete?: (results: ValidationResult[]) => void;
}

export const ComponentValidator: React.FC<ComponentValidatorProps> = ({
  theme,
  onValidationComplete
}) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Frontend-only validation tests (no backend calls)
  const runValidationTests = async () => {
    setIsRunning(true);
    const results: ValidationResult[] = [];

    // Test 1: Check if required components exist in DOM
    setCurrentTest('Component Existence Check');
    await delay(500);
    
    try {
      const audioButtons = document.querySelectorAll('[data-testid="audio-button"]');
      const quizHints = document.querySelectorAll('[data-testid="quiz-hint"]');
      
      results.push({
        component: 'Audio Components',
        status: audioButtons.length > 0 ? 'pass' : 'warning',
        message: audioButtons.length > 0 
          ? `Found ${audioButtons.length} audio components`
          : 'No audio components found in DOM',
        timestamp: Date.now()
      });

      results.push({
        component: 'Quiz Hints',
        status: quizHints.length > 0 ? 'pass' : 'warning',
        message: quizHints.length > 0 
          ? `Found ${quizHints.length} quiz hint components`
          : 'No quiz hint components found in DOM',
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        component: 'DOM Check',
        status: 'fail',
        message: `DOM validation failed: ${error}`,
        timestamp: Date.now()
      });
    }

    // Test 2: Theme Integration Check
    setCurrentTest('Theme Integration Check');
    await delay(500);

    try {
      const hasValidTheme = theme.primary && theme.accent && theme.text && theme.background;
      results.push({
        component: 'Theme System',
        status: hasValidTheme ? 'pass' : 'fail',
        message: hasValidTheme 
          ? 'Theme properties are properly defined'
          : 'Missing required theme properties',
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        component: 'Theme System',
        status: 'fail',
        message: `Theme validation failed: ${error}`,
        timestamp: Date.now()
      });
    }

    // Test 3: Local Storage Functionality
    setCurrentTest('Local Storage Check');
    await delay(500);

    try {
      const testKey = 'readquest_validation_test';
      const testValue = JSON.stringify({ test: true, timestamp: Date.now() });
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      results.push({
        component: 'Local Storage',
        status: retrieved === testValue ? 'pass' : 'fail',
        message: retrieved === testValue 
          ? 'Local storage read/write working correctly'
          : 'Local storage functionality impaired',
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        component: 'Local Storage',
        status: 'fail',
        message: `Local storage test failed: ${error}`,
        timestamp: Date.now()
      });
    }

    // Test 4: Analytics Service Check
    setCurrentTest('Analytics Service Check');
    await delay(500);

    try {
      // Check if analytics data structure exists
      const analyticsData = localStorage.getItem('readquest_analytics');
      const hasAnalytics = analyticsData !== null;
      
      results.push({
        component: 'Analytics Service',
        status: hasAnalytics ? 'pass' : 'warning',
        message: hasAnalytics 
          ? 'Analytics service data found'
          : 'No analytics data found (expected for new sessions)',
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        component: 'Analytics Service',
        status: 'fail',
        message: `Analytics service check failed: ${error}`,
        timestamp: Date.now()
      });
    }

    // Test 5: Responsive Design Check
    setCurrentTest('Responsive Design Check');
    await delay(500);

    try {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      const isMobile = viewport.width < 768;
      const isTablet = viewport.width >= 768 && viewport.width < 1024;
      
      results.push({
        component: 'Responsive Design',
        status: 'pass',
        message: `Viewport: ${viewport.width}x${viewport.height} (${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'})`,
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        component: 'Responsive Design',
        status: 'fail',
        message: `Responsive design check failed: ${error}`,
        timestamp: Date.now()
      });
    }

    // Test 6: Performance Check
    setCurrentTest('Performance Check');
    await delay(500);

    try {
      const performanceData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = performanceData ? performanceData.loadEventEnd - performanceData.loadEventStart : 0;
      
      results.push({
        component: 'Performance',
        status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
        message: `Page load time: ${loadTime}ms`,
        timestamp: Date.now()
      });
    } catch (error) {
      results.push({
        component: 'Performance',
        status: 'warning',
        message: 'Performance metrics unavailable',
        timestamp: Date.now()
      });
    }

    setValidationResults(results);
    setIsRunning(false);
    setCurrentTest('');
    
    if (onValidationComplete) {
      onValidationComplete(results);
    }
  };

  // Helper function for delays
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return '#4ecdc4';
      case 'fail': return '#ff6b6b';
      case 'warning': return '#ffa726';
      case 'testing': return theme.accent;
      default: return theme.text;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
      case 'testing': return '🔄';
      default: return '❓';
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: `${theme.background}f0`,
      borderRadius: '16px',
      border: `1px solid ${theme.primary}20`,
      maxWidth: '600px'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🧪 Component Validation
      </h3>

      {/* Test Controls */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={runValidationTests}
          disabled={isRunning}
          style={{
            background: isRunning 
              ? `${theme.primary}60` 
              : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isRunning ? '🔄' : '▶️'} 
          {isRunning ? 'Running Tests...' : 'Run Validation Tests'}
        </button>
      </div>

      {/* Current Test Display */}
      {isRunning && currentTest && (
        <div style={{
          background: `${theme.accent}10`,
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: `1px solid ${theme.accent}30`
        }}>
          <div style={{
            fontSize: '14px',
            color: theme.accent,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔄 {currentTest}
          </div>
        </div>
      )}

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <div>
          <h4 style={{
            margin: '0 0 12px 0',
            color: theme.accent,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Test Results
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {validationResults.map((result, index) => (
              <div
                key={index}
                style={{
                  background: `${getStatusColor(result.status)}10`,
                  border: `1px solid ${getStatusColor(result.status)}30`,
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '16px', marginTop: '2px' }}>
                  {getStatusIcon(result.status)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: '4px'
                  }}>
                    {result.component}
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: `${theme.text}80`,
                    lineHeight: '1.4'
                  }}>
                    {result.message}
                  </div>
                </div>

                <div style={{
                  fontSize: '10px',
                  color: `${theme.text}60`,
                  whiteSpace: 'nowrap'
                }}>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: `${theme.primary}05`,
            borderRadius: '8px',
            border: `1px solid ${theme.primary}10`
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme.text,
              marginBottom: '4px'
            }}>
              Summary: {validationResults.filter(r => r.status === 'pass').length} passed, {' '}
              {validationResults.filter(r => r.status === 'warning').length} warnings, {' '}
              {validationResults.filter(r => r.status === 'fail').length} failed
            </div>
            
            <div style={{
              fontSize: '12px',
              color: `${theme.text}70`
            }}>
              Frontend validation complete. All tests check UI/UX functionality only.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
