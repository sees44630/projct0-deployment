import { useMutation } from '@tanstack/react-query';
import { gqlClient as graphqlClient } from '@/lib/graphql-client';
import { SHOPKEEPER_REACT, SHOPKEEPER_CHAT } from '@/lib/queries';
import { useUIStore } from '@/store';
import { getReaction } from '@/lib/characters';

interface ShopkeeperContext {
  productName?: string;
  rarity?: string;
  playerClass?: string;
}

export function useShopkeeper() {
  const setShopkeeperMood = useUIStore((s) => s.setShopkeeperMood);

  const reactMutation = useMutation({
    mutationFn: async (variables: { action: string } & ShopkeeperContext) => {
      try {
        const data = await graphqlClient.request<{ shopkeeperReact: string }>(
          SHOPKEEPER_REACT,
          variables
        );
        return data.shopkeeperReact;
      } catch {
        // Fallback to local character-specific reaction if API fails
        const characterId = useUIStore.getState().activeShopkeeperId;
        const action = variables.action === 'ADD_TO_CART'
          ? (variables.rarity === 'LEGENDARY' ? 'addLegendary' : 'addToCart')
          : 'browse';
        return getReaction(characterId, action);
      }
    },
    onSuccess: (message, variables) => {
      let mood: 'happy' | 'excited' | 'greeting' | 'idle' = 'happy';
      
      if (variables.action === 'ADD_TO_CART') {
        mood = variables.rarity === 'LEGENDARY' ? 'excited' : 'happy';
      } else if (variables.action === 'GREETING') {
        mood = 'greeting';
      }

      setShopkeeperMood(mood, message);
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (variables: { message: string, context?: Record<string, unknown> }) => {
      try {
        const data = await graphqlClient.request<{ shopkeeperChat: string }>(
          SHOPKEEPER_CHAT,
          { ...variables, context: JSON.stringify(variables.context) }
        );
        return data.shopkeeperChat;
      } catch {
        // Fallback to local idle reaction
        const characterId = useUIStore.getState().activeShopkeeperId;
        return getReaction(characterId, 'idle');
      }
    },
    onSuccess: (message) => {
      setShopkeeperMood('happy', message);
    }
  });

  return {
    reactTo: (action: string, context?: ShopkeeperContext) => reactMutation.mutate({ action, ...context }),
    chat: (message: string, context?: Record<string, unknown>) => chatMutation.mutate({ message, context }),
    isLoading: reactMutation.isPending || chatMutation.isPending,
  };
}
