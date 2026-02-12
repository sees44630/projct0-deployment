'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlClient } from './graphql-client';
import {
  GET_PRODUCTS, GET_PRODUCT, SEARCH_PRODUCTS, GET_CATEGORIES,
  REGISTER, LOGIN, GET_ME,
  GET_CART, ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART,
  GET_LEVEL_PROGRESS, AWARD_XP,
} from './queries';

// ========================================
// Types (mirroring GraphQL schema)
// ========================================

export interface ProductStats {
  quality: number;
  rarity: number;
  comfort: number;
  style: number;
  value: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  rarityTier: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  category?: Category;
  stats?: ProductStats;
  skus?: { id: string; size?: string; color?: string; stockQuantity: number }[];
  assets?: { id: string; type: string; url: string }[];
}

export interface UserProfile {
  displayName: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  currentTitle: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  profile?: UserProfile;
}

export interface CartItemGQL {
  id: string;
  productId: string;
  skuId?: string;
  quantity: number;
}

// ========================================
// Product Hooks
// ========================================

export function useProducts(category?: string, rarityTier?: string) {
  return useQuery<{ products: Product[] }>({
    queryKey: ['products', category, rarityTier],
    queryFn: () => gqlClient.request(GET_PRODUCTS, { category, rarityTier: rarityTier || undefined }),
  });
}

export function useProduct(slug: string) {
  return useQuery<{ product: Product | null }>({
    queryKey: ['product', slug],
    queryFn: () => gqlClient.request(GET_PRODUCT, { slug }),
    enabled: !!slug,
  });
}

export function useSearchProducts(query: string) {
  return useQuery<{ searchProducts: Product[] }>({
    queryKey: ['search', query],
    queryFn: () => gqlClient.request(SEARCH_PRODUCTS, { query }),
    enabled: query.length > 1,
  });
}

export function useCategories() {
  return useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => gqlClient.request(GET_CATEGORIES),
  });
}

// ========================================
// Auth Hooks
// ========================================

export function useMe() {
  return useQuery<{ me: User | null }>({
    queryKey: ['me'],
    queryFn: () => gqlClient.request(GET_ME),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('otakuloot_token'),
    retry: false,
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { email: string; password: string; displayName: string }) =>
      gqlClient.request<{ register: { accessToken: string; user: User } }>(REGISTER, vars),
    onSuccess: (data) => {
      localStorage.setItem('otakuloot_token', data.register.accessToken);
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { email: string; password: string }) =>
      gqlClient.request<{ login: { accessToken: string; user: User } }>(LOGIN, vars),
    onSuccess: (data) => {
      localStorage.setItem('otakuloot_token', data.login.accessToken);
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

// ========================================
// Cart Hooks
// ========================================

export function useCart() {
  return useQuery<{ cart: CartItemGQL[] }>({
    queryKey: ['cart'],
    queryFn: () => gqlClient.request(GET_CART),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('otakuloot_token'),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { productId: string; quantity?: number; skuId?: string }) =>
      gqlClient.request(ADD_TO_CART, vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { cartItemId: string }) =>
      gqlClient.request(REMOVE_FROM_CART, vars),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => gqlClient.request(CLEAR_CART),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
}

// ========================================
// Gamification Hooks
// ========================================

export function useLevelProgress() {
  return useQuery<{
    levelProgress: {
      level: number;
      xp: number;
      xpForNextLevel: number;
      xpFromCurrentLevel: number;
      xpNeeded: number;
      progress: number;
      currentTitle: string;
    };
  }>({
    queryKey: ['levelProgress'],
    queryFn: () => gqlClient.request(GET_LEVEL_PROGRESS),
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('otakuloot_token'),
  });
}

export function useAwardXP() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { amount: number }) => gqlClient.request(AWARD_XP, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['levelProgress'] });
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
