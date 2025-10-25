/**
 * StudentCard Component
 * Displays individual student progress in teacher dashboard
 */

import React from 'react';
import type { StudentState } from '@/types/classroom';

interface StudentCardProps {
  student: StudentState;
}

/**
 * Visual indicator for student status
 */
const StatusIndicator: React.FC<{ status: StudentState['status'] }> = ({ status }) => {
  const statusConfig = {
    reading: { emoji: '📖', color: 'bg-green-100 border-green-300 text-green-700', label: 'Reading' },
    idle: { emoji: '⏸️', color: 'bg-yellow-100 border-yellow-300 text-yellow-700', label: 'Idle' },
    stuck: { emoji: '❓', color: 'bg-red-100 border-red-300 text-red-700', label: 'Needs Help' },
    completed: { emoji: '✅', color: 'bg-blue-100 border-blue-300 text-blue-700', label: 'Completed' },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${config.color} text-[10px] font-semibold`}>
      <span aria-hidden="true">{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
};

/**
 * StudentCard displays real-time progress for a single student
 */
export const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const timeSinceUpdate = Date.now() - student.timestamp;
  const secondsAgo = Math.floor(timeSinceUpdate / 1000);

  // Format time ago
  const formatTimeAgo = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="card py-3 px-4 space-y-2">
      {/* Student Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-child-sm font-bold text-gray-900">
            {student.studentName || student.studentId}
          </h3>
          <p className="text-[10px] text-gray-600">
            Updated {formatTimeAgo(secondsAgo)}
          </p>
        </div>
        <StatusIndicator status={student.status} />
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-semibold text-gray-700">Progress:</span>
          <span className="text-[10px] font-bold text-gray-900">{student.progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              student.status === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : student.status === 'stuck'
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : 'bg-gradient-to-r from-primary-500 to-accent-500'
            }`}
            style={{ width: `${student.progress}%` }}
            role="progressbar"
            aria-valuenow={student.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${student.studentId} reading progress`}
          />
        </div>
      </div>

      {/* Current Paragraph Info */}
      <div className="text-[10px] text-gray-600">
        Paragraph {student.currentParagraph + 1}
      </div>
    </div>
  );
};