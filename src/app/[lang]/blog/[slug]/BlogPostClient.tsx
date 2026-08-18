'use client';

import { useBlog, BlogPost } from '../../../../context/BlogContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './post.module.css';

function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '')
    .replace(/<\/ul><ul>/g, '')
    .trim();
}

export default function BlogPostClient({ lang: langProp, slug }: { lang: string; slug: string }) {
  const { posts } = useBlog();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const pathname = usePathname();

  // Always read lang live from the URL — this ensures language switching
  // via LanguageSwitcher (which updates the URL) is immediately reflected
  const lang = pathname?.split('/')?.[1] || langProp;

  useEffect(() => {
    const found = posts.find(p => p.slug === slug);
    setPost(found);
  }, [posts, slug]);

  const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    care:       { en: 'Plant Care',    ru: 'Уход за растениями', am: 'Բույսերի խնամք' },
    species:    { en: 'Species Guide', ru: 'Виды растений',      am: 'Բույսի տեսակ'   },
    decoration: { en: 'Decoration',   ru: 'Декор',               am: 'Դեկոր'           },
    tips:       { en: 'Tips & Tricks', ru: 'Советы',             am: 'Խորհուրդներ'     },
  };

  if (!post) {
    return (
      <div className={styles.notFound}>
        <span>🌵</span>
        <h2>
          {lang === 'ru' ? 'Статья не найдена'
           : lang === 'am' ? 'Հոդվածը չի գտnvel'
           : 'Article not found'}
        </h2>
        <Link href={`/${lang}/blog`} className={styles.backLink}>
          ← {lang === 'ru' ? 'Вернуться' : lang === 'am' ? 'Վerадарnalу' : 'Go back'}
        </Link>
      </div>
    );
  }

  const title =
    lang === 'ru' && post.titleRu ? post.titleRu :
    lang === 'am' && post.titleAm ? post.titleAm :
    post.title;

  const content =
    lang === 'ru' && post.contentRu ? post.contentRu :
    lang === 'am' && post.contentAm ? post.contentAm :
    post.content;

  const categoryLabel =
    CATEGORY_LABELS[post.category]?.[lang] ?? CATEGORY_LABELS[post.category]?.en ?? post.category;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(
      lang === 'am' ? 'hy-AM' : lang === 'ru' ? 'ru-RU' : 'en-GB',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );

  return (
    <div className={styles.postPage}>
      <div className={styles.postContainer}>

        {/* Back Button */}
        <Link href={`/${lang}/blog`} className={styles.backBtn}>
          ← {lang === 'ru' ? 'Все статьи' : lang === 'am' ? 'Բոlor hodvatsknery' : 'All Articles'}
        </Link>

        {/* Post Header */}
        <header className={styles.postHeader}>
          <div className={styles.metaRow}>
            <span className={styles.categoryChip}>{categoryLabel}</span>
            <span className={styles.metaDate}>{formatDate(post.publishedAt)}</span>
            <span className={styles.metaRead}>
              ⏱ {post.readTime} {lang === 'ru' ? 'мин' : lang === 'am' ? 'ր' : 'min read'}
            </span>
          </div>
          <h1 className={styles.postTitle}>{title}</h1>
          <div className={styles.tagsRow}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        </header>

        {/* Post Content */}
        <article
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: `<p>${renderMarkdown(content)}</p>` }}
        />

        {/* Footer CTA */}
        <div className={styles.postFooter}>
          <div className={styles.footerCard}>
            <span className={styles.footerIcon}>🌿</span>
            <div>
              <strong>Masis Garden</strong>
              <p>
                {lang === 'ru'
                  ? 'Премиальные комнатные растения в Ереване'
                  : lang === 'am'
                  ? 'Պреmium senякayan bmuysner Yerevanum'
                  : 'Premium indoor plants in Yerevan, Armenia'}
              </p>
            </div>
            <Link href={`/${lang}`} className={styles.footerShopBtn}>
              {lang === 'ru' ? 'В магазин' : lang === 'am' ? 'Khanut' : 'Shop Now'} →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
