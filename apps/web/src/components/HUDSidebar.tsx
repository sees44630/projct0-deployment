'use client';

import { useRef, useEffect } from 'react';
import { useUIStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: '⚔️' },
  { label: 'Shop', href: '/shop', icon: '🛒' },
  { label: 'Cart', href: '/cart', icon: '💎' },
  { label: 'Quests', href: '#', icon: '📜' },
  { label: 'Profile', href: '#', icon: '🎭' },
];

export default function HUDSidebar() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useUIStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Sidebar Toggle Button — Glass Pill */}
      <button
        onClick={toggleSidebar}
        className="fixed top-[46px] left-8 z-[100] w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-300 group hover:scale-110 active-gomu glass-button"
        onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
        onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
      >
        <div className="relative w-6 h-4">
          <span
            className={`absolute top-0 left-0 h-[2px] bg-cyber-blue rounded-full transition-all duration-300 ${
              sidebarOpen ? 'w-6 rotate-45 translate-y-[7px]' : 'w-6'
            }`}
          />
          <span
            className={`absolute top-[7px] left-0 h-[2px] bg-neon-pink rounded-full transition-all duration-300 ${
              sidebarOpen ? 'w-0 opacity-0' : 'w-4'
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-[2px] bg-cyber-blue rounded-full transition-all duration-300 ${
              sidebarOpen ? 'w-6 -rotate-45 -translate-y-[7px]' : 'w-6'
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-void-black/70 backdrop-blur-md"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel — Frosted Glass */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.nav
            ref={sidebarRef}
            initial={{ x: -350, opacity: 0, rotateY: 15 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: -350, opacity: 0, rotateY: 15 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed top-4 bottom-4 left-4 w-[300px] z-[95] flex flex-col glass-panel-heavy glass-highlight rounded-3xl overflow-hidden"
            style={{ perspective: '1000px' }}
          >
            {/* Animated glow border */}
            <div className="absolute inset-0 rounded-3xl glass-glow-border pointer-events-none" />

            {/* Naruto Style Scroll Header */}
            <div className="p-8 pt-24 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-rare-purple to-cyber-blue animate-shimmer" />
              
              <h2 className="font-heading text-3xl font-black italic tracking-tighter transform -skew-x-6 relative z-10">
                <span className="text-neon-pink text-glow-pink mr-1">OTAKU</span>
                <span className="text-cyber-blue text-glow-blue">LOOT</span>
              </h2>
              <p className="text-text-muted text-xs mt-2 font-stats tracking-[0.2em] uppercase opacity-70 relative z-10">
                System Online
              </p>
            </div>

            {/* Nav Items */}
            <div className="flex-1 py-4 px-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl text-text-secondary hover:text-white transition-all duration-300 group relative overflow-hidden hover:pl-8"
                    onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
                    onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
                  >
                    {/* Hover bg — glass effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl backdrop-blur-sm" />
                    
                    {/* Active Indicator (Left Bar) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-pink rounded-r-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 shadow-[0_0_8px_rgba(255,45,123,0.5)]" />

                    <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                      {item.icon}
                    </span>
                    <span className="font-heading font-bold text-lg tracking-wide uppercase z-10">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer — XP Bar */}
            <div className="p-6 bg-black/20 backdrop-blur-md relative z-10">
              <div className="flex justify-between text-[10px] font-stats text-cyber-blue mb-2 tracking-widest">
                <span>HUNTER RANK F</span>
                <span>0 / 100 XP</span>
              </div>
              <div className="h-2 bg-void-black rounded-full overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '15%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-neon-pink via-purple-500 to-cyber-blue"
                  style={{ boxShadow: '0 0 10px rgba(255,45,123,0.5)' }}
                />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
