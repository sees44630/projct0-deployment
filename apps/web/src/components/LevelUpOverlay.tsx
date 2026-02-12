'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelUpNotification {
  id: string;
  newLevel: number;
  newTitle: string;
  xpGained: number;
}

// Singleton event system for level-up notifications
const listeners = new Set<(n: LevelUpNotification) => void>();

export function triggerLevelUp(data: Omit<LevelUpNotification, 'id'>) {
  const notification: LevelUpNotification = { ...data, id: Date.now().toString() };
  listeners.forEach((fn) => fn(notification));
}

export default function LevelUpOverlay() {
  const [notification, setNotification] = useState<LevelUpNotification | null>(null);

  useEffect(() => {
    const handler = (n: LevelUpNotification) => {
      setNotification(n);
      setTimeout(() => setNotification(null), 5000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -30 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Backdrop flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.1, 0] }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gold-rank"
          />

          {/* Main card */}
          <motion.div
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="relative bg-void-deep/95 backdrop-blur-xl border-2 border-gold-rank/50 rounded-2xl p-8 md:p-12 text-center max-w-md mx-4"
            style={{
              boxShadow: '0 0 60px rgba(250,204,21,0.3), 0 0 120px rgba(250,204,21,0.1)',
            }}
          >
            {/* Burst particles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i / 12) * Math.PI * 2) * 150,
                  y: Math.sin((i / 12) * Math.PI * 2) * 150,
                }}
                transition={{ delay: 0.3, duration: 1.2 }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold-rank"
                style={{ marginLeft: -4, marginTop: -4 }}
              />
            ))}

            {/* Level badge */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-7xl mb-4"
            >
              🏆
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-stats text-[10px] tracking-[0.4em] text-gold-rank mb-2"
            >
              ▸ LEVEL UP ◂
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-heading text-5xl font-black text-gold-rank text-glow-gold mb-2"
            >
              LEVEL {notification.newLevel}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-heading text-lg text-text-primary mb-4"
            >
              {notification.newTitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.9 }}
              className="h-px bg-gradient-to-r from-transparent via-gold-rank/50 to-transparent mb-4"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-stats text-xs text-text-muted tracking-wider"
            >
              +{notification.xpGained} XP EARNED
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
