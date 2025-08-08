// System Colors - Centralized color constants for easy reuse
export const COLORS = {
  // Deal Colors
  originalDeal: '#F2055C',
  voucherDeal: '#05F26C',
  
  // Background Colors
  mainBackground: '#F0F0F5',
  
  // Brand Colors
  darkViolet: '#340040',
} as const;

// Alternative export format for easier usage
export const {
  originalDeal: ORIGINAL_DEAL_COLOR,
  voucherDeal: VOUCHER_DEAL_COLOR,
  mainBackground: MAIN_BACKGROUND_COLOR,
  darkViolet: DARK_VIOLET_COLOR,
} = COLORS;

// CSS Custom Properties format (for use in CSS/SCSS files)
export const CSS_VARIABLES = {
  '--color-original-deal': COLORS.originalDeal,
  '--color-voucher-deal': COLORS.voucherDeal,
  '--color-main-background': COLORS.mainBackground,
  '--color-dark-violet': COLORS.darkViolet,
} as const;

// Tailwind config format (for extending Tailwind colors)
export const TAILWIND_COLORS = {
  'original-deal': COLORS.originalDeal,
  'voucher-deal': COLORS.voucherDeal,
  'main-background': COLORS.mainBackground,
  'dark-violet': COLORS.darkViolet,
} as const;