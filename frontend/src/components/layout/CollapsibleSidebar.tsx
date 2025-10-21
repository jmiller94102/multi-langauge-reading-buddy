import React, { useState } from 'react';

export interface SidebarTab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
}

interface CollapsibleSidebarProps {
  tabs: SidebarTab[];
  defaultTab?: string;
  width?: number; // Width in pixels (default: 280)
  isOpen?: boolean; // Controlled state
  onToggle?: (isOpen: boolean) => void; // Callback when toggled
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  tabs,
  defaultTab,
  width = 280,
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  // Use controlled state if provided, otherwise use internal state
  const sidebarOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newState = !sidebarOpen;
    if (onToggle) {
      onToggle(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={handleToggle}
        className="fixed left-0 top-24 z-50 bg-primary-600 hover:bg-primary-700 text-white px-2 py-4 rounded-r-lg shadow-lg transition-all duration-300 hover:px-3"
        style={{
          left: sidebarOpen ? `${width}px` : '0px',
          transition: 'left 0.3s ease',
        }}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={sidebarOpen}
      >
        <span className="text-sm font-bold" aria-hidden="true">
          {sidebarOpen ? '◀' : '▶'}
        </span>
      </button>

      {/* Collapsible Sidebar */}
      <div
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-50 border-r-2 border-gray-200 overflow-hidden transition-all duration-300 shadow-lg z-40 flex flex-col"
        style={{
          width: sidebarOpen ? `${width}px` : '0px',
          opacity: sidebarOpen ? 1 : 0,
        }}
        aria-hidden={!sidebarOpen}
      >
        {sidebarOpen && (
          <>
            {/* Tab Buttons */}
            {tabs.length > 1 && (
              <div className="flex border-b border-gray-300 bg-white">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-3 text-[11px] font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    role="tab"
                    aria-label={`${tab.label} tab`}
                    aria-selected={activeTab === tab.id}
                  >
                    <span aria-hidden="true">{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'thin' }}>
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  style={{ display: activeTab === tab.id ? 'block' : 'none' }}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                >
                  {tab.content}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
