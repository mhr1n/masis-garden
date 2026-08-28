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
    <div className={styles.splitLayout}>
      
      {/* Left Column: Image */}
      <div className={styles.imageCol}>
        <img 
          src="https://wdmmnaygesayufugenzv.supabase.co/storage/v1/object/sign/image/wholesale-poster.jpg?token=eyJraWQiOiJiNTgzYmE2Yy02MzAxLTQzNTQtOTYxNy1iZjU0MmJjM2M3ZWQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS93aG9sZXNhbGUtcG9zdGVyLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODc3Mjc1MzAsImV4cCI6MTgxOTI2MzUzMH0.D7FZfco_DrOLOeivCLKSKtWBhGJTc5E5E6i2AVrLwsk" 
          alt="Wholesale Poster" 
          className={styles.posterImg}
        />
      </div>

      {/* Right Column: Minimalist Content */}
      <div className={styles.contentCol}>
        <div className={styles.contentInner}>
          <span className={styles.badge}>{dict.wholesale?.badge || '🏷️ B2B & Wholesale Orders'}</span>
          
          <h1 className={styles.title}>{dict.wholesale?.title || 'Plant Wholesale & Bulk Import'}</h1>
          
          <p className={styles.subtitle}>
            {dict.wholesale?.subtitle || 'Specialized B2B plant supply & bulk freight logistics from Iran to Armenia. We partner with plant shops, online boutiques, garden centers, and landscape designers to provide premium acclimatized indoor greenery at wholesale rates.'}
          </p>

          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>💎</span>
              <div>
                <h4 className={styles.featureTitle}>{dict.wholesale?.pricingTitle || 'High-Volume Tier Pricing'}</h4>
                <p className={styles.featureText}>{dict.wholesale?.pricingText || 'Special wholesale rates & bulk discount tiers tailored for flower shops and commercial resellers across Armenia.'}</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🚚</span>
              <div>
                <h4 className={styles.featureTitle}>{dict.wholesale?.freightTitle || 'Freight: Iran to Armenia'}</h4>
                <p className={styles.featureText}>{dict.wholesale?.freightText || 'Direct, climate-controlled bulk transport straight from top Persian nurseries to Armenia with phytosanitary clearance.'}</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🌿</span>
              <div>
                <h4 className={styles.featureTitle}>{dict.wholesale?.stockTitle || 'Acclimatized Stock'}</h4>
                <p className={styles.featureText}>{dict.wholesale?.stockText || 'Healthy, hand-inspected indoor plants fully acclimatized to local environments, guaranteed fresh and ready for resale.'}</p>
              </div>
            </div>
          </div>

          <div className={styles.contactActions}>
            <a 
              href="https://t.me/whmhran" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.btnTelegram}
            >
              Telegram B2B 
            </a>
            
            <a 
              href="https://wa.me/37499062409" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.btnWhatsapp}
            >
              WhatsApp B2B 
            </a>
          </div>

          <div className={styles.footerLink}>
            <Link href={`/${lang}`} className={styles.backBtn}>
              {dict.wholesale?.backBtn || '← Back to Store'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
