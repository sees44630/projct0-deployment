'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── JOJO: Menacing Particles (ゴゴゴ) ───
export function MenacingParticles({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 0], 
            y: -40 - (i * 20), 
            x: (i % 2 === 0 ? 10 : -10),
            scale: [0.8, 1.2, 1] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: i * 0.6,
            ease: "easeOut" 
          }}
          className="absolute bottom-2 right-2 text-rare-purple font-heading font-bold text-2xl select-none"
          style={{ textShadow: '2px 2px 0px #000' }}
        >
          ゴ
        </motion.div>
      ))}
    </div>
  );
}

// ─── JJK: Cursed Energy Wrapper ───
export function CursedEnergy({ children, intensity = 'low' }: { children: React.ReactNode, intensity?: 'low' | 'high' }) {
  return (
    <div className="relative group">
      <div 
        className={cn(
          "absolute -inset-1 bg-gradient-to-r from-void-black via-rare-purple to-cyber-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
          intensity === 'high' ? 'blur-2xl opacity-40' : 'blur-lg'
        )} 
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// ─── NARUTO: Chakra Loader ───
export function ChakraLoader() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-cyber-blue/30 rounded-full animate-spin [animation-duration:3s]" />
      <div className="absolute inset-2 border-4 border-t-cyber-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      <div className="w-2 h-2 bg-cyber-blue rounded-full shadow-[0_0_10px_#00d4ff]" />
    </div>
  );
}

// ─── ONE PIECE: Wanted Poster Frame ───
export function WantedPosterFrame({ children, bounty }: { children: React.ReactNode, bounty: string }) {
  return (
    <div className="relative bg-[#f4e4bc] p-3 shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 text-void-black">
      <div className="border-2 border-[#5a4a42] p-1 h-full flex flex-col items-center">
        <h3 className="font-heading font-black text-2xl tracking-widest mb-1 text-[#5a4a42]">WANTED</h3>
        <p className="text-[10px] font-mono mb-2 w-full text-center border-b border-[#5a4a42]">DEAD OR ALIVE</p>
        <div className="w-full aspect-square bg-gray-200 mb-2 overflow-hidden border border-[#5a4a42]">
          {children}
        </div>
        <div className="font-heading font-black text-lg w-full text-left pl-2 text-[#5a4a42]">
          <span className="text-[10px] mr-1">BERRY</span>
          {bounty}
        </div>
      </div>
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-20 pointer-events-none mix-blend-multiply" />
    </div>
  );
}
