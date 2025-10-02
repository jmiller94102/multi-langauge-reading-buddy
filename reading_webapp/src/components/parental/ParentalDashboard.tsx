import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../../services/AnalyticsService';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface ParentalSettings {
  audioEnabled: boolean;
  hintsEnabled: boolean;
  koreanPhoneticsEnabled: boolean;
  romanizationEnabled: boolean;
  validationEnabled: boolean;
  maxSessionTime: number; // minutes
  koreanLevelLock: boolean;
  dataExportEnabled: boolean;
}

interface ParentalDashboardProps {
  theme: ThemeStyle;
  onClose: () => void;
  onSettingsChange: (settings: ParentalSettings) => void;
  currentSettings: ParentalSettings;
}

export const ParentalDashboard: React.FC<ParentalDashboardProps> = ({
  theme,
  onClose,
  onSettingsChange,
  currentSettings
}) => {
  const [settings, setSettings] = useState<ParentalSettings>(currentSettings);
  const [usageSummary, setUsageSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'privacy'>('overview');
  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    // Load usage summary
    const summary = analyticsService.getUsageSummary();
    setUsageSummary(summary);
  }, []);

  const handleSettingChange = (key: keyof ParentalSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const exportData = () => {
    const data = analyticsService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `readquest-usage-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all usage data? This cannot be undone.')) {
      analyticsService.clearAllData();
      setUsageSummary(analyticsService.getUsageSummary());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: theme.background,
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90%',
        overflow: 'hidden',
        boxShadow: `0 20px 40px ${theme.primary}20`
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          color: 'white',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            👨‍👩‍👧‍👦 Parental Dashboard
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${theme.primary}20`,
          background: `${theme.background}f0`
        }}>
          {[
            { id: 'overview', label: '📊 Usage Overview', icon: '📊' },
            { id: 'controls', label: '🎛️ Feature Controls', icon: '🎛️' },
            { id: 'privacy', label: '🔒 Privacy & Safety', icon: '🔒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: activeTab === tab.id ? theme.primary : 'transparent',
                color: activeTab === tab.id ? 'white' : theme.text,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: '20px',
          maxHeight: '500px',
          overflowY: 'auto',
          color: theme.text
        }}>
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ marginTop: 0, color: theme.accent }}>📈 Learning Progress</h3>
              
              {usageSummary && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    background: `${theme.primary}10`,
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.primary}20`
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: theme.accent }}>
                      {usageSummary.totalSessions}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Sessions</div>
                  </div>
                  
                  <div style={{
                    background: `${theme.accent}10`,
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.accent}20`
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: theme.accent }}>
                      {Math.round(usageSummary.averageSessionDuration / 60000)}m
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>Avg Session</div>
                  </div>
                </div>
              )}

              <h4 style={{ color: theme.accent }}>🎯 Most Used Features</h4>
              {usageSummary?.mostUsedFeatures.map((feature: any, index: number) => (
                <div key={feature.feature} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: index < usageSummary.mostUsedFeatures.length - 1 ? `1px solid ${theme.primary}10` : 'none'
                }}>
                  <span style={{ textTransform: 'capitalize' }}>{feature.feature.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontWeight: '600', color: theme.accent }}>{feature.usage} uses</span>
                </div>
              ))}

              <h4 style={{ color: theme.accent, marginTop: '24px' }}>🇰🇷 Korean Learning Progress</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center', padding: '12px', background: `${theme.primary}05`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: theme.primary }}>
                    {usageSummary?.koreanProgressIndicators.phoneticsRequests || 0}
                  </div>
                  <div style={{ fontSize: '12px' }}>Phonetics</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: `${theme.accent}05`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: theme.accent }}>
                    {usageSummary?.koreanProgressIndicators.romanizationRequests || 0}
                  </div>
                  <div style={{ fontSize: '12px' }}>Romanization</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: `${theme.primary}05`, borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: theme.primary }}>
                    {usageSummary?.koreanProgressIndicators.uniqueWordsEncountered || 0}
                  </div>
                  <div style={{ fontSize: '12px' }}>Words Learned</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div>
              <h3 style={{ marginTop: 0, color: theme.accent }}>🎛️ Feature Controls</h3>
              
              {[
                { key: 'audioEnabled', label: '🔊 Audio Support', desc: 'Text-to-speech and word audio' },
                { key: 'hintsEnabled', label: '💡 Quiz Hints', desc: 'Progressive hint system for quizzes' },
                { key: 'koreanPhoneticsEnabled', label: '🇰🇷 Korean Phonetics', desc: 'Pronunciation help for Korean text' },
                { key: 'romanizationEnabled', label: '📝 Romanization', desc: 'Korean text romanization display' },
                { key: 'validationEnabled', label: '✅ Answer Validation', desc: 'Real-time answer feedback' }
              ].map(feature => (
                <div key={feature.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  marginBottom: '12px',
                  background: `${theme.primary}05`,
                  borderRadius: '12px',
                  border: `1px solid ${theme.primary}10`
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{feature.label}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>{feature.desc}</div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={settings[feature.key as keyof ParentalSettings] as boolean}
                      onChange={(e) => handleSettingChange(feature.key as keyof ParentalSettings, e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    <span style={{ fontSize: '12px' }}>
                      {settings[feature.key as keyof ParentalSettings] ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              ))}

              <div style={{
                padding: '16px',
                background: `${theme.accent}05`,
                borderRadius: '12px',
                border: `1px solid ${theme.accent}10`,
                marginTop: '20px'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>⏱️ Session Time Limit</div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  value={settings.maxSessionTime}
                  onChange={(e) => handleSettingChange('maxSessionTime', parseInt(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />
                <div style={{ fontSize: '12px', textAlign: 'center' }}>
                  {settings.maxSessionTime} minutes
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3 style={{ marginTop: 0, color: theme.accent }}>🔒 Privacy & Safety</h3>
              
              <div style={{
                background: `${theme.primary}05`,
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: `1px solid ${theme.primary}10`
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: theme.primary }}>🛡️ Data Protection</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>All data stored locally on this device only</li>
                  <li>No personal information transmitted to external servers</li>
                  <li>Usage analytics are aggregated and anonymous</li>
                  <li>Content filtering ensures age-appropriate responses</li>
                </ul>
              </div>

              <div style={{
                background: `${theme.accent}05`,
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: `1px solid ${theme.accent}10`
              }}>
                <h4 style={{ margin: '0 0 12px 0', color: theme.accent }}>📊 Performance Metrics</h4>
                {usageSummary?.performanceSummary && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: theme.accent }}>
                        {Math.round(usageSummary.performanceSummary.averageApiResponseTime)}ms
                      </div>
                      <div>Avg Response</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: theme.primary }}>
                        {Math.round(usageSummary.performanceSummary.cacheEfficiency)}%
                      </div>
                      <div>Cache Efficiency</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: theme.accent }}>
                        {Math.round(usageSummary.performanceSummary.errorRate)}%
                      </div>
                      <div>Error Rate</div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={exportData}
                  style={{
                    flex: 1,
                    background: theme.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  📤 Export Data
                </button>
                <button
                  onClick={clearAllData}
                  style={{
                    flex: 1,
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  🗑️ Clear Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
