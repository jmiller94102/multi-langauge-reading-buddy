import React, { ReactNode } from 'react';
import { UserProvider } from './UserContext';
import { PetProvider } from './PetContext';
import { QuestProvider } from './QuestContext';
import { AchievementProvider } from './AchievementContext';
import { SettingsProvider } from './SettingsContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <SettingsProvider>
      <UserProvider>
        <PetProvider>
          <QuestProvider>
            <AchievementProvider>
              {children}
            </AchievementProvider>
          </QuestProvider>
        </PetProvider>
      </UserProvider>
    </SettingsProvider>
  );
};
