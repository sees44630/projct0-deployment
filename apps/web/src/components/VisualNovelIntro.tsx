import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { MenacingParticles, CursedEnergy } from '@/components/AnimeEffects';

// ─── RPG Classes available for selection ───
const RPG_CLASSES = [
  {
    id: 'collector',
    name: 'Collector',
    icon: '📦',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.3)',
    description: 'Masters of acquisition. +15% XP on purchases, exclusive early-access drops.',
    stat1: { label: 'Luck', value: 85 },
    stat2: { label: 'Discovery', value: 90 },
    stat3: { label: 'Endurance', value: 60 },
    perk: '🎁 Daily Mystery Crate',
  },
  {
    id: 'warrior',
    name: 'Warrior',
    icon: '⚔️',
    color: '#ff2d7b',
    glow: 'rgba(255,45,123,0.3)',
    description: 'Fearless hunters of rare loot. +20% chance for bonus rarity upgrades.',
    stat1: { label: 'Strength', value: 95 },
    stat2: { label: 'Courage', value: 88 },
    stat3: { label: 'Focus', value: 70 },
    perk: '🗡️ Rarity Reroll Token',
  },
  {
    id: 'mage',
    name: 'Mage',
    icon: '🔮',
    color: '#b44dff',
    glow: 'rgba(180,77,255,0.3)',
    description: 'Wielders of arcane knowledge. Unlock hidden items and secret quests.',
    stat1: { label: 'Wisdom', value: 92 },
    stat2: { label: 'Insight', value: 88 },
    stat3: { label: 'Magic', value: 95 },
    perk: '✨ Secret Shop Access',
  },
  {
    id: 'rogue',
    name: 'Rogue',
    icon: '🗡️',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.3)',
    description: 'Shadow dealers. Flash sale alerts 10min early + exclusive discount codes.',
    stat1: { label: 'Speed', value: 90 },
    stat2: { label: 'Stealth', value: 85 },
    stat3: { label: 'Haggle', value: 92 },
    perk: '⚡ Flash Sale Scout',
  },
];

// ─── Dialogue script ───
const DIALOGUE_SCENES = [
  {
    speaker: 'Sensei',
    avatar: '👴',
    lines: [
      'Welcome, young adventurer...',
      'You have entered the realm of OtakuLoot.',
      'Here, every purchase is a quest. Every item, a treasure.',
    ],
  },
  {
    speaker: 'Sensei',
    avatar: '👴',
    lines: [
      'But before your journey begins...',
      'You must choose your class.',
      'Each path grants unique abilities and rewards.',
    ],
  },
];

// ─── Typewriter hook ───
function useTypewriter(text: string, speed: number = 40, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayed('');
      setIsDone(false);
      return;
    }
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, isDone };
}

// ─── Stat bar component ───
function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-stats text-[9px] tracking-wider text-text-muted w-16 uppercase">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
        />
      </div>
      <span className="font-stats text-[9px] text-text-muted w-6 text-right">{value}</span>
    </div>
  );
}

// ─── Main Visual Novel Intro Component ───
interface VisualNovelIntroProps {
  onComplete: (selectedClass: string) => void;
}

