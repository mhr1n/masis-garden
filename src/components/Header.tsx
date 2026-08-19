'use client';

import Link from 'next/link';
import { Locale } from '../i18n-config';
import styles from './Header.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

export default function Header({ lang, dict }: { lang: Locale; dict: any }) {
  const { cartCount, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { href: `/${lang}`, label: dict.navigation.home || 'Home' },
    { href: `/${lang}#catalog`, label: dict.navigation.category || 'Shop' },
    { href: `/${lang}/wholesale`, label: dict.navigation.bulkImport || 'Wholesale' },
    { href: `/${lang}/blog`, label: dict.navigation.blog || 'Blog' },
    { href: `/${lang}#about`, label: dict.navigation.about || 'About' },
  ];

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
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={styles.badge247}>{dict.common['24_7']}</div>
            <LanguageSwitcher currentLang={lang} />
            <button className={styles.cartBtn} aria-label={dict.common.cart} onClick={() => setIsCartOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 20a1 1 0 100-2 1 1 0 000 2zM20 20a1 1 0 100-2 1 1 0 000 2z"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <span className={styles.cartCount}>{cartCount}</span>
            </button>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`}>
        {/* Close button */}
        <button className={styles.overlayClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Brand */}
        <div className={styles.overlayBrand}>
          <span style={{ fontSize: '2rem' }}>🌿</span>
          <span className={styles.overlayBrandName}>Masis Garden</span>
        </div>

        {/* Nav Links */}
        <nav className={styles.overlayNav}>
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.overlayLink}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className={styles.overlayFooter}>
          <LanguageSwitcher currentLang={lang} direction="up" />
          <button
            className={styles.overlayCartBtn}
            onClick={() => { setMenuOpen(false); setIsCartOpen(true); }}
          >
            🛒 {dict.common.cart}
            {cartCount > 0 && <span className={styles.overlayCartCount}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </>
  );
}
