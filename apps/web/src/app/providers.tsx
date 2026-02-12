'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import CustomCursor from '@/components/CustomCursor';
import HUDSidebar from '@/components/HUDSidebar';
import HUDTopBar from '@/components/HUDTopBar';
import ShopkeeperAvatar from '@/components/ShopkeeperAvatar';
import CharacterSelector from '@/components/CharacterSelector';
import SoundManager from '@/components/SoundManager';
import LevelUpOverlay from '@/components/LevelUpOverlay';
import LiveTicker from '@/components/LiveTicker';
import VisualNovelIntro from '@/components/VisualNovelIntro';
import { useUIStore } from '@/store';

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30s
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Visual novel intro — show once per session (persisted in sessionStorage)
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check session storage on mount to avoid hydration mismatch
    const introDone = sessionStorage.getItem('otakuloot_intro_done');
    if (!introDone) {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- check once on mount
      setShowIntro(true);
    }
    
    // Manually trigger hydration for UI store (gamification)
    const store = useUIStore as any;
    if (store.persist && typeof store.persist.rehydrate === 'function') {
      store.persist.rehydrate();
    }
  }, []);

  const handleIntroComplete = (selectedClass: string) => {
    sessionStorage.setItem('otakuloot_intro_done', '1');
    sessionStorage.setItem('otakuloot_player_class', selectedClass);
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      <SoundManager />

      {/* Visual Novel Intro (once per session) */}
      <AnimatePresence>
        {showIntro && (
          <VisualNovelIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main app — hidden while intro is active */}
      {!showIntro && (
        <>
          <HUDTopBar />
          <HUDSidebar />
          <LevelUpOverlay />
          <LiveTicker />
          {/* Main content area — offset for top bar (ticker 28px + bar 56px = 84px) */}
          <main className="pt-[84px] min-h-screen relative">{children}</main>
          <ShopkeeperAvatar />
          <CharacterSelector />
        </>
      )}
    </QueryClientProvider>
  );
}
