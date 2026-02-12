// ============================================================
// Anime Shopkeeper Character Registry
// Each character has a unique personality, theme, and dialogue.
// ============================================================

export interface ShopkeeperCharacter {
  id: string;
  name: string;
  anime: string;
  emoji: string;          // Display emoji/avatar
  themeColor: string;     // Primary accent color (hex)
  glowColor: string;      // Glow effect color
  catchphrase: string;    // Iconic line
  unlocked: boolean;      // Default unlock state
  unlockHint?: string;    // Hint for locked characters

  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };

  reactions: {
    addToCart: string[];
    addLegendary: string[];
    removeFromCart: string[];
    checkout: string[];
    idle: string[];
    browse: string[];
  };
}

// ── The Starter Roster ──────────────────────────────────────

const LUFFY: ShopkeeperCharacter = {
  id: 'luffy',
  name: 'Monkey D. Luffy',
  anime: 'One Piece',
  emoji: '🏴‍☠️',
  themeColor: '#e74c3c',
  glowColor: '#ff6b6b',
  catchphrase: 'Kaizoku ou ni, ore wa naru!',
  unlocked: true,

  greetings: {
    morning: "Ohayou~! ☀️ Oi, got any meat in this shop?",
    afternoon: "Yooo! 🍖 Let's find some treasure!",
    evening: "Shishishi~ 🌙 Night shopping is an adventure!",
    night: "Zzz... huh?! 🌟 Oh! You're still here! Let's GO!",
  },

  reactions: {
    addToCart: [
      "Sugeee!! That's awesome! 🤩",
      "Oi oi oi! Good pick, nakama!",
      "Shishishi! I want one too!",
    ],
    addLegendary: [
      "WHOA!! That's One Piece-level treasure!! 💎",
      "THIS IS IT! THE LEGENDARY LOOT!! 🏴‍☠️",
    ],
    removeFromCart: [
      "Ehhh?! You're putting it back?! 😭",
      "But... but it was so cool...",
    ],
    checkout: [
      "Yosh! Time to set sail with your loot! 🚢",
      "Shishishi! Thanks for shopping, nakama! 🏴‍☠️",
    ],
    idle: [
      "Niku... I mean, welcome! 🍖",
      "*stretches arms* Gomu Gomu nooo... boredom!",
      "Oi! Pick something already! 😆",
    ],
    browse: [
      "Ooh that one looks strong!",
      "My crew would love something like this!",
    ],
  },
};

const NARUTO: ShopkeeperCharacter = {
  id: 'naruto',
  name: 'Naruto Uzumaki',
  anime: 'Naruto',
  emoji: '🍥',
  themeColor: '#f39c12',
  glowColor: '#ffad33',
  catchphrase: 'Dattebayo!',
  unlocked: true,

  greetings: {
    morning: "Good morning, dattebayo! ☀️ Believe it!",
    afternoon: "Yo! 🍜 Ready to shop like a Hokage?",
    evening: "Konbanwa! 🌙 Training's done, time to shop!",
    night: "Still up? 🌟 That's the shinobi way, dattebayo!",
  },

  reactions: {
    addToCart: [
      "Nice pick, dattebayo! 👊",
      "That's a Hokage-tier choice!",
      "Believe it! Great taste! 🍥",
    ],
    addLegendary: [
      "WHOA! That's Sage Mode-level loot!! 🐸",
      "DATTEBAYO!! A legendary item?! You're awesome! ✨",
    ],
    removeFromCart: [
      "Don't give up on it! That's not the ninja way! 😤",
      "Hmm... okay, a true ninja adapts.",
    ],
    checkout: [
      "Mission complete, dattebayo! 🎯",
      "Great haul! You shop like a true Hokage! 🍥",
    ],
    idle: [
      "Want some ramen while you browse? 🍜",
      "*shadow clone appears* Need help finding anything?",
      "I'll become the greatest shopkeeper, dattebayo!",
    ],
    browse: [
      "That one has real chakra! I can feel it!",
      "Sakura-chan would totally want that one...",
    ],
  },
};

const GOKU: ShopkeeperCharacter = {
  id: 'goku',
  name: 'Son Goku',
  anime: 'Dragon Ball',
  emoji: '🐉',
  themeColor: '#e67e22',
  glowColor: '#f5a623',
  catchphrase: 'Ossu! Ora Goku!',
  unlocked: true,

  greetings: {
    morning: "Ossu! ☀️ I just finished training! Want to spar... I mean shop?",
    afternoon: "Hey! 🐉 Chi-Chi sent me to buy groceries but... this is cooler!",
    evening: "Yo! 🌙 I'm getting hungry. What's for sale?",
    night: "Whoa, it's late! 🌟 But I'm not tired at all! Let's go!",
  },

  reactions: {
    addToCart: [
      "Sugoi! That's strong! 💪",
      "Ooh, I bet Vegeta would be jealous!",
      "Nice one! Is it stronger than a Kamehameha though? 😄",
    ],
    addLegendary: [
      "THIS POWER LEVEL... IT'S OVER 9000!! 🔥🔥🔥",
      "AMAZING! I'm going Super Saiyan just looking at it!! ✨",
    ],
    removeFromCart: [
      "Aww, but it looked so cool! 😅",
      "Hmm, saving energy for a bigger fight?",
    ],
    checkout: [
      "Yosh! Good fight— I mean, good shopping! ✌️",
      "Haha, Chi-Chi's gonna be mad I bought stuff again! 🐉",
    ],
    idle: [
      "Got anything to eat? I'm starving! 🍚",
      "*powers up slightly* Oops, sorry! Got excited!",
      "This reminds me of the time I fought Frieza...",
    ],
    browse: [
      "I wonder if Piccolo would like this...",
      "This looks like something from Planet Namek!",
    ],
  },
};

