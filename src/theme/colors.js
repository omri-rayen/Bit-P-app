// Modern Futuristic Dark Theme
export const colors = {
  // Primary gradient colors
  primary: '#00D9FF',
  primaryDark: '#0099CC',
  secondary: '#7C3AED',
  accent: '#10B981',
  
  // Background colors
  background: {
    primary: '#0A0E17',
    secondary: '#111827',
    tertiary: '#1F2937',
    card: 'rgba(31, 41, 55, 0.7)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Text colors
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    muted: '#6B7280',
    accent: '#00D9FF',
  },
  
  // Status colors
  status: {
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.15)',
  },
  
  // Border colors
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    accent: 'rgba(0, 217, 255, 0.3)',
  },
  
  // Gradient presets
  gradients: {
    primary: ['#00D9FF', '#7C3AED'],
    secondary: ['#7C3AED', '#EC4899'],
    accent: ['#10B981', '#00D9FF'],
    dark: ['#0A0E17', '#111827'],
    card: ['rgba(31, 41, 55, 0.8)', 'rgba(17, 24, 39, 0.9)'],
  },
  
  // Tab bar
  tabBar: {
    background: 'rgba(10, 14, 23, 0.95)',
    active: '#00D9FF',
    inactive: '#6B7280',
  },
};

export const shadows = {
  glow: {
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
  },
};
