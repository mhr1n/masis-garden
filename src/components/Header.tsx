'use client';

import Link from 'next/link';
import { Locale } from '../i18n-config';
import styles from './Header.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import OrderHistoryModal from './OrderHistoryModal';

export default function Header({ lang, dict }: { lang: Locale; dict: any }) {
  const { cartCount, setIsCartOpen } = useCart();
  const [historyOpen, setHistoryOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`, label: dict.navigation?.home || 'Home' },
    { href: `/${lang}#catalog`, label: dict.navigation?.category || 'Shop' },
    { href: `/${lang}/wholesale`, label: dict.navigation?.bulkImport || 'Wholesale' },
    { href: `/${lang}/blog`, label: dict.navigation?.blog || 'Blog' },
    { href: `/${lang}#about`, label: dict.navigation?.about || 'About' },
  ];

  const trackLabel = {
    en: 'My Orders',
    am: 'Պատվերներ',
    ru: 'Мои заказы',
  }[lang] || 'My Orders';

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          {/* Logo */}
          <div className={styles.logo}>
            <a href={`/${lang}`}>
              <span className={styles.logoLeaf}>🌿</span>
              Masis Garden
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Track Orders Button (Desktop) */}
            <button
              className={styles.trackBtn}
              onClick={() => setHistoryOpen(true)}
              title="Track Orders & History"
            >
              <span>📦</span>
              <span>{trackLabel}</span>
            </button>

            <div className={styles.badge247}>{dict.common?.['24_7'] || '24/7 Support'}</div>
            <LanguageSwitcher currentLang={lang} />
            <button
              className={styles.cartBtn}
              aria-label={dict.common?.cart || 'Cart'}
              onClick={() => setIsCartOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20a1 1 0 100-2 1 1 0 000 2zM20 20a1 1 0 100-2 1 1 0 000 2z" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <span className={styles.cartCount}>{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Customer Order History Modal */}
      <OrderHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        lang={lang}
      />
    </>
  );
}
