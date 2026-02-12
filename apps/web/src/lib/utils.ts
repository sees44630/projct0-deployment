import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ========================================
// Tailwind Merge + clsx helper
// ========================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ========================================
// Button Variants (CVA)
// ========================================
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-heading font-semibold uppercase tracking-wider transition-all duration-300 relative overflow-hidden',
  {
    variants: {
      variant: {
        primary:
          'bg-neon-pink text-white hover:shadow-[0_0_20px_rgba(255,45,123,0.5)] active:scale-95',
        secondary:
          'bg-transparent border-2 border-cyber-blue text-cyber-blue hover:bg-cyber-blue/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]',
        ghost:
          'bg-transparent text-text-secondary hover:text-text-primary hover:bg-void-elevated/50',
        gold:
          'bg-gradient-to-r from-gold-rank to-epic-orange text-void-black hover:shadow-[0_0_20px_rgba(255,215,0,0.5)]',
        danger:
          'bg-legendary-red text-white hover:shadow-[0_0_20px_rgba(255,0,64,0.5)]',
      },
      size: {
        sm: 'text-xs px-3 py-1.5 rounded',
        md: 'text-sm px-5 py-2.5 rounded-md',
        lg: 'text-base px-7 py-3.5 rounded-lg',
        xl: 'text-lg px-9 py-4 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

// ========================================
// Badge Variants (Rarity)
// ========================================
export const badgeVariants = cva(
  'inline-flex items-center font-stats uppercase tracking-widest',
  {
    variants: {
      rarity: {
        COMMON: 'text-common-gray border-common-gray/40 bg-common-gray/10',
        UNCOMMON: 'text-uncommon-green border-uncommon-green/40 bg-uncommon-green/10',
        RARE: 'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
        EPIC: 'text-rare-purple border-rare-purple/40 bg-rare-purple/10',
        LEGENDARY: 'text-gold-rank border-gold-rank/40 bg-gold-rank/10',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5 border rounded',
        md: 'text-xs px-3 py-1 border rounded-md',
      },
    },
    defaultVariants: {
      rarity: 'COMMON',
      size: 'sm',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

// ========================================
// Rarity Colors Map
// ========================================
export const RARITY_COLORS = {
  COMMON: { color: '#8888aa', glow: '#8888aa44' },
  UNCOMMON: { color: '#00ff88', glow: '#00ff8844' },
  RARE: { color: '#00d4ff', glow: '#00d4ff44' },
  EPIC: { color: '#b44dff', glow: '#b44dff44' },
  LEGENDARY: { color: '#ffd700', glow: '#ffd70044' },
} as const;

// ========================================
// Category Theme Colors
// ========================================
export const CATEGORY_THEMES: Record<string, { bg: string; accent: string }> = {
  cyberpunk: { bg: '#0a0a1a', accent: '#00d4ff' },
  'slice-of-life': { bg: '#1a0a1a', accent: '#ffb7c5' },
  mecha: { bg: '#0a1a0a', accent: '#00ff88' },
  fantasy: { bg: '#1a0a2a', accent: '#b44dff' },
  shonen: { bg: '#1a1a0a', accent: '#ffd700' },
  default: { bg: '#0a0a0f', accent: '#ff2d7b' },
};
