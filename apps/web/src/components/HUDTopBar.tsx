'use client';

import { useUIStore, useCartStore } from '@/store';
import Link from 'next/link';

export default function HUDTopBar() {
  const { soundMuted, toggleSound } = useUIStore();
  const totalItems = useCartStore((s) => s.totalItems);

  const tickerMessages = [
    '🔥 NEW DROP: Cyberpunk Neon Katana Figure — LEGENDARY RARITY',
    '⚡ User SakuraSlayer just looted [Dragon Slayer Resin Statue]!',
    '🎮 Complete 3 quests to unlock the exclusive Void Walker title!',
    '✨ Flash sale: 20% off all Mecha category for the next 2 hours!',
    '🏆 Collector rank requirements updated — check your profile!',
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[80] flex flex-col pointer-events-none">
      {/* Live Ticker — Floating Glass */}
      <div className="mx-4 mt-2 mb-1 pointer-events-auto rounded-lg overflow-hidden glass-panel border-b-0 h-7 flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs font-stats text-text-muted">
          {tickerMessages.map((msg, i) => (
            <span key={i} className="inline-block">
              {msg}
            </span>
          ))}
          {tickerMessages.map((msg, i) => (
            <span key={`dup-${i}`} className="inline-block">
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Top Bar — Floating Glass with glow border */}
      <div className="mx-4 h-16 flex items-center justify-between px-6 relative glass-panel glass-highlight glass-glow-border rounded-2xl pointer-events-auto transition-all duration-300 overflow-hidden">
        {/* Left spacer for hamburger */}
        <div className="w-14" />

        {/* Center Logo */}
        <Link href="/" className="flex items-center gap-1 group relative z-10">
          <span className="font-heading text-2xl font-black italic text-neon-pink text-glow-pink tracking-tighter transform -skew-x-6 transition-all group-hover:skew-x-0">
            OTAKU
          </span>
          <span className="font-heading text-2xl font-black italic text-cyber-blue text-glow-blue tracking-tighter transform -skew-x-6 transition-all group-hover:skew-x-0">
            LOOT
          </span>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-3 relative z-10">
          {/* Sound Toggle — Glass Pill */}
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-cyber-blue transition-all duration-200 glass-button active-gomu"
            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            <span className="text-sm">{soundMuted ? '🔇' : '🔊'}</span>
          </button>

          {/* Cart — Glass Pill */}
          <Link
            href="/cart"
            className="relative w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-neon-pink transition-all duration-200 glass-button active-gomu"
            onMouseEnter={() => useUIStore.getState().setCursorMode('pointer')}
            onMouseLeave={() => useUIStore.getState().setCursorMode('default')}
          >
            <span className="text-lg">🛒</span>
            {totalItems() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-void-black text-[10px] font-black font-stats w-5 h-5 rounded-full flex items-center justify-center bg-neon-pink shadow-lg animate-pulse-glow">
                {totalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
