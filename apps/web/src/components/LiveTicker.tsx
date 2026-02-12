'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface TickerEvent {
  id: string;
  type: 'drop' | 'purchase' | 'achievement' | 'levelup' | 'sale' | 'quest';
  message: string;
  icon: string;
  rarity?: string;
  timestamp: number;
}

// ─── Simulated event templates ───
const PLAYER_NAMES = [
  'SakuraSlayer', 'VoidWalker99', 'NeonRonin', 'CyberPunk2099', 'MechaLord',
  'KawaiiKitsune', 'DragonAscended', 'GhostBlade', 'StarForger', 'PhantomRogue',
  'AkibaHunter', 'BlossomFury', 'IronSamurai', 'LunarMage', 'CrimsonReaper',
];

const ITEM_NAMES = [
  'Neon Katana Figure', 'Dragon Slayer Resin Statue', 'Cyber Mech Model Kit',
  'Sakura Blossom Tapestry', 'Shadow Ronin Hoodie', 'Void Crystal Pendant',
  'Phoenix Wing Poster', 'Lunar Guardian Plush', 'Thunder God Figure',
  'Crystal Armor Display', 'Astral Mage Figurine', 'Storm Breaker Lamp',
];

const RARITY_LABELS: Record<string, { color: string; label: string }> = {
  LEGENDARY: { color: '#ffd700', label: 'LEGENDARY' },
  EPIC: { color: '#a78bfa', label: 'EPIC' },
  RARE: { color: '#60a5fa', label: 'RARE' },
  UNCOMMON: { color: '#4ade80', label: 'UNCOMMON' },
  COMMON: { color: '#9ca3af', label: 'COMMON' },
};

// Pre-generated deterministic event pool to avoid Math.random() in render
function createEventPool(): TickerEvent[] {
  const events: TickerEvent[] = [];
  const rarities = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];

  for (let i = 0; i < 50; i++) {
    const player = PLAYER_NAMES[i % PLAYER_NAMES.length];
    const item = ITEM_NAMES[i % ITEM_NAMES.length];
    const rarity = rarities[i % rarities.length];

    const templates: TickerEvent[] = [
      { id: `d-${i}`, type: 'drop', message: `${player} looted [${item}]`, icon: '🎴', rarity, timestamp: 0 },
      { id: `p-${i}`, type: 'purchase', message: `${player} purchased [${item}]`, icon: '💰', rarity, timestamp: 0 },
      { id: `a-${i}`, type: 'achievement', message: `${player} unlocked "Vault Raider" achievement`, icon: '🏆', timestamp: 0 },
      { id: `l-${i}`, type: 'levelup', message: `${player} reached Level ${10 + (i % 40)}`, icon: '⬆️', timestamp: 0 },
      { id: `s-${i}`, type: 'sale', message: `Flash Sale: ${20 + (i % 30)}% off ${item}!`, icon: '⚡', rarity, timestamp: 0 },
      { id: `q-${i}`, type: 'quest', message: `${player} completed "The Lost Artifact" quest`, icon: '📜', timestamp: 0 },
    ];

    events.push(templates[i % templates.length]);
  }

  return events;
}

const EVENT_POOL = createEventPool();

// ─── Single ticker item ───
function TickerItem({ event, onRemove }: { event: TickerEvent; onRemove: () => void }) {
  const rarityInfo = event.rarity ? RARITY_LABELS[event.rarity] : null;

  useEffect(() => {
    const timer = setTimeout(onRemove, 4000); // 4s duration
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9, height: 0, marginBottom: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-center gap-3 px-3 py-2 rounded-lg relative overflow-hidden shrink-0 group cursor-pointer"
      onClick={onRemove}
      style={{
        background: 'rgba(10, 10, 15, 0.6)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {/* Glass highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Icon */}
      <span className="text-sm shrink-0">{event.icon}</span>

      {/* Message */}
      <span className="font-stats text-[10px] tracking-wide text-gray-300 whitespace-nowrap">
        {event.message}
      </span>

      {/* Rarity tag */}
      {rarityInfo && (
        <span
          className="font-stats text-[8px] tracking-wider px-1 py-px rounded shrink-0 opacity-80"
          style={{
            color: rarityInfo.color,
            background: `${rarityInfo.color}15`,
            border: `1px solid ${rarityInfo.color}25`,
          }}
        >
          {rarityInfo.label}
        </span>
      )}
      
      {/* Dismiss Hint */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
        <span className="text-[10px] text-white/70">Dismiss</span>
      </div>
    </motion.div>
  );
}

// ─── Main Live Ticker Component ───
export default function LiveTicker() {
  const [events, setEvents] = useState<TickerEvent[]>([]);
  const indexRef = useRef(0);

  useEffect(() => {
    // Add initial event
    const addEvent = () => {
      const template = EVENT_POOL[indexRef.current % EVENT_POOL.length];
      const newEvent: TickerEvent = {
        ...template,
        id: `${template.id}-${Date.now()}`,
        timestamp: Date.now(),
      };
      setEvents((prev) => [...prev.slice(-2), newEvent]); // keep last 3 only
      indexRef.current++;
    };

    addEvent(); // initial
    const interval = setInterval(addEvent, 6000); // slower frequency
    return () => clearInterval(interval);
  }, []);

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[70] flex items-end"
      style={{ pointerEvents: 'none' }}
    >
      <div className="flex flex-col gap-1.5 max-w-sm" style={{ pointerEvents: 'auto' }}>
        <AnimatePresence>
          {events.map((event) => (
            <TickerItem
              key={event.id}
              event={event}
              onRemove={() => removeEvent(event.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
