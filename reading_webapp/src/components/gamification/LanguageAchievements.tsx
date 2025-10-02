import React, { useState, useEffect } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'audio' | 'hints' | 'korean' | 'validation';
}

interface LanguageAchievementsProps {
  theme: ThemeStyle;
  usageData: {
    audioUsage: number;
    hintRequests: number;
    koreanAccess: number;
    validationAccuracy: number;
  };
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const LanguageAchievements: React.FC<LanguageAchievementsProps> = ({
  theme,
  usageData,
  onAchievementUnlocked
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Define all available achievements (frontend UI only)
  const allAchievements: Achievement[] = [
    // Audio Learner Badges
    {
      id: 'audio_beginner',
      title: 'Audio Learner',
      description: 'Used text-to-speech 5 times',
      icon: '🔊',
      unlocked: usageData.audioUsage >= 5,
      progress: Math.min(usageData.audioUsage, 5),
      maxProgress: 5,
      category: 'audio'
    },
    {
      id: 'audio_enthusiast',
      title: 'Sound Explorer',
      description: 'Used text-to-speech 25 times',
      icon: '🎵',
      unlocked: usageData.audioUsage >= 25,
      progress: Math.min(usageData.audioUsage, 25),
      maxProgress: 25,
      category: 'audio'
    },
    {
      id: 'audio_master',
      title: 'Audio Master',
      description: 'Used text-to-speech 100 times',
      icon: '🎼',
      unlocked: usageData.audioUsage >= 100,
      progress: Math.min(usageData.audioUsage, 100),
      maxProgress: 100,
      category: 'audio'
    },

    // Smart Questioner Badges
    {
      id: 'hint_seeker',
      title: 'Smart Questioner',
      description: 'Asked for hints 10 times',
      icon: '💡',
      unlocked: usageData.hintRequests >= 10,
      progress: Math.min(usageData.hintRequests, 10),
      maxProgress: 10,
      category: 'hints'
    },
    {
      id: 'hint_strategist',
      title: 'Hint Strategist',
      description: 'Asked for hints 50 times',
      icon: '🧠',
      unlocked: usageData.hintRequests >= 50,
      progress: Math.min(usageData.hintRequests, 50),
      maxProgress: 50,
      category: 'hints'
    },

    // Korean Explorer Badges
    {
      id: 'korean_curious',
      title: 'Korean Explorer',
      description: 'Explored Korean phonetics 15 times',
      icon: '🇰🇷',
      unlocked: usageData.koreanAccess >= 15,
      progress: Math.min(usageData.koreanAccess, 15),
      maxProgress: 15,
      category: 'korean'
    },
    {
      id: 'korean_scholar',
      title: 'Korean Scholar',
      description: 'Explored Korean phonetics 75 times',
      icon: '📚',
      unlocked: usageData.koreanAccess >= 75,
      progress: Math.min(usageData.koreanAccess, 75),
      maxProgress: 75,
      category: 'korean'
    },

    // Perfect Validator Badges
    {
      id: 'accuracy_novice',
      title: 'Perfect Validator',
      description: 'Achieved 80% accuracy in answers',
      icon: '✅',
      unlocked: usageData.validationAccuracy >= 80,
      progress: Math.min(usageData.validationAccuracy, 100),
      maxProgress: 100,
      category: 'validation'
    },
    {
      id: 'accuracy_expert',
      title: 'Answer Expert',
      description: 'Achieved 95% accuracy in answers',
      icon: '🎯',
      unlocked: usageData.validationAccuracy >= 95,
      progress: Math.min(usageData.validationAccuracy, 100),
      maxProgress: 100,
      category: 'validation'
    }
  ];

  // Update achievements when usage data changes
  useEffect(() => {
    const previousAchievements = achievements;
    const updatedAchievements = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: getUnlockStatus(achievement, usageData)
    }));

    setAchievements(updatedAchievements);

    // Check for newly unlocked achievements
    const newUnlocks = updatedAchievements.filter(achievement => 
      achievement.unlocked && 
      !previousAchievements.some(prev => prev.id === achievement.id && prev.unlocked)
    );

    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
      newUnlocks.forEach(achievement => {
        if (onAchievementUnlocked) {
          onAchievementUnlocked(achievement);
        }
      });

      // Clear newly unlocked after 3 seconds
      setTimeout(() => setNewlyUnlocked([]), 3000);
    }
  }, [usageData]);

  // Helper function to determine unlock status (frontend logic only)
  const getUnlockStatus = (achievement: Achievement, data: any): boolean => {
    switch (achievement.category) {
      case 'audio':
        return data.audioUsage >= achievement.maxProgress;
      case 'hints':
        return data.hintRequests >= achievement.maxProgress;
      case 'korean':
        return data.koreanAccess >= achievement.maxProgress;
      case 'validation':
        return data.validationAccuracy >= achievement.maxProgress;
      default:
        return false;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'audio': return theme.primary;
      case 'hints': return theme.accent;
      case 'korean': return '#ff6b6b';
      case 'validation': return '#4ecdc4';
      default: return theme.primary;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'audio': return 'Audio Learning';
      case 'hints': return 'Smart Questioning';
      case 'korean': return 'Korean Exploration';
      case 'validation': return 'Answer Accuracy';
      default: return 'General';
    }
  };

  // Group achievements by category
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  return (
    <div style={{
      padding: '20px',
      background: `${theme.background}f0`,
      borderRadius: '16px',
      border: `1px solid ${theme.primary}20`
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🏆 Language Learning Achievements
      </h3>

      {/* Achievement Categories */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category} style={{ marginBottom: '24px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: getCategoryColor(category),
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {getCategoryName(category)}
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {categoryAchievements.map(achievement => (
              <div
                key={achievement.id}
                style={{
                  background: achievement.unlocked 
                    ? `linear-gradient(135deg, ${getCategoryColor(achievement.category)}20, ${getCategoryColor(achievement.category)}10)`
                    : `${theme.background}80`,
                  border: achievement.unlocked
                    ? `2px solid ${getCategoryColor(achievement.category)}60`
                    : `1px solid ${theme.primary}10`,
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative',
                  opacity: achievement.unlocked ? 1 : 0.6,
                  transform: newlyUnlocked.some(a => a.id === achievement.id) ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  boxShadow: achievement.unlocked 
                    ? `0 4px 12px ${getCategoryColor(achievement.category)}20`
                    : 'none'
                }}
              >
                {/* Achievement Icon */}
                <div style={{
                  fontSize: '32px',
                  marginBottom: '8px',
                  filter: achievement.unlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {achievement.icon}
                </div>

                {/* Achievement Title */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: achievement.unlocked ? theme.text : `${theme.text}60`,
                  marginBottom: '4px'
                }}>
                  {achievement.title}
                </div>

                {/* Achievement Description */}
                <div style={{
                  fontSize: '12px',
                  color: achievement.unlocked ? `${theme.text}80` : `${theme.text}40`,
                  marginBottom: '12px'
                }}>
                  {achievement.description}
                </div>

                {/* Progress Bar */}
                <div style={{
                  background: `${theme.primary}10`,
                  borderRadius: '8px',
                  height: '6px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    background: achievement.unlocked 
                      ? getCategoryColor(achievement.category)
                      : `${getCategoryColor(achievement.category)}40`,
                    height: '100%',
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                    transition: 'width 0.3s ease',
                    borderRadius: '8px'
                  }} />
                </div>

                {/* Progress Text */}
                <div style={{
                  fontSize: '10px',
                  color: `${theme.text}60`,
                  textAlign: 'right'
                }}>
                  {achievement.progress} / {achievement.maxProgress}
                </div>

                {/* Unlocked Badge */}
                {achievement.unlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: getCategoryColor(achievement.category),
                    color: 'white',
                    borderRadius: '12px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    UNLOCKED
                  </div>
                )}

                {/* New Achievement Glow */}
                {newlyUnlocked.some(a => a.id === achievement.id) && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: `linear-gradient(45deg, ${getCategoryColor(achievement.category)}, transparent, ${getCategoryColor(achievement.category)})`,
                    borderRadius: '14px',
                    zIndex: -1,
                    animation: 'pulse 2s infinite'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Achievement Summary */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: `${theme.primary}05`,
        borderRadius: '12px',
        border: `1px solid ${theme.primary}10`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '600',
          color: theme.accent,
          marginBottom: '4px'
        }}>
          {achievements.filter(a => a.unlocked).length} / {achievements.length}
        </div>
        <div style={{
          fontSize: '12px',
          color: `${theme.text}70`
        }}>
          Achievements Unlocked
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
