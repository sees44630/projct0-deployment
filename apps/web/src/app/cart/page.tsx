'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useUIStore } from '@/store';
import { RARITY_COLORS, badgeVariants, cn } from '@/lib/utils';
import Link from 'next/link';
import GachaLootReveal from '@/components/GachaLootReveal';
import { triggerLevelUp } from '@/components/LevelUpOverlay';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const setShopkeeperMood = useUIStore((s) => s.setShopkeeperMood);
  // Gamification Hooks (atomic selectors to avoid re-render loops)
  const xp = useUIStore((s) => s.xp);
  const level = useUIStore((s) => s.level);
  const addXp = useUIStore((s) => s.addXp);
  const addSpent = useUIStore((s) => s.addSpent);
  
  const [showLootReveal, setShowLootReveal] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<Array<{ title: string; rarityTier: string; price: number }>>([]);

  const handleRemove = (productId: string) => {
    removeItem(productId);
    setShopkeeperMood('sad', '😢 Aww... you removed that? I thought it was a great pick...');
  };

  const handleCheckout = () => {
    setShopkeeperMood('excited', '✨ AMAZING! Time to summon your loot! Proceeding to checkout...');

    // Capture items for loot reveal before clearing
    const lootItems = items.map((item) => ({
      title: item.product.title,
      rarityTier: item.product.rarityTier,
      price: item.product.price * item.quantity,
    }));
    setCheckoutItems(lootItems);
    setShowLootReveal(true);
  };

  const handleClaimLoot = () => {
    setShowLootReveal(false);
    setCheckoutItems([]);

    // Calculate Rewards
    const orderTotal = totalPrice();
    const xpEarned = items.length * 50;
    
    // Check for Level Up
    const currentLevel = level;
    const newTotalXp = xp + xpEarned;
    const newLevel = Math.floor(newTotalXp / 500) + 1;
    
    // Apply Rewards
    addXp(xpEarned);
    addSpent(orderTotal);
    
    if (newLevel > currentLevel) {
      triggerLevelUp({
        newLevel: newLevel,
        newTitle: getLevelTitle(newLevel),
        xpGained: xpEarned,
      });
      setShopkeeperMood('excited', `🎉 LEVEL UP! You are now Level ${newLevel}! Keep it up, collector!`);
    } else {
      setShopkeeperMood('happy', `🎉 Loot claimed! You earned ${xpEarned} XP! Current Level: ${currentLevel}`);
    }

    clearCart();
  };

  // Helper for titles
  const getLevelTitle = (lvl: number) => {
    if (lvl === 1) return 'Novice Collector';
    if (lvl === 2) return 'Apprentice Collector';
    if (lvl === 3) return 'Journeyman Otaku';
    if (lvl === 4) return 'Expert Weeb';
    if (lvl >= 5) return 'Master Curator';
    return 'Legendary Collector';
  };

  if (items.length === 0 && !showLootReveal) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-6 animate-float">🎒</div>
          <h1 className="font-heading text-3xl font-bold mb-3">Your Inventory is Empty</h1>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            No loot yet? Head to the shop and start collecting. Every item earns you XP!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neon-pink text-white font-heading font-bold text-sm uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(255,45,123,0.4)] transition-all"
            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
          >
            ⚔️ Go Loot Hunting
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Gacha Loot Reveal Overlay */}
      <GachaLootReveal
        isOpen={showLootReveal}
        onClose={handleClaimLoot}
        items={checkoutItems}
      />

      <div className="px-6 md:px-12 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-gold-rank to-transparent" />
            <span className="font-stats text-[10px] tracking-[0.3em] text-gold-rank">
              YOUR LOOT
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-4xl font-bold">
              Inventory <span className="text-gold-rank text-glow-gold">Bag</span>
            </h1>
            <button
              onClick={clearCart}
              className="text-xs font-stats text-text-muted hover:text-legendary-red transition-colors tracking-wider"
              onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
              onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
            >
              CLEAR ALL
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, idx) => {
                const color = RARITY_COLORS[item.product.rarityTier];
                return (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-void-surface/60 border rounded-xl p-4 flex gap-4 relative overflow-hidden"
                    style={{ borderColor: `${color.color}22` }}
                  >
                    {/* Rarity indicator */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ background: color.color }}
                    />

                    {/* Image placeholder */}
                    <div
                      className="w-20 h-20 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${color.color}10` }}
                    >
                      <span className="text-3xl opacity-30">
                        {item.product.category === 'cyberpunk' ? '🤖' :
                         item.product.category === 'mecha' ? '🔧' :
                         item.product.category === 'slice-of-life' || item.product.category === 'kawaii' ? '🌸' :
                         item.product.category === 'fantasy' ? '🐉' : '⚡'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-heading text-sm font-semibold line-clamp-1">
                            {item.product.title}
                          </h3>
                          <span className={cn(badgeVariants({ rarity: item.product.rarityTier }), 'mt-1')}>
                            {item.product.rarityTier}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          className="text-text-muted hover:text-legendary-red transition-colors text-sm shrink-0"
                          onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                          onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded bg-void-black/50 border border-void-elevated text-text-muted hover:text-text-primary hover:border-cyber-blue/30 transition-all flex items-center justify-center text-xs font-stats"
                            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                          >
                            −
                          </button>
                          <span className="font-stats text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded bg-void-black/50 border border-void-elevated text-text-muted hover:text-text-primary hover:border-cyber-blue/30 transition-all flex items-center justify-center text-xs font-stats"
                            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span
                          className="font-stats text-lg font-bold"
                          style={{ color: color.color }}
                        >
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:sticky lg:top-[100px] h-fit"
          >
            <div className="bg-void-surface/60 border border-void-elevated/30 rounded-2xl p-6 space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/3 to-cyber-blue/3 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <h2 className="font-heading text-lg font-bold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-stats">${totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Shipping</span>
                    <span className="font-stats text-uncommon-green">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">XP Earned</span>
                    <span className="font-stats text-gold-rank">+{items.length * 50} XP</span>
                  </div>
                  <div className="h-px bg-void-elevated/50" />
                  <div className="flex justify-between">
                    <span className="font-heading font-bold">Total</span>
                    <span className="font-stats text-xl font-bold text-neon-pink text-glow-pink">
                      ${totalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full px-6 py-4 bg-gradient-to-r from-neon-pink to-rare-purple text-white font-heading font-bold text-sm uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(255,45,123,0.4)] transition-all duration-300 relative overflow-hidden"
                  onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                  onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                >
                  ✨ Summon Order
                </motion.button>

                <p className="text-center text-text-muted text-[10px] font-stats tracking-wider">
                  SECURE CHECKOUT • FREE RETURNS • +XP REWARDS
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
