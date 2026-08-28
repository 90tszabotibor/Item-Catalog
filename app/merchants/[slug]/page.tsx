import { notFound } from 'next/navigation';
import MerchantDetailClient from '@/app/MerchantDetailClient';
import { merchantBySlug, merchants } from '@/app/merchant-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return merchants.map((merchant) => ({ slug: merchant.slug }));
}

export default async function MerchantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const merchant = merchantBySlug(slug);

  if (!merchant) notFound();

  return <MerchantDetailClient merchant={merchant} />;
}
