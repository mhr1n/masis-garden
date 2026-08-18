import Link from 'next/link';
import { i18n, type Locale } from '../../../i18n-config';
import { getDictionary } from '../../../get-dictionary';
import styles from './wholesale.module.css';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function WholesalePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className={styles.wholesaleWrap}>
      <div className={styles.minimalCard}>
        
        {/* Header Tag */}
        <span className={styles.badge}>{dict.wholesale?.badge || '🤝 B2B & Wholesale Orders'}</span>
        
        <h1 className={styles.title}>{dict.wholesale?.title || 'Plant Wholesale & Bulk Import'}</h1>
        <p className={styles.subtitle}>
          {dict.wholesale?.subtitle || 'Specialized B2B plant supply & bulk freight logistics from Iran to Armenia. We partner with plant shops, online boutiques, garden centers, and landscape designers to provide premium acclimatized indoor greenery at wholesale rates.'}
        </p>

        {/* 3 Interactive Internal Glass Cards */}
        <div className={styles.glassGrid}>
          
          <div className={styles.glassCard}>
            <div className={styles.glassIcon}>📦</div>
            <div className={styles.glassContent}>
              <h3>{dict.wholesale?.pricingTitle || 'High-Volume Tier Pricing'}</h3>
              <p>{dict.wholesale?.pricingText || 'Special wholesale rates & bulk discount tiers tailored for flower shops and commercial resellers across Armenia.'}</p>
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className={styles.glassIcon}>🚚</div>
            <div className={styles.glassContent}>
              <h3>{dict.wholesale?.freightTitle || 'Freight: Iran to Armenia'}</h3>
              <p>{dict.wholesale?.freightText || 'Direct, climate-controlled bulk transport straight from top Persian nurseries to Armenia with phytosanitary clearance.'}</p>
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className={styles.glassIcon}>🌿</div>
            <div className={styles.glassContent}>
              <h3>{dict.wholesale?.stockTitle || 'Acclimatized Stock'}</h3>
              <p>{dict.wholesale?.stockText || 'Healthy, hand-inspected indoor plants fully acclimatized to local environments, guaranteed fresh and ready for resale.'}</p>
            </div>
          </div>

        </div>

        {/* Direct Action Contact Boxes */}
        <div className={styles.actionsGrid}>
          {/* Telegram */}
          <a 
            href="https://t.me/whmhran" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${styles.actionBtn} ${styles.telegramBtn}`}
          >
            <div className={styles.iconCircle}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M21.9 3.1L1.1 11.1a.5.5 0 000 .9l5.8 2.3 2.3 6.7a.5.5 0 00.9.1l3-3.6 5.8 2.2a.5.5 0 00.6-.4L22.5 3.6a.5.5 0 00-.6-.5z"/>
              </svg>
            </div>
            <div className={styles.btnText}>
              <span className={styles.btnTitle}>{dict.wholesale?.telegramLabel || 'Telegram B2B Direct'}</span>
              <span className={styles.btnSub}>@whmhran</span>
            </div>
            <span className={styles.arrow}>→</span>
          </a>

          {/* Phone / WhatsApp */}
          <a 
            href="tel:+37499062409" 
            className={`${styles.actionBtn} ${styles.phoneBtn}`}
          >
            <div className={styles.iconCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div className={styles.btnText}>
              <span className={styles.btnTitle}>{dict.wholesale?.phoneLabel || 'Phone & WhatsApp'}</span>
              <span className={styles.btnSub}>+374 99 062 409</span>
            </div>
            <span className={styles.arrow}>→</span>
          </a>
        </div>

        <div className={styles.footerLink}>
          <Link href={`/${lang}`} className={styles.backBtn}>
            {dict.wholesale?.backBtn || '← Back to Store'}
          </Link>
        </div>

      </div>
    </div>
  );
}
