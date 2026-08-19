'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '../i18n-config';
import styles from './LanguageSwitcher.module.css';

// Crisp SVG Flag components for cross-platform compatibility (especially Windows)
const ArmeniaFlag = () => (
  <svg width="22" height="15" viewBox="0 0 300 200" style={{ borderRadius: '3px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
    <rect width="300" height="66.67" fill="#D90012" />
    <rect y="66.67" width="300" height="66.67" fill="#0033A0" />
    <rect y="133.33" width="300" height="66.67" fill="#F2A800" />
  </svg>
);

const UKFlag = () => (
  <svg width="22" height="15" viewBox="0 0 60 30" style={{ borderRadius: '3px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
    <clipPath id="uk-clip">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="uk-t">
      <path d="M30,15 h30 v15 z m0,0 h-30 v-15 z m0,0 h-30 v15 z m0,0 h30 v-15 z"/>
    </clipPath>
    <g clipPath="url(#uk-clip)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const RussiaFlag = () => (
  <svg width="22" height="15" viewBox="0 0 300 200" style={{ borderRadius: '3px', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
    <rect width="300" height="66.67" fill="#FFFFFF" />
    <rect y="66.67" width="300" height="66.67" fill="#0039A6" />
    <rect y="133.33" width="300" height="66.67" fill="#D52B1E" />
  </svg>
);

const LOCALE_DATA: Record<Locale, { label: string; icon: ReactNode }> = {
  en: { label: 'English', icon: <UKFlag /> },
  am: { label: 'Հայերեն', icon: <ArmeniaFlag /> },
  ru: { label: 'Русский', icon: <RussiaFlag /> },
};

interface LanguageSwitcherProps {
  currentLang: Locale;
  direction?: 'up' | 'down';
}

export default function LanguageSwitcher({ currentLang, direction = 'down' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    setIsOpen(false);
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  const activeLocale = LOCALE_DATA[currentLang] || LOCALE_DATA.en;

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        type="button"
        className={styles.glassBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.flagIcon}>{activeLocale.icon}</span>
        <span className={styles.label}>{activeLocale.label}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className={`${styles.glassMenu} ${direction === 'up' ? styles.menuUp : ''}`}>
          {i18n.locales.map((locale) => {
            const loc = LOCALE_DATA[locale as Locale];
            const isActive = locale === currentLang;
            return (
              <button
                key={locale}
                type="button"
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                onClick={() => handleSelect(locale as Locale)}
              >
                <span className={styles.flagIcon}>{loc.icon}</span>
                <span className={styles.label}>{loc.label}</span>
                {isActive && <span className={styles.check}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
