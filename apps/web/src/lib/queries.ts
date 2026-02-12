import { gql } from 'graphql-request';

// ========================================
// Product Queries
// ========================================

export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $rarityTier: RarityTier) {
    products(category: $category, rarityTier: $rarityTier) {
      id
      title
      slug
      description
      price
      rarityTier
      category {
        id
        name
        slug
      }
      skus {
        id
        size
        color
        stockQuantity
      }
      assets {
        id
        type
        url
      }
      stats {
        quality
        rarity
        comfort
        style
        value
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      title
      slug
      description
      price
      rarityTier
      category {
        id
        name
        slug
      }
      skus {
        id
        size
        color
        stockQuantity
      }
      assets {
        id
        type
        url
      }
      stats {
        quality
        rarity
        comfort
        style
        value
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!) {
    searchProducts(query: $query) {
      id
      title
      slug
      price
      rarityTier
      category {
        name
        slug
      }
      stats {
        quality
        rarity
        comfort
        style
        value
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
    }
  }
`;

// ========================================
// Auth Mutations
// ========================================

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $displayName: String!) {
    register(email: $email, password: $password, displayName: $displayName) {
      accessToken
      user {
        id
        email
        role
        profile {
          displayName
          level
          xp
          currentTitle
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        role
        profile {
          displayName
          level
          xp
          currentTitle
        }
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
      profile {
        displayName
        avatarUrl
        level
        xp
        currentTitle
      }
    }
  }
`;

// ========================================
// Cart Queries / Mutations
// ========================================

export const GET_CART = gql`
  query GetCart {
    cart {
      id
      productId
      skuId
      quantity
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: String!, $quantity: Int, $skuId: String) {
    addToCart(productId: $productId, quantity: $quantity, skuId: $skuId) {
      id
      productId
      quantity
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartItemId: String!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

// ========================================
// Gamification
// ========================================

export const GET_LEVEL_PROGRESS = gql`
  query GetLevelProgress {
    levelProgress {
      level
      xp
      xpForNextLevel
      xpFromCurrentLevel
      xpNeeded
      progress
      currentTitle
    }
  }
`;

export const AWARD_XP = gql`
  mutation AwardXP($amount: Int!) {
    awardXP(amount: $amount) {
      newXP
      newLevel
      leveledUp
      newTitle
    }
  }
`;

// ========================================
// AI / Shopkeeper
// ========================================

export const SHOPKEEPER_REACT = gql`
  mutation ShopkeeperReact($action: String!, $productName: String, $rarity: String, $playerClass: String) {
    shopkeeperReact(action: $action, productName: $productName, rarity: $rarity, playerClass: $playerClass)
  }
`;

export const SHOPKEEPER_CHAT = gql`
  mutation ShopkeeperChat($message: String!, $context: String) {
    shopkeeperChat(message: $message, context: $context)
  }
`;
