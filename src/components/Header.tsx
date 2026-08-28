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
  const [phoneToastOpen, setPhoneToastOpen] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+374 99 062 409');
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2500);
  };

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
      contact: 'Get in Touch',
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
      privacy: 'Գաղտնիություն',
      contact: 'Կապ Մեզ Հետ',
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
      privacy: 'Конфиденциальность',
      contact: 'Связаться с нами',
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
    contact: 'Get in Touch',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    instagram: 'Instagram',
    facebook: 'Facebook',
    email: 'Email',
    phone: 'Phone',
  };

  const navLinks = [
    { href: `/${lang}#catalog`, label: menuTranslations.shop },
    { href: `/${lang}/blog`, label: menuTranslations.care },
    { href: `/${lang}/wholesale`, label: menuTranslations.wholesale },
    { href: `/${lang}#about`, label: menuTranslations.about },
    { href: `/${lang}/privacy`, label: menuTranslations.privacy },
  ];

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.overlayBody}>
          <nav className={styles.overlayNav}>
            <Link href={`/${lang}#catalog`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.linkLabelNumber}>🛍️</span>
              <span className={styles.linkLabelText}>{menuTranslations.shop}</span>
            </Link>
            <Link href={`/${lang}/blog`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.linkLabelNumber}>🌿</span>
              <span className={styles.linkLabelText}>{menuTranslations.care}</span>
            </Link>
            <Link href={`/${lang}/wholesale`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.linkLabelNumber}>🏢</span>
              <span className={styles.linkLabelText}>{menuTranslations.wholesale}</span>
            </Link>
            <Link href={`/${lang}#about`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.linkLabelNumber}>🌱</span>
              <span className={styles.linkLabelText}>{menuTranslations.about}</span>
            </Link>
            <button
              className={styles.overlayLinkBtn}
              onClick={() => {
                setMenuOpen(false);
                setHistoryOpen(true);
              }}
            >
              <span className={styles.linkLabelNumber}>📦</span>
              <span className={styles.linkLabelText}>{menuTranslations.myOrders}</span>
            </button>
            <Link href={`/${lang}/privacy`} className={styles.overlayLink} onClick={() => setMenuOpen(false)}>
              <span className={styles.linkLabelNumber}>🔒</span>
              <span className={styles.linkLabelText}>{menuTranslations.privacy}</span>
            </Link>
          </nav>

          <div className={styles.overlayContactSection}>
            <h4 className={styles.overlayContactTitle}>{menuTranslations.contact}</h4>
            <div className={styles.overlaySocialGrid}>
              <a href="https://wa.me/37499062409" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>{menuTranslations.whatsapp}</span>
              </a>
              <a href="https://t.me/masisgarden" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                <span>{menuTranslations.telegram}</span>
              </a>
              <a href="https://instagram.com/masis.garden" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>{menuTranslations.instagram}</span>
              </a>
              <a href="https://facebook.com/masisgarden" target="_blank" rel="noopener noreferrer" className={styles.overlaySocialItem}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span>{menuTranslations.facebook}</span>
              </a>
              <a href="mailto:masisgarden374@gmail.com" className={styles.overlaySocialItem}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{menuTranslations.email}</span>
              </a>
              <button onClick={() => setPhoneToastOpen(true)} className={styles.overlaySocialItem}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{menuTranslations.phone}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Order History Modal */}
      <OrderHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        lang={lang}
      />

      {/* Phone Number Glass Toast Bar */}
      {phoneToastOpen && (
        <div className={styles.phoneBackdrop} onClick={() => setPhoneToastOpen(false)} />
      )}
      <div className={`${styles.phoneToast} ${phoneToastOpen ? styles.phoneToastOpen : ''}`}>
        <div className={styles.phoneToastInner}>
          <div className={styles.phoneToastInfo}>
            <span className={styles.phoneToastIcon}>📞</span>
            <div>
              <div className={styles.phoneToastLabel}>Masis Garden</div>
              <div className={styles.phoneToastNumber}>+374 99 062 409</div>
            </div>
          </div>
          <div className={styles.phoneToastActions}>
            <button className={styles.phoneCopyBtn} onClick={handleCopyPhone}>
              {phoneCopied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
              <span>{phoneCopied ? 'Copied!' : 'Copy'}</span>
            </button>
            <a href="tel:+37499062409" className={styles.phoneCallBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Call</span>
            </a>
            <button className={styles.phoneCloseBtn} onClick={() => setPhoneToastOpen(false)}>✕</button>
          </div>
        </div>
      </div>
    </>
  );
}
