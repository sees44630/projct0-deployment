'use client';

import { use, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { getProductBySlug, MOCK_PRODUCTS } from '@/lib/data';
import { badgeVariants, RARITY_COLORS, CATEGORY_THEMES, cn } from '@/lib/utils';
import RadarChart from '@/components/RadarChart';
import ProductCard from '@/components/ProductCard';
import { useUIStore, useCartStore, type Product, type RarityTier } from '@/store';
import Link from 'next/link';
import { useProduct, useProducts } from '@/lib/hooks';

// Dynamic import for Three.js viewer (heavy, SSR disabled)
const ProductViewer3D = dynamic(() => import('@/components/ProductViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="aspect-square rounded-2xl bg-void-surface/50 flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
    </div>
  ),
});

interface ProductDetailClientProps {
  params: Promise<{ slug: string }>;
}

/** Map GraphQL product → frontend Product type */
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

export default function ProductDetailClient({ params }: ProductDetailClientProps) {
  const { slug } = use(params);

  // Fetch from API
  const { data: apiData, isLoading } = useProduct(slug);
  const { data: allData } = useProducts();

  // Resolve product: API first, then fallback to mock
  const product = useMemo(() => {
    if (apiData?.product) return mapApiProduct(apiData.product);
    return getProductBySlug(slug) || null;
  }, [apiData, slug]);

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    if (allData?.products) {
      return allData.products
        .map(mapApiProduct)
        .filter((p: Product) => p.category === product.category && p.id !== product.id);
    }
    return MOCK_PRODUCTS.filter(
      (p) => p.category === product.category && p.id !== product.id
    );
  }, [allData, product]);

  const addItem = useCartStore((s) => s.addItem);
  const setShopkeeperMood = useUIStore((s) => s.setShopkeeperMood);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin mx-auto" />
          <p className="font-stats text-xs tracking-[0.3em] text-text-muted animate-pulse">
            LOADING ITEM DATA...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">💀</p>
          <h1 className="font-heading text-2xl font-bold mb-2">Item Not Found</h1>
          <p className="text-text-secondary mb-6">This loot doesn&apos;t exist in our vault.</p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-neon-pink text-white font-heading text-sm rounded-lg"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const color = RARITY_COLORS[product.rarityTier];
  const theme = CATEGORY_THEMES[product.category] || CATEGORY_THEMES.default;

  const handleAddToCart = () => {
    addItem(product);
    setShopkeeperMood(
      'excited',
      product.rarityTier === 'LEGENDARY'
        ? '🔥 LEGENDARY DROP secured!! You have elite taste!'
        : '🎉 Great loot! Added to your inventory!'
    );
  };

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, ${theme.accent}22, transparent 60%)`,
        }}
      />

      <div className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-xs font-stats text-text-muted mb-8 tracking-wider"
        >
          <Link href="/shop" className="hover:text-text-primary transition-colors">
            SHOP
          </Link>
          <span>▸</span>
          <span className="text-text-secondary">{product.title.toUpperCase()}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Product Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 3D Viewer + fallback overlay */}
            <div className="relative">
              <ProductViewer3D rarityTier={product.rarityTier} />

              {/* Rarity badge overlay */}
              <div className="absolute top-4 left-4 z-10">
                <span className={cn(badgeVariants({ rarity: product.rarityTier, size: 'md' }))}>
                  ★ {product.rarityTier}
                </span>
              </div>

              {/* Rarity glow line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 z-10 rounded-b-2xl"
                style={{
                  background: color.color,
                  boxShadow: `0 0 20px ${color.color}, 0 0 40px ${color.glow}`,
                }}
              />
            </div>
          </motion.div>

          {/* Right — Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Category */}
            <div className="font-stats text-[10px] tracking-[0.3em] text-text-muted uppercase">
              {product.category} COLLECTION
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-stats text-4xl font-bold"
                style={{ color: color.color }}
              >
                ${product.price.toFixed(2)}
              </span>
              <span className="font-stats text-xs text-text-muted tracking-wider">
                + 50 XP ON PURCHASE
              </span>
            </div>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">
              {product.description}
            </p>

            {/* Stats Radar Chart */}
            <div className="py-4">
              <h3 className="font-stats text-xs tracking-[0.2em] text-text-muted mb-4 uppercase">
                ▸ ITEM STATS
              </h3>
              <div className="flex justify-center">
                <RadarChart
                  stats={product.stats}
                  rarityTier={product.rarityTier}
                  size={250}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 px-6 py-4 bg-neon-pink text-white font-heading font-bold text-sm uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(255,45,123,0.4)] transition-all duration-300 relative overflow-hidden group"
                onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
              >
                <span className="relative z-10">⚔️ Loot This Item</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-rare-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-4 border-2 border-cyber-blue text-cyber-blue font-heading font-bold text-sm uppercase tracking-widest rounded-lg hover:bg-cyber-blue/10 transition-all"
                onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
              >
                ♡
              </motion.button>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-6 border-t border-void-elevated/30">
              {[
                { label: 'Ships in', value: '2-5 days', icon: '📦' },
                { label: 'Returns', value: '30 days', icon: '🔄' },
                { label: 'XP Bonus', value: '+50 XP', icon: '✨' },
              ].map((info) => (
                <div key={info.label} className="text-center">
                  <div className="text-xl mb-1">{info.icon}</div>
                  <div className="font-stats text-xs text-text-primary">{info.value}</div>
                  <div className="font-stats text-[10px] text-text-muted tracking-wider mt-0.5">
                    {info.label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Items */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="font-heading text-2xl font-bold mb-8">
              More from <span style={{ color: theme.accent }}>{product.category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p: Product, idx: number) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
