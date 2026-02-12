'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LootRevealProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    title: string;
    rarityTier: string;
    price: number;
  }>;
}

const RARITY_COLORS: Record<string, { color: string; glow: string; label: string }> = {
  COMMON: { color: '#9ca3af', glow: '0 0 20px #9ca3af', label: '★ COMMON' },
  UNCOMMON: { color: '#4ade80', glow: '0 0 30px #4ade80', label: '★★ UNCOMMON' },
  RARE: { color: '#60a5fa', glow: '0 0 40px #60a5fa', label: '★★★ RARE' },
  EPIC: { color: '#a78bfa', glow: '0 0 50px #a78bfa, 0 0 100px #a78bfa33', label: '★★★★ EPIC' },
  LEGENDARY: { color: '#fbbf24', glow: '0 0 60px #fbbf24, 0 0 120px #fbbf2433', label: '★★★★★ LEGENDARY' },
};

function LootCard({
  item,
  index,
}: {
  item: { title: string; rarityTier: string; price: number };
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const colors = RARITY_COLORS[item.rarityTier] || RARITY_COLORS.RARE;

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 600 + index * 400);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      initial={{ rotateY: 180, scale: 0.8 }}
      animate={{
        rotateY: revealed ? 0 : 180,
        scale: revealed ? 1 : 0.8,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        delay: index * 0.1,
      }}
      className="relative"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <motion.div
        animate={
          revealed
            ? { boxShadow: colors.glow, borderColor: colors.color }
            : {}
        }
        className="w-full aspect-[3/4] rounded-xl border-2 border-void-elevated overflow-hidden"
        style={{
          background: revealed
            ? `linear-gradient(180deg, ${colors.color}15, ${colors.color}05)`
            : 'linear-gradient(180deg, #1a1625, #0d0b14)',
        }}
      >
        {revealed ? (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl mb-3"
            >
              {item.rarityTier === 'LEGENDARY' ? '⚡'
                : item.rarityTier === 'EPIC' ? '💎'
                : item.rarityTier === 'RARE' ? '✨'
                : item.rarityTier === 'UNCOMMON' ? '🌟'
                : '⭐'}
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-stats text-[9px] tracking-[0.3em] mb-2"
              style={{ color: colors.color }}
            >
              {colors.label}
            </motion.span>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-heading text-sm font-bold text-text-primary line-clamp-2 mb-2"
            >
              {item.title}
            </motion.h3>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-stats text-lg font-bold"
              style={{ color: colors.color }}
            >
              ${item.price.toFixed(2)}
            </motion.span>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <motion.span
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🎴
            </motion.span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GachaLootReveal({ isOpen, onClose, items }: LootRevealProps) {
  // Pre-generate random values for particles using useState initializer (runs once, not during re-render)
  const [particleData] = useState(
    () =>
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 800,
        duration: 3 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
  );

  if (!isOpen || items.length === 0) return null;

  const bestRarity = items.reduce((best, item) => {
    const order = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    return order.indexOf(item.rarityTier) > order.indexOf(best) ? item.rarityTier : best;
  }, items[0].rarityTier);

  const bestColors = RARITY_COLORS[bestRarity] || RARITY_COLORS.RARE;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-void-black/95 backdrop-blur-lg"
      >
        {/* Ambient particles */}
        {particleData.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: p.x, y: 700 }}
            animate={{ opacity: [0, 0.6, 0], y: -50 }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: bestColors.color }}
          />
        ))}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="font-stats text-[10px] tracking-[0.4em] text-text-muted mb-2">
            ▸ ORDER CONFIRMED ◂
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-black text-text-primary">
            Your <span style={{ color: bestColors.color }}>Loot</span> Has Arrived
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className={`grid gap-4 px-6 max-w-4xl w-full ${
          items.length <= 2 ? 'grid-cols-2 max-w-md'
            : items.length <= 4 ? 'grid-cols-2 md:grid-cols-4'
            : 'grid-cols-3 md:grid-cols-5'
        }`}>
          {items.map((item, idx) => (
            <LootCard key={idx} item={item} index={idx} />
          ))}
        </div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: items.length * 0.4 + 1 }}
          onClick={onClose}
          className="mt-8 px-8 py-3 border-2 border-text-muted text-text-secondary font-heading text-sm uppercase tracking-widest rounded-lg hover:border-text-primary hover:text-text-primary transition-all"
        >
          Claim Loot
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
