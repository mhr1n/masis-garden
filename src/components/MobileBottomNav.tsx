'use client';

import { useState, useEffect } from 'react';
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
    en: { home: 'Feed', catalog: 'Explore', orders: 'Orders', chat: 'Support', cart: 'Cart' },
    am: { home: 'Գլխավոր', catalog: 'Բույսեր', orders: 'Պատվերներ', chat: 'Չաթ', cart: 'Զամբյուղ' },
    ru: { home: 'Главная', catalog: 'Каталог', orders: 'Заказы', chat: 'Чат', cart: 'Корзина' },
  }[lang as 'en' | 'am' | 'ru'] || { home: 'Feed', catalog: 'Explore', orders: 'Orders', chat: 'Support', cart: 'Cart' };

  return (
    <>
      <nav className={styles.bottomNav} aria-label="Mobile Navigation">
        {/* 1. Feed / Home */}
        <button
          className={`${styles.navItem} ${isHome ? styles.navItemActive : ''}`}
          onClick={scrollToTop}
          aria-label={labels.home}
        >
          <span className={styles.navIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className={styles.navLabel}>{labels.home}</span>
        </button>

        {/* 2. Explore / Catalog */}
        <button
          className={styles.navItem}
          onClick={scrollToCatalog}
          aria-label={labels.catalog}
        >
          <span className={styles.navIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className={styles.navLabel}>{labels.catalog}</span>
        </button>

        {/* 3. My Orders & Tracking */}
        <button
          className={styles.navItem}
          onClick={() => setHistoryOpen(true)}
          aria-label={labels.orders}
        >
          <span className={styles.navIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </span>
          <span className={styles.navLabel}>{labels.orders}</span>
        </button>

        {/* 4. Support / WhatsApp & Ticket */}
        <a
          href="https://wa.me/37494062409"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navItem}
          aria-label={labels.chat}
        >
          <span className={styles.navIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <span className={styles.navLabel}>{labels.chat}</span>
        </a>

        {/* 5. Cart with Live Badge */}
        <button
          className={styles.navItem}
          onClick={() => setIsCartOpen(true)}
          aria-label={labels.cart}
        >
          <span className={styles.navIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </span>
          <span className={styles.navLabel}>{labels.cart}</span>
        </button>
      </nav>

      {/* Orders Tracking Modal */}
      <OrderHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        lang={lang}
      />
    </>
  );
}
