import { create } from 'zustand';
import { STARTER_CHARACTERS, DEFAULT_CHARACTER } from '@/lib/characters';

// ========================================
// Types
// ========================================
export type RarityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  rarityTier: RarityTier;
  category: string;
  image: string;
  stats: {
    quality: number;
    rarity: number;
    comfort: number;
    style: number;
    value: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CursorMode = 'default' | 'pointer' | 'grab' | 'glow';
export type ShopkeeperMood = 'idle' | 'greeting' | 'happy' | 'sad' | 'excited';

// ========================================
// UI Store
// ========================================
interface UIState {
  sidebarOpen: boolean;
  soundMuted: boolean;
  cursorMode: CursorMode;
  shopkeeperMood: ShopkeeperMood;
  shopkeeperMessage: string;
  activeShopkeeperId: string;
  unlockedShopkeepers: string[];
  characterSelectorOpen: boolean;
  // Gamification State
  xp: number;
  level: number;
  totalSpent: number;
  fastAddCount: number;
  lastAddTimestamp: number;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSound: () => void;
  setCursorMode: (mode: CursorMode) => void;
  setShopkeeperMood: (mood: ShopkeeperMood, message?: string) => void;
  setActiveShopkeeper: (id: string) => void;
  unlockShopkeeper: (id: string) => void;
  setCharacterSelectorOpen: (open: boolean) => void;
  
  // Gamification Actions
  addXp: (amount: number) => void;
  addSpent: (amount: number) => void;
  recordCartAdd: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: false,
  soundMuted: false,
  cursorMode: 'default',
  shopkeeperMood: 'greeting',
  shopkeeperMessage: '',
  activeShopkeeperId: DEFAULT_CHARACTER,
  unlockedShopkeepers: [...STARTER_CHARACTERS],
  characterSelectorOpen: false,
  
  // Initial Gamification State
  xp: 0,
  level: 1,
  totalSpent: 0,
  fastAddCount: 0,
  lastAddTimestamp: 0,

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSound: () => set((s) => ({ soundMuted: !s.soundMuted })),
  setCursorMode: (mode) => set({ cursorMode: mode }),
  setShopkeeperMood: (mood, message) =>
    set({ shopkeeperMood: mood, shopkeeperMessage: message || '' }),
  setActiveShopkeeper: (id) => set({ activeShopkeeperId: id }),
  unlockShopkeeper: (id) =>
    set((s) => ({
      unlockedShopkeepers: s.unlockedShopkeepers.includes(id)
        ? s.unlockedShopkeepers
        : [...s.unlockedShopkeepers, id],
    })),
  setCharacterSelectorOpen: (open) => set({ characterSelectorOpen: open }),

  // Gamification Implementation
  addXp: (amount) => set((s) => {
    const newXp = s.xp + amount;
    const newLevel = Math.floor(newXp / 500) + 1; // 500 XP per level
    return { xp: newXp, level: newLevel };
  }),

  addSpent: (amount) => set((s) => {
    const newTotal = s.totalSpent + amount;
    // Check Gojo Unlock: Spend > 10,000
    if (newTotal >= 10000 && !s.unlockedShopkeepers.includes('gojo')) {
      return { 
        totalSpent: newTotal,
        unlockedShopkeepers: [...s.unlockedShopkeepers, 'gojo'],
        shopkeeperMessage: "You've impressed the strongest sorcerer! Gojo Satoru is now unlocked! 👁️",
        shopkeeperMood: 'excited'
      };
    }
    return { totalSpent: newTotal };
  }),

  recordCartAdd: () => set((s) => {
    const now = Date.now();
    const timeDiff = now - s.lastAddTimestamp;
    
    // Reset if > 10 seconds since last add, otherwise increment
    let newCount = (timeDiff > 10000) ? 1 : s.fastAddCount + 1;
    
    // Check Anya Unlock: 5 items in < 10 seconds (sequence)
    // Note: The logic simplifies to "streak within window". 
    // Strict interpretation: "5 items in under 10s" means the 5th item added is <= 10s from the 1st.
    // Simplified trigger: If we hit count 5 and the gap between updates was small enough to sustain the streak.
    
    // Actually, let's just create a sliding window logic or simple timeout reset.
    // If it's been > 2.5s (average budget per item for 10s total) since last click, maybe reset?
    // Let's stick to the simple "streak within short bursts" logic.
    if (timeDiff > 5000) newCount = 1; // Reset if > 5s idle
    
    if (newCount >= 5 && !s.unlockedShopkeepers.includes('anya')) {
      return {
        fastAddCount: newCount,
        lastAddTimestamp: now,
        unlockedShopkeepers: [...s.unlockedShopkeepers, 'anya'],
        shopkeeperMessage: "Waku waku! You shop so fast! Anya Forger is now unlocked! 🥜",
        shopkeeperMood: 'excited'
      };
    }

    return { fastAddCount: newCount, lastAddTimestamp: now };
  }),
}));

// ========================================
// Cart Store
// ========================================
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
    })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
  totalPrice: () =>
    get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
}));
