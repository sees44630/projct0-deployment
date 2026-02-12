const { request, gql } = require('graphql-request');

const ENDPOINT = 'http://localhost:4000/graphql';

const SHOPKEEPER_REACT = gql`
  mutation ShopkeeperReact($action: String!, $productName: String, $rarity: String, $playerClass: String) {
    shopkeeperReact(action: $action, productName: $productName, rarity: $rarity, playerClass: $playerClass)
  }
`;

const SHOPKEEPER_CHAT = gql`
  mutation ShopkeeperChat($message: String!, $context: String) {
    shopkeeperChat(message: $message, context: $context)
  }
`;

async function main() {
  console.log('🤖 Testing AI Shopkeeper...');

  try {
    // Test 1: Add Legendary Item
    console.log('\n1. Testing ADD_TO_CART (Legendary)...');
    const reactData = await request(ENDPOINT, SHOPKEEPER_REACT, {
      action: 'ADD_TO_CART',
      productName: 'Void Blade',
      rarity: 'LEGENDARY'
    });
    console.log('   Response:', reactData.shopkeeperReact);
    if (!reactData.shopkeeperReact.toLowerCase().includes('legendary')) throw new Error('Failed Legendary check');

    // Test 2: Chat about Sword
    console.log('\n2. Testing Chat ("looking for a sword")...');
    const chatData = await request(ENDPOINT, SHOPKEEPER_CHAT, {
      message: 'I am looking for a cool sword'
    });
    console.log('   Response:', chatData.shopkeeperChat);
    if (!chatData.shopkeeperChat.includes('warrior')) throw new Error('Failed Sword check');

    console.log('\n✅ AI Shopkeeper Tests Passed!');
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    if (error.response) console.error(JSON.stringify(error.response, null, 2));
  }
}

main();
