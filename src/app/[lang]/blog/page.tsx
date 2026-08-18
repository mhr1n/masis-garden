import { i18n, type Locale } from '../../../i18n-config';
import BlogListingClient from './BlogListingClient';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <BlogListingClient lang={lang} />;
}
