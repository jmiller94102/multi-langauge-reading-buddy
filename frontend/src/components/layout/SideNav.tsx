import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { SecondaryLanguageSelector } from '@/components/common/SecondaryLanguageSelector';
import type { SecondaryLanguage } from '@/types/story';

export const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Manage secondary language with localStorage
  const [secondaryLanguage, setSecondaryLanguage] = useState<SecondaryLanguage>(() => {
    const saved = localStorage.getItem('secondaryLanguage');
    return (saved as SecondaryLanguage) || 'ko';
  });

  // Persist secondary language to localStorage
  useEffect(() => {
    localStorage.setItem('secondaryLanguage', secondaryLanguage);
  }, [secondaryLanguage]);

  return (
    <nav
      className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex flex-col gap-2 p-4">
        {/* Secondary Language Selector */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <SecondaryLanguageSelector
            selectedLanguage={secondaryLanguage}
            onChange={setSecondaryLanguage}
          />
        </div>

        {/* Navigation Items */}
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 border-l-4',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-primary-600 font-semibold shadow-sm'
                  : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-300'
              )}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-2xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
