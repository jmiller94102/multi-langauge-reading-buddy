export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  ariaLabel: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '🏠',
    path: '/dashboard',
    ariaLabel: 'Go to Dashboard',
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: '📖',
    path: '/reading',
    ariaLabel: 'Go to Reading page',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: '🏆',
    path: '/achievements',
    ariaLabel: 'Go to Achievements page',
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: '🛍️',
    path: '/shop',
    ariaLabel: 'Go to Shop page',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    path: '/profile',
    ariaLabel: 'Go to Profile page',
  },
];
