import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding OtakuLoot database...\n');

  // ========================================
  // Categories
  // ========================================
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'cyberpunk' },
      update: {},
      create: { name: 'Cyberpunk', slug: 'cyberpunk' },
    }),
    prisma.category.upsert({
      where: { slug: 'mecha' },
      update: {},
      create: { name: 'Mecha', slug: 'mecha' },
    }),
    prisma.category.upsert({
      where: { slug: 'fantasy' },
      update: {},
      create: { name: 'Fantasy', slug: 'fantasy' },
    }),
    prisma.category.upsert({
      where: { slug: 'shonen' },
      update: {},
      create: { name: 'Shōnen', slug: 'shonen' },
    }),
    prisma.category.upsert({
      where: { slug: 'kawaii' },
      update: {},
      create: { name: 'Kawaii', slug: 'kawaii' },
    }),
  ]);

  console.log(`✅ ${categories.length} categories seeded`);

  const [cyberpunk, mecha, fantasy, shonen, kawaii] = categories;

  // ========================================
  // Products (matching frontend mock data)
  // ========================================
  const productsData = [
    {
      title: 'Cyberpunk Neon Katana Figure',
      slug: 'cyberpunk-neon-katana-figure',
      description: 'A limited-edition 1/7 scale figure featuring a cybernetic samurai wielding dual plasma katanas. Hand-painted with UV-reactive neon accents that glow under blacklight.',
      price: 249.99,
      rarityTier: 'LEGENDARY',
      categoryId: cyberpunk.id,
      stats: { quality: 95, rarity: 98, comfort: 60, style: 92, value: 85 },
    },
    {
      title: 'Mecha Pilot Bomber Jacket',
      slug: 'mecha-pilot-bomber-jacket',
      description: 'Military-grade bomber jacket inspired by iconic mecha anime. Features removable squadron patches, hidden pockets, and heat-reactive color-changing lining.',
      price: 189.99,
      rarityTier: 'EPIC',
      categoryId: mecha.id,
      stats: { quality: 88, rarity: 82, comfort: 90, style: 95, value: 78 },
    },
    {
      title: 'Sakura Spirit Hoodie',
      slug: 'sakura-spirit-hoodie',
      description: 'Ultra-soft organic cotton hoodie with hand-embroidered cherry blossom patterns. Features a hidden headphone cable channel and thumb holes.',
      price: 79.99,
      rarityTier: 'RARE',
      categoryId: kawaii.id,
      stats: { quality: 75, rarity: 65, comfort: 95, style: 80, value: 88 },
    },
    {
      title: 'Dragon Slayer Resin Statue',
      slug: 'dragon-slayer-resin-statue',
      description: 'A breathtaking 18-inch resin statue depicting a warrior locked in battle with a dragon. Each piece is individually numbered and comes with a certificate of authenticity.',
      price: 449.99,
      rarityTier: 'LEGENDARY',
      categoryId: fantasy.id,
      stats: { quality: 98, rarity: 95, comfort: 30, style: 97, value: 70 },
    },
    {
      title: 'Hero Academy Training Tee',
      slug: 'hero-academy-training-tee',
      description: 'Premium cotton training t-shirt with moisture-wicking technology. Features the iconic hero academy crest and "Plus Ultra" motto.',
      price: 34.99,
      rarityTier: 'COMMON',
      categoryId: shonen.id,
      stats: { quality: 60, rarity: 30, comfort: 85, style: 65, value: 92 },
    },
    {
      title: 'Void Walker Sneakers',
      slug: 'void-walker-sneakers',
      description: 'Futuristic sneakers with fiber-optic lacing and LED sole lights. Powered by a rechargeable battery with 8 color modes.',
      price: 329.99,
      rarityTier: 'EPIC',
      categoryId: cyberpunk.id,
      stats: { quality: 85, rarity: 88, comfort: 78, style: 96, value: 72 },
    },
    {
      title: 'Spirit Fox Plushie',
      slug: 'spirit-fox-plushie',
      description: 'Adorable 12-inch spirit fox plushie made with premium minky fabric. Features posable ears and a fluffy multi-tailed design.',
      price: 29.99,
      rarityTier: 'UNCOMMON',
      categoryId: kawaii.id,
      stats: { quality: 70, rarity: 45, comfort: 92, style: 78, value: 95 },
    },
    {
      title: 'Astral Mech Model Kit',
      slug: 'astral-mech-model-kit',
      description: 'Premium 1/100 scale model kit of the Astral series mecha. Includes LED unit, waterslide decals, and action base. 400+ parts for advanced builders.',
      price: 199.99,
      rarityTier: 'RARE',
      categoryId: mecha.id,
      stats: { quality: 90, rarity: 75, comfort: 40, style: 88, value: 82 },
    },
  ];

  for (const data of productsData) {
    const { stats, ...productData } = data;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: {
        ...productData,
        skus: {
          create: [
            { size: 'One Size', stockQuantity: Math.floor(Math.random() * 50) + 5 },
          ],
        },
        stats: {
          create: stats,
        },
      },
    });
    console.log(`  📦 ${product.title} (${product.rarityTier})`);
  }

  console.log(`\n✅ ${productsData.length} products seeded`);
  console.log('\n🎮 OtakuLoot database ready!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
