import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Header - Always visible */}
      <Header />

      {/* Main Content Area */}
      <div className="flex">
        {/* Side Navigation - Desktop Only */}
        <SideNav />

        {/* Page Content */}
        <main
          className="flex-1 container mx-auto px-4 py-6 pb-24 lg:pb-6"
          role="main"
          id="main-content"
        >
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
};
