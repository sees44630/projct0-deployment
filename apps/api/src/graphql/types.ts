import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';

// ========================================
// Enums
// ========================================
export enum RarityTier {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

registerEnumType(RarityTier, { name: 'RarityTier' });

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

/**
  * ProductStats — "Weapon Stats" radar chart values
  */
@ObjectType()
export class ProductStatsType {
  @Field(() => Int)
  quality!: number;

  @Field(() => Int)
  rarity!: number;

  @Field(() => Int)
  comfort!: number;

  @Field(() => Int)
  style!: number;

  @Field(() => Int)
  value!: number;
}

/**
  * Category
  */
@ObjectType()
export class CategoryType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  slug!: string;
}

/**
  * ProductAsset
  */
@ObjectType()
export class ProductAssetType {
  @Field(() => ID)
  id!: string;

  @Field()
  type!: string;

  @Field()
  url!: string;
}

/**
  * SKU (Size/Color variant)
  */
@ObjectType()
export class SKUType {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Int)
  stockQuantity!: number;
}

/**
  * Product — the main "Loot" item
  */
@ObjectType()
export class ProductType {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  slug!: string;

  @Field()
  description!: string;

  @Field(() => Float)
  price!: number;

  @Field(() => RarityTier)
  rarityTier!: RarityTier;

  @Field(() => CategoryType, { nullable: true })
  category?: CategoryType;

  @Field(() => [SKUType])
  skus!: SKUType[];

  @Field(() => [ProductAssetType])
  assets!: ProductAssetType[];

  @Field(() => ProductStatsType, { nullable: true })
  stats?: ProductStatsType;
}

/**
  * CartItem
  */
@ObjectType()
export class CartItemType {
  @Field(() => ID)
  id!: string;

  @Field()
  productId!: string;

  @Field({ nullable: true })
  skuId?: string;

  @Field(() => Int)
  quantity!: number;
}

/**
  * Profile — the player's RPG stats
  */
@ObjectType()
export class ProfileType {
  @Field(() => ID)
  id!: string;

  @Field()
  displayName!: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => Int)
  level!: number;

  @Field(() => Int)
  xp!: number;

  @Field()
  currentTitle!: string;
}

/**
  * User — "The Player"
  */
@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;

  @Field(() => ProfileType, { nullable: true })
  profile?: ProfileType;
}

/**
  * Auth response with JWT token
  */
@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;

  @Field(() => UserType)
  user!: UserType;
}
