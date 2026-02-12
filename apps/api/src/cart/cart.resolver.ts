import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemType } from '../graphql/types';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => CartItemType)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => [CartItemType], { name: 'cart' })
  @UseGuards(GqlAuthGuard)
  async getCart(@Context() ctx: { req: { user: { userId: string } } }) {
    return this.cartService.getCart(ctx.req.user.userId);
  }

  @Mutation(() => CartItemType)
  @UseGuards(GqlAuthGuard)
  async addToCart(
    @Context() ctx: { req: { user: { userId: string } } },
    @Args('productId') productId: string,
    @Args('quantity', { type: () => Int, defaultValue: 1 }) quantity: number,
    @Args('skuId', { nullable: true }) skuId?: string,
  ) {
    return this.cartService.addToCart(ctx.req.user.userId, productId, quantity, skuId);
  }

  @Mutation(() => CartItemType)
  @UseGuards(GqlAuthGuard)
  async removeFromCart(
    @Context() ctx: { req: { user: { userId: string } } },
    @Args('cartItemId') cartItemId: string,
  ) {
    return this.cartService.removeFromCart(ctx.req.user.userId, cartItemId);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async clearCart(@Context() ctx: { req: { user: { userId: string } } }) {
    await this.cartService.clearCart(ctx.req.user.userId);
    return true;
  }
}
