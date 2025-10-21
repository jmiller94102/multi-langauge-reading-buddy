import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { PetCharacter } from '@/components/pet/PetCharacter';
import { EVOLUTION_STAGE_NAMES } from '@/data/petEvolution';
import { mockUser, mockPet } from '@/utils/mockData';
import type { PetEvolutionTrack } from '@/types/pet';
import type { UserSettings } from '@/types/user';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);
  const [pet, setPet] = useState(mockPet);
  const [petName, setPetName] = useState(pet.name);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Track which settings sections are expanded (for mobile)
  const [expandedSections, setExpandedSections] = useState({
    language: true,
    learning: true,
    theme: true,
    sound: true,
    notifications: true,
    data: true,
    advanced: false,
  });

  const handleSettingChange = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    setUser((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleTrackChange = (newTrack: PetEvolutionTrack) => {
    if (newTrack === pet.evolutionTrack) return;

    const confirmed = window.confirm(
      `Change evolution track from ${pet.evolutionTrack} to ${newTrack}?\n\nYour pet will evolve into a new form at the next level. This action is permanent.`
    );

    if (confirmed) {
      setPet((prev) => ({ ...prev, evolutionTrack: newTrack }));
      setHasUnsavedChanges(true);
    }
  };

  const handlePetNameChange = (newName: string) => {
    if (newName.length <= 15) {
      setPetName(newName);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveChanges = () => {
    // Update pet name
    setPet((prev) => ({ ...prev, name: petName }));

    // TODO: Save to localStorage or API
    console.log('Saving changes:', { user, pet, petName });

    setHasUnsavedChanges(false);
    setShowSaveSuccess(true);

    // Hide success message after 2 seconds
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleDiscardChanges = () => {
    // Reset to mock data
    setUser(mockUser);
    setPet(mockPet);
    setPetName(mockPet.name);
    setHasUnsavedChanges(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <PageLayout>
      <div className="space-y-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="card space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden="true">👤</span>
            <div>
              <h1 className="text-child-xl font-bold text-gray-900">Profile & Settings</h1>
              <p className="text-child-xs text-gray-600">Customize your learning experience</p>
            </div>
          </div>
        </div>

        {/* Save Success Notification */}
        {showSaveSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
            <span className="text-child-sm font-bold">✓ Settings saved successfully!</span>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Settings */}
          <div className="lg:col-span-7 space-y-4">
            {/* User Profile */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">👤 User Profile</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-child-base font-bold text-gray-900">{user.name}</p>
                  <p className="text-child-xs text-gray-600">4th Grade</p>
                </div>
                <button className="btn-ghost text-child-xs">Change</button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-child-xs">
                <div>
                  <p className="text-gray-600">Joined</p>
                  <p className="font-semibold text-gray-900">20 days ago</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Sessions</p>
                  <p className="font-semibold text-gray-900">{user.stats.totalReadings}</p>
                </div>
              </div>
            </div>

            {/* Language Preferences */}
            <div className="card">
              <button
                onClick={() => toggleSection('language')}
                className="w-full flex items-center justify-between text-child-lg font-bold text-gray-900 mb-3"
              >
                <span>🌍 Language Preferences</span>
                <span className="lg:hidden">{expandedSections.language ? '▼' : '▶'}</span>
              </button>

              {expandedSections.language && (
                <div className="space-y-3">
                  <div>
                    <p className="text-child-xs font-semibold text-gray-700 mb-2">Primary Language:</p>
                    <label className="flex items-center gap-2 text-child-xs">
                      <input type="radio" checked readOnly />
                      <span>English</span>
                    </label>
                  </div>

                  <div>
                    <p className="text-child-xs font-semibold text-gray-700 mb-2">Secondary Language:</p>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-child-xs">
                        <input
                          type="radio"
                          checked={user.settings.secondaryLanguage === 'ko'}
                          onChange={() => handleSettingChange('secondaryLanguage', 'ko')}
                        />
                        <span>🇰🇷 Korean</span>
                      </label>
                      <label className="flex items-center gap-2 text-child-xs">
                        <input
                          type="radio"
                          checked={user.settings.secondaryLanguage === 'zh'}
                          onChange={() => handleSettingChange('secondaryLanguage', 'zh')}
                        />
                        <span>🇨🇳 Mandarin</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-child-xs mb-1">
                      <span className="font-semibold text-gray-700">Default Blend Level:</span>
                      <span className="font-bold text-primary-600">{user.settings.languageBlendLevel}/10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={user.settings.languageBlendLevel}
                      onChange={(e) => handleSettingChange('languageBlendLevel', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600">
                      <span>0% (English)</span>
                      <span>50%</span>
                      <span>100% ({user.settings.secondaryLanguage === 'ko' ? 'Korean' : 'Mandarin'})</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-child-xs font-semibold text-gray-700 mb-1">Display Options:</p>
                    <label className="flex items-center gap-2 text-child-xs">
                      <input
                        type="checkbox"
                        checked={user.settings.showHints}
                        onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                      />
                      <span>Show translation hints</span>
                    </label>
                    <label className="flex items-center gap-2 text-child-xs">
                      <input
                        type="checkbox"
                        checked={user.settings.showRomanization}
                        onChange={(e) => handleSettingChange('showRomanization', e.target.checked)}
                      />
                      <span>Show romanization</span>
                    </label>
                    <label className="flex items-center gap-2 text-child-xs">
                      <input
                        type="checkbox"
                        checked={user.settings.audioEnabled}
                        onChange={(e) => handleSettingChange('audioEnabled', e.target.checked)}
                      />
                      <span>Audio support</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Theme & Appearance */}
            <div className="card">
              <button
                onClick={() => toggleSection('theme')}
                className="w-full flex items-center justify-between text-child-lg font-bold text-gray-900 mb-3"
              >
                <span>🎨 Theme & Appearance</span>
                <span className="lg:hidden">{expandedSections.theme ? '▼' : '▶'}</span>
              </button>

              {expandedSections.theme && (
                <div className="space-y-3">
                  <div>
                    <p className="text-child-xs font-semibold text-gray-700 mb-2">Visual Theme:</p>
                    <div className="space-y-1">
                      {['space', 'jungle', 'ocean', 'minecraft', 'tron'].map((theme) => (
                        <label key={theme} className="flex items-center gap-2 text-child-xs">
                          <input
                            type="radio"
                            checked={user.settings.theme === theme}
                            onChange={() => handleSettingChange('theme', theme as any)}
                          />
                          <span className="capitalize">
                            {theme === 'space' && '🚀 Space'}
                            {theme === 'jungle' && '🌴 Jungle'}
                            {theme === 'ocean' && '🌊 Deep Sea'}
                            {theme === 'minecraft' && '⛏️ Minecraft'}
                            {theme === 'tron' && '💠 Tron'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-child-xs font-semibold text-gray-700 mb-2">Font Size:</p>
                    <div className="flex gap-3">
                      {(['normal', 'large', 'xlarge'] as const).map((size) => (
                        <label key={size} className="flex items-center gap-2 text-child-xs">
                          <input
                            type="radio"
                            checked={user.settings.fontSize === size}
                            onChange={() => handleSettingChange('fontSize', size)}
                          />
                          <span className="capitalize">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-child-xs font-semibold text-gray-700 mb-1">Accessibility:</p>
                    <label className="flex items-center gap-2 text-child-xs">
                      <input
                        type="checkbox"
                        checked={user.settings.highContrast}
                        onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      />
                      <span>High contrast mode</span>
                    </label>
                    <label className="flex items-center gap-2 text-child-xs">
                      <input
                        type="checkbox"
                        checked={user.settings.reducedMotion}
                        onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      />
                      <span>Reduce motion</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Sound & Audio */}
            <div className="card">
              <button
                onClick={() => toggleSection('sound')}
                className="w-full flex items-center justify-between text-child-lg font-bold text-gray-900 mb-3"
              >
                <span>🔊 Sound & Audio</span>
                <span className="lg:hidden">{expandedSections.sound ? '▼' : '▶'}</span>
              </button>

              {expandedSections.sound && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-child-xs mb-1">
                      <span className="font-semibold text-gray-700">Audio Speed:</span>
                      <span className="font-bold text-primary-600">{user.settings.audioSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={user.settings.audioSpeed}
                      onChange={(e) => handleSettingChange('audioSpeed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600">
                      <span>0.5x (Slower)</span>
                      <span>1.0x (Normal)</span>
                      <span>2.0x (Faster)</span>
                    </div>
                  </div>

                  <p className="text-child-xs text-gray-600 italic">More audio settings coming soon!</p>
                </div>
              )}
            </div>

            {/* Data & Privacy */}
            <div className="card">
              <button
                onClick={() => toggleSection('data')}
                className="w-full flex items-center justify-between text-child-lg font-bold text-gray-900 mb-3"
              >
                <span>📊 Data & Privacy</span>
                <span className="lg:hidden">{expandedSections.data ? '▼' : '▶'}</span>
              </button>

              {expandedSections.data && (
                <div className="space-y-3">
                  <div>
                    <p className="text-child-xs text-gray-600">Data Usage:</p>
                    <p className="text-child-xs text-gray-900">• Local storage: 2.5 MB</p>
                    <p className="text-child-xs text-gray-900">• Images cached: 8.2 MB</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="btn-ghost text-child-xs">Clear Cache</button>
                    <button className="btn-ghost text-child-xs">Export All Data</button>
                    <button className="btn-ghost text-child-xs text-red-600">Delete Account</button>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Settings */}
            <div className="card">
              <button
                onClick={() => toggleSection('advanced')}
                className="w-full flex items-center justify-between text-child-lg font-bold text-gray-900 mb-3"
              >
                <span>⚙️ Advanced</span>
                <span className="lg:hidden">{expandedSections.advanced ? '▼' : '▶'}</span>
              </button>

              {expandedSections.advanced && (
                <div className="space-y-3">
                  <p className="text-child-xs text-gray-600">App Version: 2.0.0</p>
                  <div className="flex flex-col gap-2">
                    <button className="btn-ghost text-child-xs">Check for Updates</button>
                    <button className="btn-ghost text-child-xs">Reset All Settings</button>
                    <button className="btn-ghost text-child-xs">Restore Defaults</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pet Customization */}
          <div className="lg:col-span-5 space-y-4">
            {/* Pet Customization */}
            <div className="card">
              <h2 className="text-child-lg font-bold text-gray-900 mb-3">🐾 Pet Customization</h2>
              <div className="space-y-3">
                {/* Pet Preview */}
                <div className="text-center py-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <PetCharacter emotion={pet.emotion} size="large" animate={true} />
                  </div>
                  <p className="text-child-sm font-bold text-gray-900">{pet.name}</p>
                  <p className="text-child-xs text-gray-600">
                    {EVOLUTION_STAGE_NAMES[pet.evolutionTrack][pet.evolutionStage]} • Level {user.level}
                  </p>
                </div>

                {/* Evolution Track Selection */}
                <div>
                  <p className="text-child-xs font-semibold text-gray-700 mb-2">Evolution Track:</p>
                  <div className="space-y-1">
                    {(['knowledge', 'coolness', 'culture'] as const).map((track) => (
                      <label key={track} className="flex items-center gap-2 text-child-xs">
                        <input
                          type="radio"
                          checked={pet.evolutionTrack === track}
                          onChange={() => handleTrackChange(track)}
                        />
                        <span className="capitalize">
                          {track === 'knowledge' && '🎓 Knowledge'}
                          {track === 'coolness' && '😎 Coolness'}
                          {track === 'culture' && '🌍 Culture'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pet Name */}
                <div>
                  <label className="text-child-xs font-semibold text-gray-700 mb-1 block">Pet Name:</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => handlePetNameChange(e.target.value)}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-child-sm"
                    placeholder="Enter pet name..."
                  />
                  <p className="text-[10px] text-gray-600 mt-1">
                    {petName.length}/15 characters
                    {petName.length < 3 && petName.length > 0 && (
                      <span className="text-red-600 ml-2">• Name must be at least 3 characters</span>
                    )}
                  </p>
                </div>

                {/* Accessories (placeholder) */}
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-child-xs font-semibold text-gray-700 mb-2">Owned Accessories: 0</p>
                  <button onClick={() => navigate('/shop')} className="btn-primary w-full text-child-xs">
                    Visit Shop →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {hasUnsavedChanges && (
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button onClick={handleDiscardChanges} className="btn-ghost">
                Discard Changes
              </button>
              <button onClick={handleSaveChanges} className="btn-primary">
                Save All Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
