import { Resolver, Query, Args } from '@nestjs/graphql';
import { CatalogService } from './catalog.service';
import { ProductType, CategoryType, RarityTier } from '../graphql/types';

@Resolver(() => ProductType)
export class CatalogResolver {
  constructor(private catalogService: CatalogService) {}

  @Query(() => [ProductType], { name: 'products' })
  async getProducts(
    @Args('category', { nullable: true }) category?: string,
    @Args('rarityTier', { type: () => RarityTier, nullable: true }) rarityTier?: RarityTier,
  ) {
    return this.catalogService.findAll(category, rarityTier);
  }

  @Query(() => ProductType, { name: 'product', nullable: true })
  async getProduct(@Args('slug') slug: string) {
    return this.catalogService.findBySlug(slug);
  }

  @Query(() => [CategoryType], { name: 'categories' })
  async getCategories() {
    return this.catalogService.getCategories();
  }

  @Query(() => [ProductType], { name: 'searchProducts' })
  async searchProducts(@Args('query') query: string) {
    return this.catalogService.search(query);
  }
}
