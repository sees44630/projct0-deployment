'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useUIStore, type Product, type RarityTier } from '@/store';
import { useProducts } from '@/lib/hooks';

const CATEGORIES = ['all', 'cyberpunk', 'mecha', 'fantasy', 'kawaii', 'slice-of-life'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rarity', label: 'Rarity' },
];
const RARITY_ORDER: Record<string, number> = { COMMON: 0, UNCOMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 4 };

function mapApiProduct(p: {
  id: string; title: string; slug: string; description: string; price: number;
  rarityTier: string; category?: { slug: string } | null;
  stats?: { quality: number; rarity: number; comfort: number; style: number; value: number } | null;
}): Product {
  return {
    id: p.id, title: p.title, slug: p.slug, description: p.description,
    price: p.price, rarityTier: p.rarityTier as RarityTier,
    category: p.category?.slug || 'cyberpunk', image: '',
    stats: p.stats || { quality: 50, rarity: 50, comfort: 50, style: 50, value: 50 },
  };
}

export default function ShopPage() {
  const { data, error } = useProducts();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');

  const allProducts = useMemo(() => {
    if (data?.products) return data.products.map(mapApiProduct);
    return MOCK_PRODUCTS;
  }, [data]);

  const filtered = useMemo(() => {
    let result = category === 'all' ? allProducts : allProducts.filter((p) => p.category === category);
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === 'rarity') result = [...result].sort((a, b) => (RARITY_ORDER[b.rarityTier] || 0) - (RARITY_ORDER[a.rarityTier] || 0));
    return result;
  }, [allProducts, category, sort]);

  return (
    <div className="relative min-h-screen">
      {/* ── Background Blobs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full blob-1 opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(160,100,255,0.35) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[-8%] w-[400px] h-[400px] rounded-full blob-2 opacity-12"
          style={{
            background: 'radial-gradient(circle, rgba(80,180,255,0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute top-[60%] left-[40%] w-[300px] h-[300px] rounded-full blob-3 opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(200,130,255,0.25) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* ── Page Header ── */}
      <div className="px-6 md:px-12 pt-32 pb-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-neon-pink to-transparent" />
            <span className="font-stats text-[10px] tracking-[0.3em] text-neon-pink">THE VAULT</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            All <span className="text-cyber-blue text-glow-blue">Loot</span>
          </h1>
        </motion.div>

        {/* ── Filter Bar — Frosted Glass ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel glass-highlight rounded-2xl p-4 relative overflow-hidden"
        >
          <div className="flex flex-wrap items-center gap-4 relative z-10">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-stats text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    category === cat
                      ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                      : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                  onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-2">
              <span className="font-stats text-[10px] text-text-muted tracking-wider">SORT:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-white/5 border border-white/10 text-text-primary text-xs px-3 py-2 rounded-lg backdrop-blur-xl focus:outline-none focus:border-cyber-blue/50 transition-all"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-void-deep">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Product Grid ── */}
      <div className="px-6 md:px-12 pb-20">
        {error && (
          <div className="glass-panel rounded-xl p-6 text-center mb-6">
            <p className="text-neon-pink text-sm">⚠️ Failed to load live data — showing demo products</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={category + sort}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="glass-panel-light rounded-2xl p-12 text-center mt-8">
            <p className="text-text-muted text-lg">No items found in this category.</p>
          </div>
        )}

        {/* Item count */}
        <div className="mt-8 text-center">
          <span className="font-stats text-[10px] text-text-muted tracking-wider">
            {filtered.length} ITEM{filtered.length !== 1 ? 'S' : ''} · FILTERS: {category.toUpperCase()} / {SORT_OPTIONS.find((s) => s.value === sort)?.label?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
