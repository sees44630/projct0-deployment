// ========================================
// OtakuLoot Shared Types & Constants
// ========================================

// Rarity Tiers
export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export const RARITY_TIERS: RarityTier[] = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

export const RARITY_COLORS: Record<RarityTier, string> = {
  COMMON: '#9ca3af',
  UNCOMMON: '#4ade80',
  RARE: '#f472b6',
  EPIC: '#a78bfa',
  LEGENDARY: '#facc15',
};

// Product Stats (Radar Chart)
export interface ProductStats {
  quality: number;
  rarity: number;
  comfort: number;
  style: number;
  value: number;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Product
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  rarityTier: RarityTier;
  category?: Category;
  stats?: ProductStats;
}

// User Profile (RPG Player)
export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  currentTitle: string;
}

// Cart Item
export interface CartItem {
  id: string;
  productId: string;
  skuId?: string;
  quantity: number;
}

// Auth Payload
export interface AuthPayload {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile?: UserProfile;
  };
}

// XP Level Thresholds
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

export const TITLES: Record<number, string> = {
  1: 'Newbie Shopper',
  2: 'Apprentice Collector',
  3: 'Rising Otaku',
  4: 'Seasoned Buyer',
  5: 'Elite Collector',
  6: 'Master Otaku',
  7: 'Grandmaster',
  8: 'Legendary Collector',
  9: 'Mythical Shopper',
  10: 'God of Loot',
};
