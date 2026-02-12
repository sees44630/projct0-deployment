import { MOCK_PRODUCTS } from '@/lib/data';
import { gqlClient } from '@/lib/graphql-client';
import { GET_PRODUCTS } from '@/lib/queries';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const data = await gqlClient.request<{ products: { slug: string }[] }>(GET_PRODUCTS);
    const apiSlugs = data.products.map((p) => ({ slug: p.slug }));
    const mockSlugs = MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
    const combined = [...apiSlugs, ...mockSlugs];
    const unique = Array.from(new Set(combined.map((s) => s.slug))).map((slug) => ({ slug }));
    return unique;
  } catch (error) {
    console.warn('Static generation fetch failed, using mocks:', error);
    return MOCK_PRODUCTS.map((p) => ({ slug: p.slug }));
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return <ProductDetailClient params={params} />;
}
