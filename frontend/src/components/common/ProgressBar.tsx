import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple';
  showLabel?: boolean;
  height?: 'small' | 'medium' | 'large';
  animated?: boolean;
  className?: string;
}

const colorVariants = {
  blue: 'bg-primary-500',
  green: 'bg-success-500',
  yellow: 'bg-accent-400',
  purple: 'bg-purple-500',
};

const heightVariants = {
  small: 'h-2',
  medium: 'h-3',
  large: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = 'blue',
  showLabel = false,
  height = 'medium',
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heightVariants[height])}>
        <div
          className={cn(
            'h-full rounded-full transition-all',
            colorVariants[color],
            animated && 'duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-2 text-child-sm text-gray-600 font-medium" aria-live="polite">
          {current} / {total} ({Math.round(percentage)}%)
        </div>
      )}
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
