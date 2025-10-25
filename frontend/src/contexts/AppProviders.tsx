import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { PetProvider } from './PetContext';
import { QuestProvider } from './QuestContext';
import { AchievementProvider } from './AchievementContext';
import { SettingsProvider } from './SettingsContext';
import { ToastProvider } from './ToastContext';
import { StoryProvider } from './StoryContext';
import { SessionProvider } from './SessionContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      <SettingsProvider>
        <SessionProvider>
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
        </SessionProvider>
      </SettingsProvider>
    </ToastProvider>
  );
};
