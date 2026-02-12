import { Injectable } from '@nestjs/common';

export interface ShopkeeperContext {
  action: 'GREETING' | 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'PURCHASE' | 'CHAT';
  productName?: string;
  rarity?: string;
  playerClass?: string;
  message?: string;
}

@Injectable()
export class AiService {
  async generateResponse(context: ShopkeeperContext): Promise<string> {
    // TODO: Integrate OpenAI API here when key is available
    // const completion = await openai.chat.completions.create({...})

    // Mock responses for now (Simulated LLM)
    const { action, productName, rarity, playerClass, message } = context;

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate thinking network delay

    if (action === 'CHAT' && message) {
      if (message.toLowerCase().includes('sword')) return "Ah, looking for a blade? Only the sharpest for a warrior like you!";
      if (message.toLowerCase().includes('magic')) return "The arcane arts... dangerous, yet powerful. Choose wisely.";
      return "I'm just a humble shopkeeper, adventurer. Take a look around!";
    }

    if (action === 'ADD_TO_CART') {
      if (rarity === 'LEGENDARY') return `By the gods! The ${productName}?! A legendary choice!`;
      if (rarity === 'EPIC') return `Ooh, shiny! The ${productName} will serve you well.`;
      if (productName?.toLowerCase().includes('cyber')) return "High-tech gear? Nice upgrade.";
      return "Added to your stash!";
    }

    if (action === 'PURCHASE') {
      return "Current stockpile acquired. Safe travels, adventurer!";
    }

    // Default Greeting
    if (playerClass === 'Mage') return "Welcome, spellcaster. Don't burn down the shop, eh?";
    if (playerClass === 'Warrior') return "Hail, warrior! Need something to smash with?";
    if (playerClass === 'Rogue') return "Keep your hands where I can see them, rogue.";
    
    return "Welcome to OtakuLoot! Rare finds today.";
  }
}
