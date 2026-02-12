
import { motion } from 'framer-motion';
import Link from 'next/link';
import { badgeVariants, RARITY_COLORS, cn } from '@/lib/utils';
import { useUIStore, useCartStore, type Product } from '@/store';
import { useShopkeeper } from '@/hooks/useShopkeeper';
import { CursedEnergy, MenacingParticles } from '@/components/AnimeEffects';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const recordCartAdd = useUIStore((s) => s.recordCartAdd);
  const { reactTo } = useShopkeeper();
  const color = RARITY_COLORS[product.rarityTier];
  const isLegendary = product.rarityTier === 'LEGENDARY';
  const isEpicOrHigher = ['EPIC', 'LEGENDARY'].includes(product.rarityTier);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    recordCartAdd(); 
    reactTo('ADD_TO_CART', {
      productName: product.title,
      rarity: product.rarityTier,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/shop/${product.slug}`}>
        {isEpicOrHigher ? (
          <CursedEnergy intensity={isLegendary ? 'high' : 'low'}>
            <CardContent product={product} color={color} handleAddToCart={handleAddToCart} isLegendary={isLegendary} />
          </CursedEnergy>
        ) : (
          <CardContent product={product} color={color} handleAddToCart={handleAddToCart} isLegendary={isLegendary} />
        )}
      </Link>
    </motion.div>
  );
}

interface CardContentProps {
  product: Product;
  color: { color: string; glow: string };
  handleAddToCart: (e: React.MouseEvent) => void;
  isLegendary: boolean;
}

/** Category-specific soft gradient palettes */
const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; emoji: string }> = {
  cyberpunk:      { from: '#1a1040', to: '#0d0a2a', emoji: '🤖' },
  mecha:          { from: '#0f1a2e', to: '#0a1020', emoji: '🔧' },
  'slice-of-life':{ from: '#1a1028', to: '#120a22', emoji: '🌸' },
  kawaii:          { from: '#1e0f28', to: '#14081e', emoji: '🌸' },
  fantasy:        { from: '#12182e', to: '#0a0e1e', emoji: '🐉' },
};

function CardContent({ product, color, handleAddToCart, isLegendary }: CardContentProps) {
  const catGradient = CATEGORY_GRADIENTS[product.category] || { from: '#14122a', to: '#0d0b1e', emoji: '⚡' };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-500",
        "glass-panel",
        "hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
      )}
      style={{
        borderColor: `${color.color}22`,
      }}
      onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
      onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
    >
      {/* Soft top shine */}
      <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none" />

      {/* Menacing particles (only legendary) */}
      {isLegendary && <MenacingParticles />}

      {/* ── Image Area — Soft gradient background ── */}
      <div className="relative aspect-square overflow-hidden">
        {/* Soft gradient BG instead of harsh dark */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `linear-gradient(160deg, ${catGradient.from}, ${catGradient.to})`,
          }}
        />

        {/* Subtle radial glow from rarity color */}
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${color.color}30, transparent 70%)`,
          }}
        />

        {/* Emoji icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl opacity-30 group-hover:opacity-50 transition-all duration-500 group-hover:scale-110 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {catGradient.emoji}
          </span>
        </div>

        {/* Rarity Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className={cn(badgeVariants({ rarity: product.rarityTier }), "shadow-lg")}>
            {product.rarityTier}
          </span>
        </div>

        {/* Soft bottom fade into content area */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[rgba(20,18,35,0.8)] to-transparent pointer-events-none" />
      </div>

      {/* ── Content Area ── */}
      <div className="p-4 space-y-3 relative z-10">
        <h3 className="font-heading font-bold text-base text-text-primary line-clamp-2 group-hover:text-cyber-blue transition-colors duration-300 tracking-wide">
          {product.title}
        </h3>

        {/* Stats bars — gentle, thin */}
        <div className="flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
          {Object.entries(product.stats).map(([key, val]: [string, any]) => (
            <div
              key={key}
              className="flex-1 h-[3px] bg-white/[0.04] rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${color.color}88, ${color.color})`,
                  boxShadow: `0 0 4px ${color.glow}40`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <span
            className="font-stats text-xl font-bold tracking-tight"
            style={{ color: color.color, textShadow: `0 0 8px ${color.glow}40` }}
          >
            ${product.price.toFixed(2)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="active-gomu px-4 py-1.5 glass-button text-white/80 hover:text-white text-xs font-heading font-bold tracking-wider rounded-lg uppercase transition-all duration-300 hover:border-white/15"
          >
            + Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
