import React from 'react';
import { useToast, type Toast, type ToastType } from '@/contexts/ToastContext';

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: '✓',
          bgColor: 'bg-gradient-to-r from-success-500 to-emerald-500',
          iconBg: 'bg-success-600',
        };
      case 'error':
        return {
          icon: '✗',
          bgColor: 'bg-gradient-to-r from-red-500 to-rose-500',
          iconBg: 'bg-red-600',
        };
      case 'warning':
        return {
          icon: '⚠',
          bgColor: 'bg-gradient-to-r from-amber-500 to-yellow-500',
          iconBg: 'bg-amber-600',
        };
      case 'info':
        return {
          icon: 'ℹ',
          bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          iconBg: 'bg-blue-600',
        };
    }
  };

  const config = getToastConfig(toast.type);

  return (
    <div
      className={`${config.bgColor} text-white rounded-lg shadow-2xl p-4 min-w-[280px] max-w-md flex items-center gap-3 animate-slide-in`}
      role="alert"
    >
      {/* Icon */}
      <div className={`${config.iconBg} w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-lg">{config.icon}</span>
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-semibold">{toast.message}</p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={() => hideToast(toast.id)} />
        </div>
      ))}
      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
