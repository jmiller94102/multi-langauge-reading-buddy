import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/types/navigation';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-20 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-touch min-h-touch',
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
              )}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'font-bold' : 'font-normal'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
