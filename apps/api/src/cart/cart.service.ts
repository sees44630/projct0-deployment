import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
    });
  }

  async addToCart(userId: string, productId: string, quantity: number = 1, skuId?: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    // Check if already in cart
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId, productId, skuId: skuId || null },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, productId, quantity, skuId },
    });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, cartItemId);
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }

  async createOrder(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({ where: { userId } });
    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Get product prices
    const products = await this.prisma.product.findMany({
      where: { id: { in: cartItems.map((i) => i.productId) } },
    });
    const priceMap = new Map(products.map((p) => [p.id, p.price]));

    const total = cartItems.reduce(
      (sum, item) => sum + (priceMap.get(item.productId) || 0) * item.quantity,
      0,
    );

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            skuId: item.skuId,
            quantity: item.quantity,
            price: priceMap.get(item.productId) || 0,
          })),
        },
      },
      include: { items: true },
    });

    // Clear cart after order
    await this.clearCart(userId);

    return order;
  }
}
