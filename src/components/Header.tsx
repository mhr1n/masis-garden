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
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`, label: dict.navigation?.home || 'Home' },
    { href: `/${lang}#catalog`, label: dict.navigation?.category || 'Shop' },
    { href: `/${lang}/wholesale`, label: dict.navigation?.bulkImport || 'Wholesale' },
    { href: `/${lang}/blog`, label: dict.navigation?.blog || 'Blog' },
    { href: `/${lang}#about`, label: dict.navigation?.about || 'About' },
  ];

  const trackLabel = {
    en: 'My Orders',
    am: 'Իմ պատվերները',
    ru: 'Мои заказы',
  }[lang] || 'My Orders';

  const menuTranslations = {
    en: {
      shop: dict.navigation?.category || 'Shop',
      care: dict.navigation?.blog || 'Care Services',
      wholesale: dict.navigation?.bulkImport || 'Wholesale',
      about: dict.navigation?.about || 'About Us',
      myOrders: trackLabel,
      privacy: 'Privacy Policy',
      contact: 'Contact Us',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      instagram: 'Instagram',
      facebook: 'Facebook',
      email: 'Email',
      phone: 'Phone',
    },
    am: {
      shop: 'Խանութ',
      care: 'Խնամք',
      wholesale: 'Մեծածախ',
      about: 'Մեր մասին',
      myOrders: trackLabel,
      privacy: 'Գաղտնիության Քաղաքականություն',
      contact: 'Կապ մեզ հետ',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      instagram: 'Instagram',
      facebook: 'Facebook',
      email: 'Էլ. Փոստ',
      phone: 'Հեռախոս',
    },
    ru: {
      shop: 'Магазин',
      care: 'Уход за растениями',
      wholesale: 'Оптовые поставки',
      about: 'О нас',
      myOrders: trackLabel,
      privacy: 'Политика конфиденциальности',
      contact: 'Контакты',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      instagram: 'Instagram',
      facebook: 'Facebook',
      email: 'Email',
      phone: 'Телефон',
    }
  }[lang as 'en' | 'am' | 'ru'] || {
    shop: 'Shop',
    care: 'Care Services',
    wholesale: 'Wholesale',
    about: 'About Us',
    myOrders: trackLabel,
    privacy: 'Privacy Policy',
    contact: 'Contact Us',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    instagram: 'Instagram',
    facebook: 'Facebook',
    email: 'Email',
    phone: 'Phone',
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerContainer}`}>
          {/* Left Area (Hamburger + Logo) */}
          <div className={styles.leftArea}>
            {/* Hamburger Menu Button (Mobile only) */}
            <button
              className={styles.hamburgerBtn}
              onClick={() => setMenuOpen(true)}
              aria-label="Toggle Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Logo */}
            <div className={styles.logo}>
              <a href={`/${lang}`}>
                Masis Garden
                <span className={styles.logoLeaf}>🌿</span>
              </a>
            </div>
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

      {/* Mobile Overlay Menu */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOverlayOpen : ''}`}>
        <div className={styles.overlayHeader}>
          <div className={styles.logo}>
            <Link href={`/${lang}`} onClick={() => setMenuOpen(false)}>
              Masis Garden
              <span className={styles.logoLeaf}>🌿</span>
            </Link>
          </div>
          <button
            className={styles.overlayClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className={styles.overlayNav}>
          <Link href={`/${lang}#catalog`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
            {menuTranslations.shop}
          </Link>
          <Link href={`/${lang}/blog`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
            {menuTranslations.care}
          </Link>
          <Link href={`/${lang}/wholesale`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
            {menuTranslations.wholesale}
          </Link>
          <Link href={`/${lang}#about`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
            {menuTranslations.about}
          </Link>
          <button
            className={styles.overlayLinkBtn}
            onClick={() => {
              setMenuOpen(false);
              setHistoryOpen(true);
            }}
          >
            {menuTranslations.myOrders}
          </button>
          <Link href={`/${lang}/privacy`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
            {menuTranslations.privacy}
          </Link>
        </nav>

        <div className={styles.overlayContactSection}>
          <h4 className={styles.overlayContactTitle}>{menuTranslations.contact}</h4>
          <div className={styles.overlaySocialGrid}>
            <a href="https://wa.me/37499062409" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
              <span className={styles.socialIcon}>💬</span>
              <span>{menuTranslations.whatsapp}</span>
            </a>
            <a href="https://t.me/masisgarden" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
              <span className={styles.socialIcon}>✈️</span>
              <span>{menuTranslations.telegram}</span>
            </a>
            <a href="https://instagram.com/masis.garden" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
              <span className={styles.socialIcon}>📸</span>
              <span>{menuTranslations.instagram}</span>
            </a>
            <a href="https://facebook.com/masisgarden" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
              <span className={styles.socialIcon}>👤</span>
              <span>{menuTranslations.facebook}</span>
            </a>
            <a href="mailto:masisgarden374@gmail.com" className={styles.overlaySocialItem}>
              <span className={styles.socialIcon}>✉️</span>
              <span>{menuTranslations.email}</span>
            </a>
            <a href="tel:+37499062409" className={styles.overlaySocialItem}>
              <span className={styles.socialIcon}>📞</span>
              <span>{menuTranslations.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Customer Order History Modal */}
      <OrderHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        lang={lang}
      />
    </>
  );
}
