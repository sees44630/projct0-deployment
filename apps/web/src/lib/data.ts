import type { Product } from '@/store';

// ========================================
// Mock Product Data (replaces API in Phase 1)
// ========================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Cyberpunk Neon Katana Figure',
    slug: 'cyberpunk-neon-katana-figure',
    description: 'A limited-edition 1/7 scale figure featuring a cybernetic samurai wielding dual plasma katanas. Hand-painted with UV-reactive neon accents that glow under blacklight.',
    price: 249.99,
    rarityTier: 'LEGENDARY',
    category: 'cyberpunk',
    image: '/products/cyber-katana.webp',
    stats: { quality: 95, rarity: 98, comfort: 60, style: 99, value: 85 },
  },
  {
    id: '2',
    title: 'Mecha Pilot Bomber Jacket',
    slug: 'mecha-pilot-bomber-jacket',
    description: 'Heavyweight satin bomber with embroidered mecha unit patches. Features an internal heads-up display pocket and reinforced stitching for maximum durability.',
    price: 189.99,
    rarityTier: 'EPIC',
    category: 'mecha',
    image: '/products/mecha-jacket.webp',
    stats: { quality: 88, rarity: 75, comfort: 92, style: 90, value: 80 },
  },
  {
    id: '3',
    title: 'Sakura Spirit Hoodie',
    slug: 'sakura-spirit-hoodie',
    description: 'Ultra-soft oversized hoodie featuring hand-drawn cherry blossom spirits. Made from 100% organic cotton with a hidden kangaroo pocket.',
    price: 79.99,
    rarityTier: 'RARE',
    category: 'slice-of-life',
    image: '/products/sakura-hoodie.webp',
    stats: { quality: 80, rarity: 65, comfort: 97, style: 85, value: 90 },
  },
  {
    id: '4',
    title: 'Dragon Slayer Resin Statue',
    slug: 'dragon-slayer-resin-statue',
    description: 'Massive 16-inch resin statue depicting the climactic battle scene. Features LED-illuminated dragon flame effects and a magnetic interchangeable weapon system.',
    price: 449.99,
    rarityTier: 'LEGENDARY',
    category: 'fantasy',
    image: '/products/dragon-statue.webp',
    stats: { quality: 99, rarity: 95, comfort: 50, style: 98, value: 70 },
  },
  {
    id: '5',
    title: 'Hero Academy Training Tee',
    slug: 'hero-academy-training-tee',
    description: 'Performance mesh training shirt with moisture-wicking technology. Features the iconic academy crest with reflective printing for night visibility.',
    price: 34.99,
    rarityTier: 'COMMON',
    category: 'shonen',
    image: '/products/hero-tee.webp',
    stats: { quality: 70, rarity: 40, comfort: 85, style: 75, value: 95 },
  },
  {
    id: '6',
    title: 'Void Walker Sneakers',
    slug: 'void-walker-sneakers',
    description: 'Custom-designed sneakers with holographic void energy panels. RGB LED soles that sync via Bluetooth to your music. Limited to 500 pairs worldwide.',
    price: 329.99,
    rarityTier: 'EPIC',
    category: 'cyberpunk',
    image: '/products/void-sneakers.webp',
    stats: { quality: 90, rarity: 88, comfort: 82, style: 96, value: 72 },
  },
  {
    id: '7',
    title: 'Spirit Fox Plushie',
    slug: 'spirit-fox-plushie',
    description: 'Cuddly kitsune plushie with nine detachable magnetic tails. Each tail represents a different emotion. Extremely soft and huggable.',
    price: 29.99,
    rarityTier: 'UNCOMMON',
    category: 'slice-of-life',
    image: '/products/fox-plushie.webp',
    stats: { quality: 75, rarity: 55, comfort: 99, style: 80, value: 92 },
  },
  {
    id: '8',
    title: 'Astral Mech Model Kit',
    slug: 'astral-mech-model-kit',
    description: 'Perfect Grade 1/60 scale model kit with over 2000 pieces. Features full LED unit, opening cockpit, and articulated fingers. Includes display base with nameplate.',
    price: 199.99,
    rarityTier: 'RARE',
    category: 'mecha',
    image: '/products/astral-mech.webp',
    stats: { quality: 92, rarity: 78, comfort: 55, style: 88, value: 85 },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}
