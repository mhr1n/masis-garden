'use client';

import { useBlog, BlogPost } from '../../../context/BlogContext';
import Link from 'next/link';
import { useState } from 'react';
import styles from './blog.module.css';

const CATEGORY_LABELS = {
  care: '🌿 Plant Care',
  species: '🔬 Species Guide',
  decoration: '🖼️ Decoration',
  tips: '💡 Tips & Tricks',
};

const CATEGORY_COLORS = {
  care: '#4A7C59',
  species: '#5B6A3E',
  decoration: '#8B5E52',
  tips: '#4A6580',
};

export default function BlogListingClient({ lang }: { lang: string }) {
  const { posts } = useBlog();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);

  const getTitle = (post: BlogPost) => {
    if (lang === 'ru' && post.titleRu) return post.titleRu;
    if (lang === 'am' && post.titleAm) return post.titleAm;
    return post.title;
  };

  const getSummary = (post: BlogPost) => {
    if (lang === 'ru' && post.summaryRu) return post.summaryRu;
    if (lang === 'am' && post.summaryAm) return post.summaryAm;
    return post.summary;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'am' ? 'hy-AM' : lang === 'ru' ? 'ru-RU' : 'en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  return (
    <div className={styles.blogPage}>
      {/* Hero Banner */}
      <div className={styles.blogHero}>
        <span className={styles.heroBadge}>🌱 Plant Knowledge</span>
        <h1 className={styles.heroTitle}>
          {lang === 'ru' ? 'Гид по растениям' : lang === 'am' ? 'Բույսերի Ուղեցույց' : 'Plant Care Guide'}
        </h1>
        <p className={styles.heroSubtitle}>
          {lang === 'ru'
            ? 'Экспертные советы по уходу за растениями, руководства по видам и советы по декору от Masis Garden'
            : lang === 'am'
            ? 'Masis Garden-ի փորձագիտական խորհուրդներ բույսերի խնամքի, տեսակների ուղեցույցների մասին'
            : 'Expert care tips, species guides, and decor inspiration from Masis Garden'}
        </p>
      </div>

      {/* Category Filter */}
      <div className={styles.filterRow}>
        {['all', 'care', 'species', 'decoration', 'tips'].map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all'
              ? (lang === 'ru' ? '📚 Все' : lang === 'am' ? '📚 Բոլորը' : '📚 All')
              : CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span style={{ fontSize: '3rem' }}>🌵</span>
          <p>{lang === 'ru' ? 'Статей не найдено' : lang === 'am' ? 'Հոդվածներ չեն գտնվել' : 'No articles found'}</p>
        </div>
      ) : (
        <div className={styles.postGrid}>
          {filtered.map(post => (
            <Link key={post.id} href={`/${lang}/blog/${post.slug}`} className={styles.postCard}>
              {/* Cover Image */}
              <div className={styles.cardCover}>
                {post.coverImage ? (
                  <img src={post.coverImage} alt={getTitle(post)} className={styles.coverImg} />
                ) : (
                  <div className={styles.coverPlaceholder}>
                    <span>🌿</span>
                  </div>
                )}
                <div
                  className={styles.categoryBadge}
                  style={{ background: CATEGORY_COLORS[post.category] }}
                >
                  {CATEGORY_LABELS[post.category]}
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{getTitle(post)}</h2>
                <p className={styles.cardSummary}>{getSummary(post)}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.metaDate}>{formatDate(post.publishedAt)}</span>
                  <span className={styles.metaRead}>⏱ {post.readTime} min</span>
                </div>
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