export default function VisualNovelIntro({ onComplete }: VisualNovelIntroProps) {
  const [phase, setPhase] = useState<'dialogue' | 'selection' | 'confirm'>('dialogue');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const currentScene = DIALOGUE_SCENES[sceneIndex];
  const currentLine = currentScene?.lines[lineIndex] || '';

  const { displayed, isDone } = useTypewriter(currentLine, 35, phase === 'dialogue');

  // Check if intro was already seen
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('otakuloot-intro-seen');
    if (hasSeenIntro) {
      onComplete('collector'); // Default to collector if skipping context
    }
  }, [onComplete]);

  const handleAdvance = useCallback(() => {
    if (!isDone) return; // wait for typewriter

    if (lineIndex < currentScene.lines.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else if (sceneIndex < DIALOGUE_SCENES.length - 1) {
      setSceneIndex((prev) => prev + 1);
      setLineIndex(0);
    } else {
      setPhase('selection');
    }
  }, [isDone, lineIndex, sceneIndex, currentScene]);

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    setPhase('confirm');
  };

  const handleConfirm = () => {
    if (selectedClass) {
      localStorage.setItem('otakuloot-intro-seen', 'true');
      onComplete(selectedClass);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('otakuloot-intro-seen', 'true');
    onComplete('collector');
  };

  // If already seen (checked in useEffect), we might render null effectively by returning early or just handling it in parent
  // But here we rely on the parent hiding this component when onComplete is called.
  // However, to avoid flash, we can return null if we detected it.
  // But since useEffect runs after render, there will be a flash. 
  // We can use useLayoutEffect or just accept the split second flash (or initial state check).
  // Let's stick to useEffect for simplicity, the flash is okay or we can add a 'loading' state.

  const selectedClassData = RPG_CLASSES.find((c) => c.id === selectedClass);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center font-heading"
    >
      {/* Background — animated gradient */}
      <div className="absolute inset-0 bg-void-black">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 via-transparent to-cyber-blue/5" />
        <div className="absolute inset-0 particle-bg opacity-60" />
        {/* Subtle Menacing Particles in Bg */}
        <div className="opacity-30">
           <MenacingParticles />
        </div>

        {/* Floating glassy orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[10%] w-40 h-40 rounded-full bg-neon-pink/10 blur-[50px]"
        />
        <motion.div
          animate={{ y: [15, -15, 15], x: [8, -8, 8] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[20%] right-[12%] w-48 h-48 rounded-full bg-cyber-blue/10 blur-[60px]"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6">
        {/* ====== DIALOGUE PHASE ====== */}
        <AnimatePresence mode="wait">
          {phase === 'dialogue' && (
            <motion.div
              key="dialogue"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              {/* Speaker */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border border-white/10 glass-panel-heavy shadow-2xl">
                  {currentScene.avatar}
                </div>
                <p className="text-center font-stats text-[10px] tracking-[0.3em] text-text-muted mt-3 uppercase">
                  {currentScene.speaker}
                </p>
              </motion.div>

              {/* Dialogue Box — Glassy */}
              <motion.div
                onClick={handleAdvance}
                className="w-full max-w-2xl p-8 rounded-2xl cursor-pointer select-none relative overflow-hidden glass-panel active-gomu"
                onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
              >
                {/* Glass highlight line */}
                <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <p className="text-text-primary text-2xl md:text-3xl font-bold leading-relaxed min-h-[4rem] drop-shadow-md">
                  {displayed}
                  {!isDone && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-[3px] h-6 bg-cyber-blue ml-2 align-middle"
                    />
                  )}
                </p>

                {isDone && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-stats text-[9px] tracking-[0.3em] text-text-muted mt-6 text-right"
                  >
                    ▸ CLICK TO CONTINUE
                  </motion.p>
                )}
              </motion.div>

              {/* Progress dots */}
              <div className="flex gap-2 mt-6">
                {DIALOGUE_SCENES.map((_, si) =>
                  DIALOGUE_SCENES[si].lines.map((_, li) => {
                    const isCurrent = si === sceneIndex && li === lineIndex;
                    const isPast = si < sceneIndex || (si === sceneIndex && li < lineIndex);
                    return (
                      <div
                        key={`${si}-${li}`}
                        className="w-2 h-2 rounded-full transition-all duration-300"
                        style={{
                          background: isCurrent ? '#00d4ff' : isPast ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)',
                          boxShadow: isCurrent ? '0 0 8px rgba(0,212,255,0.5)' : 'none',
                        }}
                      />
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* ====== CLASS SELECTION PHASE ====== */}
          {phase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Title */}
              <div className="text-center mb-10">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-stats text-[10px] tracking-[0.4em] text-cyber-blue mb-3"
                >
                  ▸ CHOOSE YOUR PATH ◂
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-heading text-4xl md:text-5xl font-black italic tracking-tighter"
                >
                  SELECT YOUR <span className="text-neon-pink text-glow-pink">CLASS</span>
                </motion.h2>
              </div>

              {/* Class Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {RPG_CLASSES.map((cls, idx) => {
                  const isHovered = hoveredClass === cls.id;

                  return (
                    <motion.button
                      key={cls.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1 }}
                      onClick={() => handleClassSelect(cls.id)}
                      onMouseEnter={() => {
                        setHoveredClass(cls.id);
                        useUIStore.getState().setCursorMode('pointer');
                      }}
                      onMouseLeave={() => {
                        setHoveredClass(null);
                        useUIStore.getState().setCursorMode('default');
                      }}
                      className={cn(
                        "text-left p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group border",
                        "glass-panel hover:glass-panel-heavy"
                      )}
                      style={{
                        borderColor: isHovered ? `${cls.color}66` : 'rgba(255,255,255,0.06)',
                        boxShadow: isHovered
                          ? `0 8px 40px ${cls.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
                          : 'none',
                      }}
                    >
                      {/* Glass highlight */}
                      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

                      {/* Icon */}
                      <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                        {cls.icon}
                      </div>

                      {/* Name */}
                      <h3
                        className="font-heading text-xl font-black italic mb-1 transition-colors duration-300 uppercase tracking-wide"
                        style={{ color: isHovered ? cls.color : '#eef0ff' }}
                      >
                        {cls.name}
                      </h3>

                      {/* Description */}
                      <p className="text-text-secondary text-xs leading-relaxed mb-4 line-clamp-2">
                        {cls.description}
                      </p>

                      {/* Stats */}
                      <div className="space-y-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <StatBar label={cls.stat1.label} value={cls.stat1.value} color={cls.color} />
                        <StatBar label={cls.stat2.label} value={cls.stat2.value} color={cls.color} />
                        <StatBar label={cls.stat3.label} value={cls.stat3.value} color={cls.color} />
                      </div>

                      {/* Perk */}
                      <div
                        className="mt-4 py-2 px-3 rounded-lg text-center font-stats text-[9px] tracking-wider font-bold"
                        style={{
                          background: `${cls.color}10`,
                          color: cls.color,
                          border: `1px solid ${cls.color}20`,
                        }}
                      >
                        {cls.perk}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ====== CONFIRMATION PHASE ====== */}
          {phase === 'confirm' && selectedClassData && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              {/* Glass card */}
              <motion.div
                className="w-full max-w-md p-8 rounded-3xl text-center relative overflow-hidden glass-panel-heavy"
                style={{
                  border: `1px solid ${selectedClassData.color}33`,
                  boxShadow: `0 12px 60px ${selectedClassData.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                {/* Cursed Energy Effect for flair */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                     <CursedEnergy intensity="high"><div className="w-full h-full" /></CursedEnergy>
                </div>

                {/* Glass highlight */}
                <div className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl mb-6 relative z-10 font-black drop-shadow-2xl"
                >
                  {selectedClassData.icon}
                </motion.div>

                <p className="font-stats text-[10px] tracking-[0.4em] text-text-muted mb-2 relative z-10">
                  YOU HAVE CHOSEN
                </p>

                <h2
                  className="font-heading text-5xl font-black mb-4 italic tracking-tighter relative z-10"
                  style={{ color: selectedClassData.color, textShadow: `0 0 20px ${selectedClassData.glow}` }}
                >
                  {selectedClassData.name}
                </h2>

                <p className="text-text-secondary text-sm mb-8 leading-relaxed relative z-10 max-w-xs mx-auto">
                  {selectedClassData.description}
                </p>

                <div className="flex gap-3 relative z-10">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPhase('selection')}
                    className="flex-1 py-4 rounded-xl font-heading text-sm uppercase tracking-widest transition-all glass-panel hover:bg-white/5"
                    onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                    onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                  >
                    ← Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${selectedClassData.glow}` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirm}
                    className="flex-[2] py-4 rounded-xl font-heading text-sm font-black uppercase tracking-widest text-white transition-all active-gomu"
                    style={{
                      background: `linear-gradient(135deg, ${selectedClassData.color}, ${selectedClassData.color}88)`,
                      boxShadow: `0 4px 20px ${selectedClassData.glow}`,
                    }}
                    onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                    onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                  >
                    ⚔️ Begin Journey
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button — More prominent glass button */}
        {phase !== 'confirm' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="fixed bottom-8 right-8 z-[10000]"
          >
            <motion.button
              onClick={handleSkip}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-stats text-[10px] uppercase tracking-[0.25em] font-bold text-white/50 hover:text-white glass-panel border border-white/5 hover:border-white/20 transition-all hover:bg-white/5"
              onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
              onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
            >
              Skip Intro
              <span className="text-xs">▸</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
