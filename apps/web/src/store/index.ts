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
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSound: () => void;
  setCursorMode: (mode: CursorMode) => void;
  setShopkeeperMood: (mood: ShopkeeperMood, message?: string) => void;
  setActiveShopkeeper: (id: string) => void;
  unlockShopkeeper: (id: string) => void;
  setCharacterSelectorOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  soundMuted: false,
  cursorMode: 'default',
  shopkeeperMood: 'greeting',
  shopkeeperMessage: '',
  activeShopkeeperId: DEFAULT_CHARACTER,
  unlockedShopkeepers: [...STARTER_CHARACTERS],
  characterSelectorOpen: false,
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
