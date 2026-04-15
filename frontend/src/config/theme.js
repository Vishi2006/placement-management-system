// Color Theme Configuration
export const theme = {
  // Primary colors (Blue/Indigo - Professional)
  primary: {
    light: '#3B82F6',      // Blue-500
    main: '#1E40AF',       // Blue-800
    dark: '#1E3A8A',       // Blue-900
    lighter: '#DBEAFE',    // Blue-100
    extra: '#EFF6FF',      // Blue-50
  },

  // Secondary colors (Purple/Pink - Accents)
  secondary: {
    light: '#A855F7',      // Purple-500
    main: '#7C3AED',       // Purple-600
    dark: '#5B21B6',       // Purple-800
    lighter: '#F3E8FF',    // Purple-100
  },

  // Accent colors
  accent: {
    green: '#10B981',      // Emerald-500
    red: '#EF4444',        // Red-500
    yellow: '#F59E0B',     // Amber-500
    orange: '#F97316',     // Orange-500
  },

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    text: {
      light: '#1F2937',    // Gray-900
      main: '#374151',     // Gray-700
      muted: '#6B7280',    // Gray-500
      light: '#9CA3AF',    // Gray-400
    },
    bg: {
      light: '#F9FAFB',    // Gray-50
      lighter: '#F3F4F6',  // Gray-100
      main: '#E5E7EB',     // Gray-200
    }
  },

  // Dark mode
  dark: {
    bg: {
      main: '#0F172A',     // Slate-900
      secondary: '#1E293B',// Slate-800
      tertiary: '#334155', // Slate-700
    },
    text: {
      primary: '#F8FAFC',  // Slate-50
      secondary: '#CBD5E1',// Slate-300
      muted: '#94A3B8',    // Slate-400
    }
  }
}

// Shadow definitions
export const shadows = {
  soft: '0 1px 3px rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px rgba(0, 0, 0, 0.1)',
  md: '0 10px 15px rgba(0, 0, 0, 0.1)',
  lg: '0 20px 25px rgba(0, 0, 0, 0.1)',
  xl: '0 25px 50px rgba(0, 0, 0, 0.1)',
}

// Animation variants
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  }
}
