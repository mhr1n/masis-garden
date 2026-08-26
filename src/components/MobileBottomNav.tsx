'use client';

import { usePathname } from 'next/navigation';
import styles from './MobileBottomNav.module.css';

interface MobileBottomNavProps {
  lang: string;
}

export default function MobileBottomNav({ lang }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
  const isBlog = pathname?.includes('/blog');
  const isWholesale = pathname?.includes('/wholesale');

  const scrollToCatalog = () => {
    if (isHome) {
      const catalog = document.getElementById('catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.location.href = `/${lang}#catalog`;
  };

  const scrollToTop = () => {
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = `/${lang}`;
    }
  };

  const labels = {
    en: { home: 'Feed', catalog: 'Explore', blog: 'Care', wholesale: 'Wholesale' },
    am: { home: 'Գլխավոր', catalog: 'Կատալոգ', blog: 'Խնամք', wholesale: 'Մեծածախ' },
    ru: { home: 'Главная', catalog: 'Каталог', blog: 'Уход', wholesale: 'Опт' },
  }[lang as 'en' | 'am' | 'ru'] || { home: 'Feed', catalog: 'Explore', blog: 'Care', wholesale: 'Wholesale' };

  return (
    <div className={styles.floatingDockWrapper}>
      <nav className={styles.floatingDock} aria-label="Mobile Navigation Dock">
        {/* 1. Feed / Home */}
        <button
          className={`${styles.dockItem} ${isHome ? styles.dockItemActive : ''}`}
          onClick={scrollToTop}
          aria-label={labels.home}
        >
          <span className={styles.dockIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className={styles.dockLabel}>{labels.home}</span>
          {isHome && <span className={styles.activeDot} />}
        </button>

        {/* 2. Explore / Catalog */}
        <button
          className={styles.dockItem}
          onClick={scrollToCatalog}
          aria-label={labels.catalog}
        >
          <span className={styles.dockIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className={styles.dockLabel}>{labels.catalog}</span>
        </button>

        {/* 3. Plant Care Guide / Blog */}
        <a
          href={`/${lang}/blog`}
          className={`${styles.dockItem} ${isBlog ? styles.dockItemActive : ''}`}
          aria-label={labels.blog}
        >
          <span className={styles.dockIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4.5A2.5 2.5 0 0 1 6 2z" />
            </svg>
          </span>
          <span className={styles.dockLabel}>{labels.blog}</span>
          {isBlog && <span className={styles.activeDot} />}
        </a>

        {/* 4. Bulk Import / Wholesale */}
        <a
          href={`/${lang}/wholesale`}
          className={`${styles.dockItem} ${isWholesale ? styles.dockItemActive : ''}`}
          aria-label={labels.wholesale}
        >
          <span className={styles.dockIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21 16 12 21 3 16" />
              <polyline points="21 12 12 17 3 12" />
              <polyline points="18 8 12 11 6 8" />
              <polyline points="21 8 12 3 3 8" />
              <line x1="12" y1="3" x2="12" y2="11" />
            </svg>
          </span>
          <span className={styles.dockLabel}>{labels.wholesale}</span>
          {isWholesale && <span className={styles.activeDot} />}
        </a>
      </nav>
    </div>
  );
}
