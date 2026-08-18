import Link from 'next/link';
import { Locale } from '../i18n-config';
import { getDictionary } from '../get-dictionary';
import styles from './Footer.module.css';

export default async function Footer({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <h3>🌿 Masis Garden</h3>
          <p>{dict.footer.tagline}</p>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h4>Contact</h4>
          <p>{dict.footer.address}</p>
          <p>{dict.footer.email}</p>
          <p>{dict.footer.phone}</p>
        </div>

        {/* Social */}
        <div className={styles.col}>
          <h4>{dict.footer.followUs}</h4>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com/masisgarden" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
              Facebook
            </a>
            <a href="https://instagram.com/masis.garden" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
              Instagram
            </a>
            <a href="https://t.me/masisgarden" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M21.9 3.1L1.1 11.1a.5.5 0 000 .9l5.8 2.3 2.3 6.7a.5.5 0 00.9.1l3-3.6 5.8 2.2a.5.5 0 00.6-.4L22.5 3.6a.5.5 0 00-.6-.5z"/>
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Masis Garden. {dict.footer.rights} · <Link href="/admin" style={{ color: 'inherit', opacity: 0.7, textDecoration: 'underline' }}>🔒 Admin Panel</Link></p>
      </div>
    </footer>
  );
}
