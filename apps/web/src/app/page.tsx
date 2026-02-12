'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useUIStore, type Product, type RarityTier } from '@/store';
import { useProducts } from '@/lib/hooks';

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

export default function HomePage() {
  const { data } = useProducts();

  const allProducts = useMemo(() => {
    if (data?.products) return data.products.map(mapApiProduct);
    return MOCK_PRODUCTS;
  }, [data]);

  const featuredProducts = useMemo(
    () => allProducts.filter((p: Product) => p.rarityTier === 'LEGENDARY' || p.rarityTier === 'EPIC'),
    [allProducts]
  );

  return (
    <div className="relative overflow-hidden">
      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* ── Vivid Background : Animated Gradient Blobs ── */}
        <div className="absolute inset-0 bg-void-black">
          {/* Large flowing blob — Purple/Pink */}
          <div
            className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blob-1 opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(160,100,255,0.4) 0%, rgba(200,100,180,0.15) 50%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
          {/* Large flowing blob — Blue/Cyan */}
          <div
            className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blob-2 opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(80,180,255,0.35) 0%, rgba(120,80,200,0.15) 50%, transparent 70%)',
              filter: 'blur(120px)',
            }}
          />
          {/* Medium blob — Lavender (center-left) */}
          <div
            className="absolute top-[40%] left-[20%] w-[350px] h-[350px] rounded-full blob-3 opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(200,130,255,0.3) 0%, rgba(140,80,200,0.1) 60%, transparent 80%)',
              filter: 'blur(80px)',
            }}
          />
          {/* Small accent orb — Warm amber (top-right) */}
          <div
            className="absolute top-[15%] right-[20%] w-[200px] h-[200px] rounded-full orb-pulse opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(255,200,100,0.35) 0%, rgba(255,150,80,0.15) 50%, transparent 80%)',
              filter: 'blur(60px)',
            }}
          />
          {/* Particle field on top */}
          <div className="absolute inset-0 particle-bg opacity-20" />
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void-black" />

        {/* ── Hero Content : Frosted Glass Card ── */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel-light glass-highlight rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl glass-glow-border pointer-events-none" />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-stats text-xs tracking-[0.3em] text-cyber-blue mb-6 text-glow-blue"
            >
              ▸ WELCOME TO THE ULTIMATE LOOT EXPERIENCE ◂
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-heading text-7xl md:text-9xl font-black leading-[0.85] mb-8 tracking-tight"
            >
              <span className="text-neon-pink text-glow-pink">Otaku</span>
              <br className="hidden md:block" />
              <span className="text-cyber-blue text-glow-blue">Loot</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-text-secondary text-base md:text-lg max-w-xl mb-10 leading-relaxed"
            >
              Don&apos;t just shop — <span className="text-gold-rank font-semibold">loot</span>.
              Explore legendary figures, epic apparel, and rare collectibles. Every purchase
              earns XP. Level up your collection.
            </motion.p>

            {/* CTA Buttons — Glass Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="px-8 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-widest text-white relative overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ff2d7b, #b44dff)',
                  boxShadow: '0 8px 32px rgba(255,45,123,0.3)',
                }}
                onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
              >
                <span className="relative z-10">⚔️ Enter the Shop</span>
                <div className="absolute inset-0 bg-gradient-to-r from-rare-purple to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/shop"
                className="px-8 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-widest text-cyber-blue glass-button active-gomu"
                onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
              >
                🗺️ View Quests
              </Link>
            </motion.div>

            {/* Social dots (like reference image 1) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-3 mt-10"
            >
              {['🎮', '💬', '🐦'].map((icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-sm hover:scale-110 transition-transform"
                >
                  {icon}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5 glass-button">
            <div className="w-1.5 h-3 bg-cyber-blue rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ====== FEATURED DROPS ====== */}
      <section className="px-6 md:px-12 py-20 relative">
        {/* Background blobs for this section */}
        <div
          className="absolute top-0 right-[-10%] w-[400px] h-[400px] rounded-full blob-2 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-neon-pink to-transparent" />
            <span className="font-stats text-[10px] tracking-[0.3em] text-neon-pink">
              FEATURED DROPS
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            Legendary & Epic Loot
          </h2>
          <p className="text-text-secondary mt-2 max-w-xl">
            The rarest items in our vault. Limited stock — once they&apos;re gone, they&apos;re gone.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product: Product, idx: number) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* ====== ALL PRODUCTS PREVIEW ====== */}
      <section className="px-6 md:px-12 py-20 relative">
        {/* Background blob */}
        <div
          className="absolute bottom-0 left-[-8%] w-[350px] h-[350px] rounded-full blob-3 opacity-15 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,45,123,0.5) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-cyber-blue to-transparent" />
            <span className="font-stats text-[10px] tracking-[0.3em] text-cyber-blue">
              EXPLORE ALL
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary">
            The Full Inventory
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((product: Product, idx: number) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-button font-heading text-sm tracking-wide text-text-secondary hover:text-text-primary transition-all"
            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
          >
            View All Loot →
          </Link>
        </motion.div>
      </section>

      {/* ====== STATS / GAMIFICATION TEASER ====== */}
      <section className="px-6 md:px-12 py-20 relative">
        {/* Background orb */}
        <div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none orb-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(180,77,255,0.4) 0%, rgba(0,212,255,0.2) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="glass-panel-light glass-highlight rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          {/* Animated glow border */}
          <div className="absolute inset-0 rounded-3xl glass-glow-border pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              🎮 Shop. <span className="text-neon-pink text-glow-pink">Earn XP.</span>{' '}
              <span className="text-cyber-blue text-glow-blue">Level Up.</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-8">
              Every purchase earns experience points. Complete quests, unlock achievements,
              and climb the leaderboard. Your shopping cart is your weapon.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Products', value: `${allProducts.length}+`, icon: '📦' },
                { label: 'Quests', value: '50+', icon: '📜' },
                { label: 'Achievements', value: '100+', icon: '🏆' },
                { label: 'Active Users', value: '10K+', icon: '👥' },
              ].map((stat) => (
                <div key={stat.label} className="glass-panel rounded-xl p-4 space-y-1">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="font-stats text-2xl font-bold text-gold-rank text-glow-gold">
                    {stat.value}
                  </div>
                  <div className="font-stats text-[10px] tracking-wider text-text-muted uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-12 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-heading text-xl font-bold">
              <span className="text-neon-pink">Otaku</span>
              <span className="text-cyber-blue">Loot</span>
            </span>
            <p className="text-text-muted text-xs mt-1">Level up your collection</p>
          </div>
          <div className="flex gap-6 text-text-muted text-sm">
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Discord</a>
            <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
          </div>
          <div className="font-stats text-[10px] text-text-muted tracking-wider">
            © 2026 OTAKULOOT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
