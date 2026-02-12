'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store';
import { CHARACTER_REGISTRY } from '@/lib/characters';

export default function CharacterSelector() {
  const {
    characterSelectorOpen,
    setCharacterSelectorOpen,
    activeShopkeeperId,
    setActiveShopkeeper,
    unlockedShopkeepers,
  } = useUIStore();

  const characters = Object.values(CHARACTER_REGISTRY);

  const handleSelect = (id: string) => {
    if (!unlockedShopkeepers.includes(id)) return; // Can't select locked characters
    setActiveShopkeeper(id);
    setCharacterSelectorOpen(false);
  };

  return (
    <AnimatePresence>
      {characterSelectorOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={() => setCharacterSelectorOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[85] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: 'rgba(20,18,35,0.85)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Top shine */}
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-primary tracking-wide">
                    Choose Your Partner
                  </h2>
                  <p className="text-xs text-text-muted mt-1">Select your anime shopkeeper guide</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCharacterSelectorOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Character Grid */}
              <div className="grid grid-cols-1 gap-3">
                {characters.map((char) => {
                  const isUnlocked = unlockedShopkeepers.includes(char.id);
                  const isActive = activeShopkeeperId === char.id;

                  return (
                    <motion.button
                      key={char.id}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={isUnlocked ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(char.id)}
                      className={`relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                        !isUnlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${char.themeColor}15, ${char.themeColor}05)`
                          : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? char.themeColor + '40' : 'rgba(255,255,255,0.05)'}`,
                        boxShadow: isActive
                          ? `0 0 20px ${char.glowColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`
                          : 'none',
                      }}
                    >
                      {/* Avatar circle */}
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 relative overflow-hidden"
                        style={{
                          background: isUnlocked
                            ? `radial-gradient(circle at 30% 30%, ${char.themeColor}25, rgba(255,255,255,0.04))`
                            : 'rgba(255,255,255,0.02)',
                          border: `1.5px solid ${isUnlocked ? char.themeColor + '40' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {isUnlocked ? (
                          <span className="relative z-10">{char.emoji}</span>
                        ) : (
                          <span className="relative z-10 text-lg">🔒</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className="font-heading font-bold text-sm truncate"
                            style={{ color: isUnlocked ? char.themeColor : 'rgba(255,255,255,0.3)' }}
                          >
                            {isUnlocked ? char.name : '???'}
                          </h3>
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase"
                              style={{
                                background: `${char.themeColor}20`,
                                color: char.themeColor,
                                border: `1px solid ${char.themeColor}30`,
                              }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5 truncate">
                          {isUnlocked ? (
                            <>
                              <span className="opacity-60">{char.anime}</span>
                              <span className="mx-1.5 opacity-30">·</span>
                              <span className="italic opacity-50">&ldquo;{char.catchphrase}&rdquo;</span>
                            </>
                          ) : (
                            <span className="text-text-muted/50">🔐 {char.unlockHint}</span>
                          )}
                        </p>
                      </div>

                      {/* Selection indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute right-3 w-3 h-3 rounded-full"
                          style={{
                            background: char.themeColor,
                            boxShadow: `0 0 10px ${char.glowColor}60`,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <p className="text-[10px] text-text-muted/40 text-center mt-4 tracking-wide">
                🔓 Unlock secret characters through shopping achievements
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
