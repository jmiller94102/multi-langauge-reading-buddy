import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-gradient-to-br from-primary-900 to-accent-900 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="relative inline-block">
          {/* Outer rotating ring */}
          <div
            className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}
          />
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          </div>
        </div>
        {message && (
          <p className="mt-4 text-child-sm font-semibold text-white animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton component for loading states
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  rounded = false,
  circle = false,
}) => {
  return (
    <div
      className={`bg-gray-200 animate-pulse ${rounded ? 'rounded-lg' : ''} ${
        circle ? 'rounded-full' : ''
      } ${className}`}
      style={{ width, height }}
    />
  );
};
