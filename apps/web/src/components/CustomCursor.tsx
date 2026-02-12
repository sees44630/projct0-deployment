'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '@/store';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const cursorMode = useUIStore((s) => s.cursorMode);

  const move = useCallback((e: MouseEvent) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
    if (trailRef.current) {
      setTimeout(() => {
        if (trailRef.current) {
          trailRef.current.style.left = `${e.clientX}px`;
          trailRef.current.style.top = `${e.clientY}px`;
        }
      }, 80);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [move]);

  const cursorSize =
    cursorMode === 'glow' ? 'w-8 h-8' :
    cursorMode === 'pointer' ? 'w-5 h-5' :
    cursorMode === 'grab' ? 'w-6 h-6' : 'w-4 h-4';

  const cursorColor =
    cursorMode === 'glow'
      ? 'bg-gold-rank shadow-[0_0_20px_rgba(255,215,0,0.6)]'
      : cursorMode === 'pointer'
      ? 'bg-neon-pink shadow-[0_0_12px_rgba(255,45,123,0.5)]'
      : 'bg-cyber-blue shadow-[0_0_8px_rgba(0,212,255,0.4)]';

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height,background,box-shadow] duration-200 ${cursorSize} ${cursorColor}`}
        style={{ willChange: 'left, top' }}
      />
      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed w-8 h-8 pointer-events-none z-[9998] rounded-full -translate-x-1/2 -translate-y-1/2 border border-cyber-blue/30 transition-all duration-200 ease-out"
        style={{ willChange: 'left, top' }}
      />
    </>
  );
}
