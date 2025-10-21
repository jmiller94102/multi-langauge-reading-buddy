import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { CollapsibleSidebar, SidebarTab } from './CollapsibleSidebar';
import { NAV_ITEMS } from '@/types/navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  customTabs?: SidebarTab[]; // Custom tabs for sidebar
  customDefaultTab?: string; // Default tab ID when using customTabs
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  customTabs,
  customDefaultTab
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get current page name from NAV_ITEMS
  const currentPage = NAV_ITEMS.find(item => item.path === location.pathname);
  const currentPageName = currentPage?.label || 'Dashboard';

  // Create current page tab content (placeholder - pages can override this)
  const currentPageTabContent = (
    <div className="space-y-2 p-2">
      <p className="text-[11px] text-gray-600 italic">
        {currentPageName} page settings will appear here.
      </p>
    </div>
  );

  // Create Pages tab content
  const pagesTabContent = (
    <div className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full text-left py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="text-base" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  // Default sidebar tabs (Current Page + Pages)
  const defaultTabs: SidebarTab[] = [
    {
      id: currentPageName.toLowerCase(),
      label: currentPageName,
      icon: currentPage?.icon || '📄',
      content: currentPageTabContent,
    },
    {
      id: 'pages',
      label: 'Pages',
      icon: '🧭',
      content: pagesTabContent,
    },
  ];

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Header - Always visible */}
      <Header />

      {/* Collapsible Sidebar - Desktop Only - SINGLE INSTANCE ONLY */}
      <div className="hidden lg:block">
        <CollapsibleSidebar
          key={`sidebar-${location.pathname}`}
          tabs={customTabs || defaultTabs}
          defaultTab={customDefaultTab || customTabs?.[0]?.id || currentPageName.toLowerCase()}
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />
      </div>

      {/* Page Content */}
      <main
        className="flex-1 px-4 py-6 pb-24 lg:pb-6 transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? '290px' : '0',
          maxWidth: sidebarOpen ? 'calc(100vw - 290px)' : '100vw',
        }}
        role="main"
        id="main-content"
      >
        <div className="container mx-auto max-w-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
};
