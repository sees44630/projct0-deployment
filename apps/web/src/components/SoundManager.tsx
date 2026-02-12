'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useUIStore } from '@/store';

// Sound effects with inline base64 silent fallback when no audio files available
// In production, replace with real SFX URLs
const SOUNDS: Record<string, string | null> = {
  hover: null,   // Will be generated programmatically
  click: null,
  addToCart: null,
  levelUp: null,
};

class SFXEngine {
  private audioCtx: AudioContext | null = null;
  private muted = false;

  init() {
    if (typeof window === 'undefined') return;
    this.audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }

  setMuted(m: boolean) {
    this.muted = m;
  }

  private play(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) {
    if (this.muted || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Silently fail if audio context is not available
    }
  }

  hover() {
    this.play(1200, 0.08, 'sine', 0.04);
  }

  click() {
    this.play(800, 0.1, 'square', 0.06);
  }

  addToCart() {
    // Play ascending arpeggio
    this.play(523, 0.15, 'sine', 0.08);
    setTimeout(() => this.play(659, 0.15, 'sine', 0.08), 80);
    setTimeout(() => this.play(784, 0.2, 'sine', 0.1), 160);
  }

  removeFromCart() {
    // Descending
    this.play(784, 0.1, 'sine', 0.06);
    setTimeout(() => this.play(523, 0.15, 'sine', 0.06), 80);
  }

  levelUp() {
    // Triumphant fanfare
    this.play(523, 0.15, 'square', 0.06);
    setTimeout(() => this.play(659, 0.15, 'square', 0.06), 120);
    setTimeout(() => this.play(784, 0.15, 'square', 0.06), 240);
    setTimeout(() => this.play(1047, 0.3, 'sine', 0.1), 360);
  }
}

// Singleton
export const sfx = new SFXEngine();

export default function SoundManager() {
  const soundMuted = useUIStore((s) => s.soundMuted);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // Initialize on first user interaction
      const init = () => {
        sfx.init();
        initialized.current = true;
        document.removeEventListener('click', init);
        document.removeEventListener('keydown', init);
      };
      document.addEventListener('click', init);
      document.addEventListener('keydown', init);
      return () => {
        document.removeEventListener('click', init);
        document.removeEventListener('keydown', init);
      };
    }
  }, []);

  useEffect(() => {
    sfx.setMuted(soundMuted);
  }, [soundMuted]);

  return null; // This is a logic-only component
}
