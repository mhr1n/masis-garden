import { i18n, type Locale } from '../../../../i18n-config';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  const slugs = [
    'how-to-care-for-monstera',
    'snake-plant-apartment-guide',
    'pothos-easy-indoor-plant-armenia',
    'succulents-guide-armenia',
    'fiddle-leaf-fig-yerevan-care',
    'aloe-vera-armenia-benefits',
    'best-plants-yerevan-apartments-2026',
  ];
  return i18n.locales.flatMap(locale =>
    slugs.map(slug => ({
      lang: locale,
      slug,
    }))
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  return <BlogPostClient lang={lang} slug={slug} />;
}
