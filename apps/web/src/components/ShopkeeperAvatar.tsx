'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store';
import {
  CHARACTER_REGISTRY,
  getGreeting,
  type ShopkeeperCharacter,
} from '@/lib/characters';

const MOOD_EMOJIS: Record<string, string> = {
  idle: '😊',
  greeting: '👋',
  happy: '🎉',
  sad: '😢',
  excited: '✨',
};

export default function ShopkeeperAvatar() {
  const shopkeeperMood = useUIStore((s) => s.shopkeeperMood);
  const shopkeeperMessage = useUIStore((s) => s.shopkeeperMessage);
  const setShopkeeperMood = useUIStore((s) => s.setShopkeeperMood);
  const activeShopkeeperId = useUIStore((s) => s.activeShopkeeperId);
  const setCharacterSelectorOpen = useUIStore((s) => s.setCharacterSelectorOpen);

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Get current character from registry
  const character: ShopkeeperCharacter | undefined =
    CHARACTER_REGISTRY[activeShopkeeperId];
  const themeColor = character?.themeColor || '#00d4ff';
  const glowColor = character?.glowColor || '#00d4ff';

  // Greeting on mount (character-specific)
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = getGreeting(activeShopkeeperId);
      setBubbleText(greeting);
      setShowBubble(true);
      setShopkeeperMood('greeting');

      setTimeout(() => {
        setShowBubble(false);
        setShopkeeperMood('idle');
      }, 5000);
    }, 1500);
    return () => clearTimeout(timer);
  }, [setShopkeeperMood, activeShopkeeperId]);

  // React to mood changes from cart actions
  useEffect(() => {
    if (shopkeeperMessage) {
      const startTimer = setTimeout(() => {
        setBubbleText(shopkeeperMessage);
        setShowBubble(true);
      }, 0);

      const hideTimer = setTimeout(() => {
        setShowBubble(false);
        setShopkeeperMood('idle');
      }, 3000);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [shopkeeperMessage, shopkeeperMood, setShopkeeperMood]);

  // Build avatar content: character emoji + mood indicator
  const avatarContent = useMemo(() => {
    return character?.emoji || MOOD_EMOJIS[shopkeeperMood] || '😊';
  }, [character?.emoji, shopkeeperMood]);

  const moodIndicator = useMemo(() => {
    return MOOD_EMOJIS[shopkeeperMood] || '';
  }, [shopkeeperMood]);

  if (isMinimized) {
    return (
      <motion.button
        className="fixed bottom-6 right-6 z-[70] w-12 h-12 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${themeColor}30`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${glowColor}22`,
        }}
        onClick={() => setIsMinimized(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
        onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
      >
        {avatarContent}
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-2">
      {/* Speech Bubble — Glassy with character theme tint */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="max-w-[240px] rounded-xl rounded-br-sm px-4 py-3 text-sm text-text-primary relative"
            style={{
              background: 'rgba(26,26,46,0.75)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${themeColor}25`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 20px ${glowColor}10`,
            }}
          >
            {/* Glass highlight */}
            <div
              className="absolute top-0 left-[10%] right-[10%] h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${themeColor}30, transparent)`,
              }}
            />
            {/* Character name tag */}
            <p className="text-[10px] font-bold tracking-wider uppercase mb-1 opacity-50" style={{ color: themeColor }}>
              {character?.name || 'Shopkeeper'}
            </p>
            <p>{bubbleText}</p>
            <div
              className="absolute -bottom-1 right-6 w-3 h-3 rotate-45"
              style={{
                background: 'rgba(26,26,46,0.75)',
                borderRight: `1px solid ${themeColor}25`,
                borderBottom: `1px solid ${themeColor}25`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar — Frosted Glass with Character Theme */}
      <div className="flex items-end gap-2">
        {/* Swap character button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs opacity-50 hover:opacity-100 transition-opacity"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={() => setCharacterSelectorOpen(true)}
          onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
          onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
          title="Swap character"
        >
          🔄
        </motion.button>

        {/* Main avatar */}
        <motion.div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Glow ring — character themed */}
          <div
            className="absolute inset-0 rounded-full opacity-30 animate-pulse"
            style={{
              boxShadow: `0 0 20px ${themeColor}, 0 0 40px ${glowColor}33`,
            }}
          />
          {/* Avatar body — frosted glass */}
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-3xl relative overflow-hidden cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: `1.5px solid ${themeColor}40`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 20px ${glowColor}15`,
            }}
            onClick={() => setCharacterSelectorOpen(true)}
            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
          >
            {/* Inner gradient — character themed */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${themeColor}, transparent)`,
              }}
            />
            <span className="relative z-10">{avatarContent}</span>
            {/* Mood indicator badge */}
            {shopkeeperMood !== 'idle' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -left-1 text-sm z-20"
              >
                {moodIndicator}
              </motion.span>
            )}
          </div>

          {/* Minimize button — glass */}
          <button
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-text-muted hover:text-text-primary transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => setIsMinimized(true)}
            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
          >
            ✕
          </button>
        </motion.div>
      </div>
    </div>
  );
}