// ── Secret / Unlockable Characters ──────────────────────────

const GOJO: ShopkeeperCharacter = {
  id: 'gojo',
  name: 'Gojo Satoru',
  anime: 'Jujutsu Kaisen',
  emoji: '👁️',
  themeColor: '#3b82f6',
  glowColor: '#60a5fa',
  catchphrase: "Nah, I'd win.",
  unlocked: false,
  unlockHint: 'Spend over ¥10,000 total to impress the strongest sorcerer',

  greetings: {
    morning: "Yo~ ☀️ Don't worry, the strongest shopkeeper is here.",
    afternoon: "Maa maa~ 😎 You look like you need something special.",
    evening: "Konbanwa~ 🌙 Even cursed spirits shop at night.",
    night: "Still here? 🌟 Nah, I'd stay too. I'm too interesting to leave.",
  },

  reactions: {
    addToCart: [
      "Good taste~ Not as good as mine, but close. 😏",
      "Nah, I'd buy that too.",
      "Sugoi sugoi~ ✨",
    ],
    addLegendary: [
      "Oho~? A SPECIAL GRADE item? Now we're talking! 💎",
      "Throughout heaven and earth... this item alone is supreme! 👁️",
    ],
    removeFromCart: [
      "Eh~? Are you sure? That's a bit weak, don't you think? 😏",
      "Maa, even Yuuji would've kept that one.",
    ],
    checkout: [
      "Don't worry, I used Infinity on the tax~ 😎",
      "Nice haul. Almost as impressive as me. Almost. 👁️",
    ],
    idle: [
      "You know, being the strongest gets boring... entertain me!",
      "*lowers blindfold* ...just kidding~ 😆",
      "I could've picked all this in 0.2 seconds, btw.",
    ],
    browse: [
      "Hmm, this has cursed energy potential~",
      "Megumi would say this is 'troublesome'... I say it's fun!",
    ],
  },
};

const ANYA: ShopkeeperCharacter = {
  id: 'anya',
  name: 'Anya Forger',
  anime: 'Spy x Family',
  emoji: '🥜',
  themeColor: '#ec4899',
  glowColor: '#f472b6',
  catchphrase: 'Waku waku!',
  unlocked: false,
  unlockHint: 'Add 5 items to your cart in under 10 seconds — Anya likes fast shoppers!',

  greetings: {
    morning: "Ohayou! ☀️ Anya wants peanuts!",
    afternoon: "Waku waku~! 🥜 Let's go shopping!",
    evening: "Papa said Anya can help with shopping! 🌙",
    night: "Anya not sleepy! 🌟 *yawns* ...okay maybe a little.",
  },

  reactions: {
    addToCart: [
      "Waku waku~! 🥜✨",
      "Anya reads your mind... you LOVE this item!",
      "Ooh! Shiny! Anya wants one too!",
    ],
    addLegendary: [
      "WAKU WAKU WAKU!! ✨✨✨ THE BEST ITEM EVER!",
      "Anya's telepathy says... this is AMAZING! 💖",
    ],
    removeFromCart: [
      "Heh?! 😢 But Anya liked that one...",
      "*shocked Anya face* Why?!",
    ],
    checkout: [
      "Yay! Mission complete! Papa would be proud! 🥜",
      "Anya helped! Anya is the best shopper! ⭐",
    ],
    idle: [
      "Anya bored... entertain Anya! 🥜",
      "*reads thoughts* ...you're thinking about peanuts too! 😆",
      "Anya wants to go to the aquarium after this...",
    ],
    browse: [
      "Anya's telepathy says you want this one!",
      "Ooh! Bond-man would like this!",
    ],
  },
};

// ── Registry ────────────────────────────────────────────────

export const CHARACTER_REGISTRY: Record<string, ShopkeeperCharacter> = {
  luffy: LUFFY,
  naruto: NARUTO,
  goku: GOKU,
  gojo: GOJO,
  anya: ANYA,
};

export const STARTER_CHARACTERS = ['luffy', 'naruto', 'goku'];
export const SECRET_CHARACTERS = ['gojo', 'anya'];
export const DEFAULT_CHARACTER = 'luffy';

/** Get a random reaction from a character for a given action */
export function getReaction(
  characterId: string,
  action: keyof ShopkeeperCharacter['reactions']
): string {
  const char = CHARACTER_REGISTRY[characterId];
  if (!char) return '...';
  const pool = char.reactions[action];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Get the time-of-day greeting for a character */
export function getGreeting(characterId: string): string {
  const char = CHARACTER_REGISTRY[characterId];
  if (!char) return 'Welcome!';
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return char.greetings.morning;
  if (hour >= 12 && hour < 17) return char.greetings.afternoon;
  if (hour >= 17 && hour < 21) return char.greetings.evening;
  return char.greetings.night;
}
