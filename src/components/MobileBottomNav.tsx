'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import styles from './MobileBottomNav.module.css';
import OrderHistoryModal from './OrderHistoryModal';

interface MobileBottomNavProps {
  lang: string;
}

export default function MobileBottomNav({ lang }: MobileBottomNavProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const [historyOpen, setHistoryOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;

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
    en: { home: 'Feed', catalog: 'Explore', orders: 'Orders', cart: 'Cart' },
    am: { home: 'Գլխավոր', catalog: 'Բույսեր', orders: 'Պատվերներ', cart: 'Զամբյուղ' },
    ru: { home: 'Главная', catalog: 'Каталог', orders: 'Заказы', cart: 'Корзина' },
  }[lang as 'en' | 'am' | 'ru'] || { home: 'Feed', catalog: 'Explore', orders: 'Orders', cart: 'Cart' };

  return (
    <>
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

          {/* 3. My Orders & Tracking */}
          <button
            className={styles.dockItem}
            onClick={() => setHistoryOpen(true)}
            aria-label={labels.orders}
          >
            <span className={styles.dockIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </span>
            <span className={styles.dockLabel}>{labels.orders}</span>
          </button>

          {/* 4. Cart with Luxury Badge */}
          <button
            className={styles.dockItem}
            onClick={() => setIsCartOpen(true)}
            aria-label={labels.cart}
          >
            <span className={styles.dockIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </span>
            <span className={styles.dockLabel}>{labels.cart}</span>
          </button>
        </nav>
      </div>

      {/* Orders Tracking Modal */}
      <OrderHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        lang={lang}
      />
    </>
  );
}
