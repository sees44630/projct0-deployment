import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, rarityTier?: string) {
    return this.prisma.product.findMany({
      where: {
        ...(category && { category: { slug: category } }),
        ...(rarityTier && { rarityTier }),
      },
      include: {
        category: true,
        skus: true,
        assets: true,
        stats: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        skus: true,
        assets: true,
        stats: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        skus: true,
        assets: true,
        stats: true,
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: {
        category: true,
        skus: true,
        assets: true,
        stats: true,
      },
    });
  }
}
