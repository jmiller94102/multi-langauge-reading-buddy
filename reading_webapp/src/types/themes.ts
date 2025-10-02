export type ThemeName = 'Space' | 'Jungle' | 'DeepSea' | 'Minecraft' | 'Tron';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  text: string;
  textMuted: string;
}

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  colors: ThemeColors;
  backgroundImages: {
    main: string;
    sidebar: string;
    topbar: string;
  };
  animations: {
    celebration: string;
    transition: string;
  };
  sounds?: {
    ambient?: string;
    success?: string;
    click?: string;
  };
}

export interface CelebrationType {
  type: 'quiz-complete' | 'level-up' | 'achievement' | 'reading-milestone';
  theme: ThemeName;
  data?: {
    points?: number;
    level?: number;
    achievement?: string;
    milestone?: string;
  };
}

export const THEME_CONFIGS: Record<ThemeName, ThemeConfig> = {
  Space: {
    name: 'Space',
    displayName: 'Space Adventure',
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#0f3460',
      highlight: '#9b59b6',
      text: '#ffffff',
      textMuted: '#b8c5d6',
    },
    backgroundImages: {
      main: '/themes/space/space-bg.jpg',
      sidebar: '/themes/space/space-panel.png',
      topbar: '/themes/space/space-header.png',
    },
    animations: {
      celebration: 'space-stars',
      transition: 'warp-speed',
    },
    sounds: {
      ambient: '/themes/space/space-ambient.mp3',
      success: '/themes/space/space-success.mp3',
    },
  },
  Jungle: {
    name: 'Jungle',
    displayName: 'Jungle Explorer',
    colors: {
      primary: '#1b4332',
      secondary: '#2d5016',
      accent: '#40916c',
      highlight: '#95d5b2',
      text: '#ffffff',
      textMuted: '#c8e6c9',
    },
    backgroundImages: {
      main: '/themes/jungle/jungle-bg.jpg',
      sidebar: '/themes/jungle/jungle-panel.png',
      topbar: '/themes/jungle/jungle-header.png',
    },
    animations: {
      celebration: 'jungle-leaves',
      transition: 'vine-swing',
    },
    sounds: {
      ambient: '/themes/jungle/jungle-ambient.mp3',
      success: '/themes/jungle/jungle-success.mp3',
    },
  },
  DeepSea: {
    name: 'DeepSea',
    displayName: 'Deep Sea Discovery',
    colors: {
      primary: '#0a2a3a',
      secondary: '#0d3547',
      accent: '#1a5d73',
      highlight: '#4fc3f7',
      text: '#ffffff',
      textMuted: '#b3e5fc',
    },
    backgroundImages: {
      main: '/themes/deepsea/ocean-bg.jpg',
      sidebar: '/themes/deepsea/ocean-panel.png',
      topbar: '/themes/deepsea/ocean-header.png',
    },
    animations: {
      celebration: 'bubble-burst',
      transition: 'wave-flow',
    },
    sounds: {
      ambient: '/themes/deepsea/ocean-ambient.mp3',
      success: '/themes/deepsea/ocean-success.mp3',
    },
  },
  Minecraft: {
    name: 'Minecraft',
    displayName: 'Block World',
    colors: {
      primary: '#4a3728',
      secondary: '#5d4e37',
      accent: '#8b7355',
      highlight: '#daa520',
      text: '#ffffff',
      textMuted: '#f4e4bc',
    },
    backgroundImages: {
      main: '/themes/minecraft/minecraft-bg.jpg',
      sidebar: '/themes/minecraft/minecraft-panel.png',
      topbar: '/themes/minecraft/minecraft-header.png',
    },
    animations: {
      celebration: 'block-explosion',
      transition: 'block-build',
    },
    sounds: {
      ambient: '/themes/minecraft/minecraft-ambient.mp3',
      success: '/themes/minecraft/minecraft-success.mp3',
    },
  },
  Tron: {
    name: 'Tron',
    displayName: 'Digital Grid',
    colors: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      accent: '#00bcd4',
      highlight: '#64ffda',
      text: '#ffffff',
      textMuted: '#80deea',
    },
    backgroundImages: {
      main: '/themes/tron/tron-bg.jpg',
      sidebar: '/themes/tron/tron-panel.png',
      topbar: '/themes/tron/tron-header.png',
    },
    animations: {
      celebration: 'circuit-pulse',
      transition: 'digital-scan',
    },
    sounds: {
      ambient: '/themes/tron/tron-ambient.mp3',
      success: '/themes/tron/tron-success.mp3',
    },
  },
};