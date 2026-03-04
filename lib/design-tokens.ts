/**
 * Design System Tokens
 * Centralized constants for consistent styling across the application
 */

// Card Styling
export const CARD_STYLES = {
  // Standard card background with gradient
  base: "bg-gradient-to-br from-card/60 to-card/30",
  // Card borders
  border: "border-border/60",
  // Enhanced card with stronger gradient
  enhanced: "bg-gradient-to-br from-card/80 to-card/40",
  // Subtle card background
  subtle: "bg-card/40",
} as const;

// Card Hover Effects
export const CARD_HOVER = {
  // Standard hover with shadow
  base: "hover:shadow-lg hover:border-border/80 transition-all duration-300",
  // Enhanced hover with glow
  enhanced: "hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] hover:border-primary/30 transition-all duration-300",
  // Interactive card hover
  interactive: "hover:from-card/70 hover:to-card/50 hover:border-primary/30 transition-all duration-300",
} as const;

// Spacing
export const SPACING = {
  // Section spacing (between major sections)
  section: "space-y-6",
  // Card content padding
  cardPadding: "p-4",
  cardPaddingResponsive: "p-3 sm:p-6",
  // Grid gaps
  gridGap: "gap-6",
  gridGapCompact: "gap-4",
  gridGapTight: "gap-2",
} as const;

// Typography
export const TYPOGRAPHY = {
  // Page heading (h1)
  pageHeading: "text-3xl font-semibold tracking-tight",
  // Section heading (h2)
  sectionHeading: "text-xl font-semibold",
  sectionHeadingLarge: "text-2xl font-bold",
  // Card title (h3)
  cardTitle: "text-base font-semibold",
  // Subtext
  muted: "text-sm text-muted-foreground",
  mutedXs: "text-xs text-muted-foreground",
} as const;

// Icon Sizes
export const ICON_SIZES = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const;

// Badge Styles
export const BADGE_STYLES = {
  // Status badges
  success: "bg-green-500/10 text-green-500 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  danger: "bg-red-500/10 text-red-500 border-red-500/20",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  // Event type badges
  tournament: "bg-red-500/10 text-red-500 border-red-500/20",
  themed: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  casual: "bg-green-500/10 text-green-500 border-green-500/20",
  training: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  // Badge padding
  padding: "px-2 py-0.5",
  paddingSmall: "px-1.5 py-0.5",
} as const;

// Animation Durations
export const ANIMATION = {
  fast: "duration-150",
  normal: "duration-300",
  slow: "duration-500",
} as const;

// Grid Layouts
export const GRID_LAYOUTS = {
  // Auto-fit responsive grid
  responsive1to4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  responsive1to3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  responsive1to2: "grid grid-cols-1 lg:grid-cols-2",
  // Stats grid
  stats2to4: "grid grid-cols-2 md:grid-cols-4",
} as const;
