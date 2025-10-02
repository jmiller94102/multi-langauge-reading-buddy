import React, { useState, useEffect } from 'react';

interface ThemeStyle {
  primary: string;
  accent: string;
  text: string;
  background: string;
}

interface StreakData {
  feature: string;
  currentStreak: number;
  longestStreak: number;
  lastUsed: number;
  icon: string;
}

interface ProgressMetrics {
  totalSessions: number;
  averageAccuracy: number;
  improvementTrend: 'up' | 'down' | 'stable';
  weeklyProgress: number[];
  featuresUsed: string[];
}

interface ProgressTrackerProps {
  theme: ThemeStyle;
  streakData: StreakData[];
  progressMetrics: ProgressMetrics;
  onMilestoneReached?: (milestone: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  theme,
  streakData,
  progressMetrics,
  onMilestoneReached
}) => {
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<string | null>(null);

  // Check for milestones (frontend UI logic only)
  useEffect(() => {
    const milestones = [
      { threshold: 5, message: "🎉 5 sessions completed! You're building great habits!" },
      { threshold: 10, message: "🌟 10 sessions! You're becoming a reading champion!" },
      { threshold: 25, message: "🏆 25 sessions! Outstanding dedication!" },
      { threshold: 50, message: "🎊 50 sessions! You're a true learning superstar!" }
    ];

    const reachedMilestone = milestones.find(m => 
      progressMetrics.totalSessions === m.threshold
    );

    if (reachedMilestone) {
      setCurrentMilestone(reachedMilestone.message);
      setCelebrationVisible(true);
      
      if (onMilestoneReached) {
        onMilestoneReached(reachedMilestone.message);
      }

      // Hide celebration after 4 seconds
      setTimeout(() => {
        setCelebrationVisible(false);
        setCurrentMilestone(null);
      }, 4000);
    }
  }, [progressMetrics.totalSessions, onMilestoneReached]);

  const getStreakStatus = (streak: StreakData) => {
    const daysSinceLastUse = Math.floor((Date.now() - streak.lastUsed) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastUse === 0) return { status: 'active', color: '#4ecdc4', message: 'Active today!' };
    if (daysSinceLastUse === 1) return { status: 'risk', color: '#ffa726', message: 'Use today to keep streak!' };
    if (daysSinceLastUse > 1) return { status: 'broken', color: '#ff6b6b', message: 'Streak broken' };
    return { status: 'active', color: '#4ecdc4', message: 'Keep it up!' };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#4ecdc4';
      case 'down': return '#ff6b6b';
      case 'stable': return theme.accent;
      default: return theme.primary;
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: `${theme.background}f0`,
      borderRadius: '16px',
      border: `1px solid ${theme.primary}20`,
      position: 'relative'
    }}>
      {/* Celebration Modal */}
      {celebrationVisible && currentMilestone && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          color: 'white',
          padding: '20px',
          borderRadius: '16px',
          textAlign: 'center',
          zIndex: 1000,
          boxShadow: `0 8px 24px ${theme.primary}40`,
          animation: 'celebrationBounce 0.6s ease-out'
        }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Milestone Reached!
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            {currentMilestone}
          </div>
        </div>
      )}

      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📊 Learning Progress
      </h3>

      {/* Feature Usage Streaks */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: theme.accent,
          fontSize: '16px',
          fontWeight: '600'
        }}>
          🔥 Feature Usage Streaks
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {streakData.map(streak => {
            const status = getStreakStatus(streak);
            return (
              <div
                key={streak.feature}
                style={{
                  background: `${status.color}10`,
                  border: `2px solid ${status.color}30`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {streak.icon}
                </div>
                
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '4px',
                  textTransform: 'capitalize'
                }}>
                  {streak.feature.replace(/([A-Z])/g, ' $1')}
                </div>

                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: status.color,
                  marginBottom: '4px'
                }}>
                  {streak.currentStreak} days
                </div>

                <div style={{
                  fontSize: '10px',
                  color: `${theme.text}60`,
                  marginBottom: '8px'
                }}>
                  Best: {streak.longestStreak} days
                </div>

                <div style={{
                  fontSize: '10px',
                  color: status.color,
                  fontWeight: '600'
                }}>
                  {status.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Metrics */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: theme.accent,
          fontSize: '16px',
          fontWeight: '600'
        }}>
          📈 Improvement Over Time
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          {/* Total Sessions */}
          <div style={{
            background: `${theme.primary}10`,
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.primary}20`
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: theme.primary,
              marginBottom: '4px'
            }}>
              {progressMetrics.totalSessions}
            </div>
            <div style={{
              fontSize: '12px',
              color: `${theme.text}70`
            }}>
              Total Sessions
            </div>
          </div>

          {/* Average Accuracy */}
          <div style={{
            background: `${theme.accent}10`,
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.accent}20`
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: theme.accent,
              marginBottom: '4px'
            }}>
              {Math.round(progressMetrics.averageAccuracy)}%
            </div>
            <div style={{
              fontSize: '12px',
              color: `${theme.text}70`
            }}>
              Avg Accuracy
            </div>
          </div>

          {/* Improvement Trend */}
          <div style={{
            background: `${getTrendColor(progressMetrics.improvementTrend)}10`,
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${getTrendColor(progressMetrics.improvementTrend)}20`
          }}>
            <div style={{
              fontSize: '24px',
              marginBottom: '4px'
            }}>
              {getTrendIcon(progressMetrics.improvementTrend)}
            </div>
            <div style={{
              fontSize: '12px',
              color: `${theme.text}70`,
              textTransform: 'capitalize'
            }}>
              {progressMetrics.improvementTrend} Trend
            </div>
          </div>

          {/* Features Used */}
          <div style={{
            background: `${theme.primary}10`,
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${theme.primary}20`
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: theme.primary,
              marginBottom: '4px'
            }}>
              {progressMetrics.featuresUsed.length}
            </div>
            <div style={{
              fontSize: '12px',
              color: `${theme.text}70`
            }}>
              Features Used
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: theme.accent,
          fontSize: '16px',
          fontWeight: '600'
        }}>
          📅 Weekly Activity
        </h4>

        <div style={{
          display: 'flex',
          alignItems: 'end',
          gap: '4px',
          height: '60px',
          padding: '12px',
          background: `${theme.background}80`,
          borderRadius: '8px',
          border: `1px solid ${theme.primary}10`
        }}>
          {progressMetrics.weeklyProgress.map((value, index) => {
            const maxValue = Math.max(...progressMetrics.weeklyProgress, 1);
            const height = (value / maxValue) * 40;
            const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            
            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${height}px`,
                    background: value > 0 
                      ? `linear-gradient(to top, ${theme.primary}, ${theme.accent})`
                      : `${theme.primary}20`,
                    borderRadius: '2px',
                    transition: 'height 0.3s ease'
                  }}
                />
                <div style={{
                  fontSize: '8px',
                  color: `${theme.text}60`,
                  textAlign: 'center'
                }}>
                  {dayLabels[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.primary}10, ${theme.accent}10)`,
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${theme.primary}20`,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          color: theme.text,
          fontWeight: '500',
          marginBottom: '4px'
        }}>
          {getMotivationalMessage(progressMetrics)}
        </div>
        <div style={{
          fontSize: '12px',
          color: `${theme.text}70`
        }}>
          Keep up the great work! 🌟
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes celebrationBounce {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Helper function for motivational messages (frontend UI logic only)
function getMotivationalMessage(metrics: ProgressMetrics): string {
  if (metrics.totalSessions === 0) {
    return "Ready to start your learning journey?";
  }
  
  if (metrics.totalSessions < 5) {
    return "Great start! You're building excellent learning habits.";
  }
  
  if (metrics.averageAccuracy > 90) {
    return "Incredible accuracy! You're mastering the material.";
  }
  
  if (metrics.improvementTrend === 'up') {
    return "Amazing progress! You're getting better every day.";
  }
  
  if (metrics.featuresUsed.length >= 4) {
    return "Fantastic! You're using all the learning tools available.";
  }
  
  return "You're doing wonderfully! Every session makes you stronger.";
}
