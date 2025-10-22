import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { PetProvider } from './PetContext';
import { QuestProvider } from './QuestContext';
import { AchievementProvider } from './AchievementContext';
import { SettingsProvider } from './SettingsContext';
import { ToastProvider } from './ToastContext';
import { StoryProvider } from './StoryContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <UserProvider>
          <PetProvider>
            <QuestProvider>
              <AchievementProvider>
                <StoryProvider>
                  {children}
                </StoryProvider>
              </AchievementProvider>
            </QuestProvider>
          </PetProvider>
        </UserProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};
