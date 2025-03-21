export const colors = {
  primary: '#f84d4d',
  secondary: '#2c2c2c',
  background: '#000000',
  surface: '#1c1c1c',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#333333',
  success: '#4CAF50',
  error: '#f44336',
  warning: '#ff9800'
};

export const typography = {
  heading1: {
    fontSize: 32,
    fontWeight: '700',
  },
  heading2: {
    fontSize: 24,
    fontWeight: '600',
  },
  heading3: {
    fontSize: 20,
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
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const; 