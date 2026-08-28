'use client';

import Link from 'next/link';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  dict: any;
  lang?: string;
}

export default function AboutSection({ dict, lang = 'en' }: AboutSectionProps) {
  const sectionTranslations = {
    en: {
      careTitle: "Care Services",
      careDesc: "Professional plant maintenance, pruning, and scheduled watering for businesses & homes.",
      wholesaleTitle: "Bulk Import & Wholesale",
      wholesaleDesc: "Premium plant logistics, direct imports from nurseries to Armenia at wholesale rates.",
      privacyTitle: "Privacy & Data Policy",
      privacyDesc: "How we securely store, manage, and safeguard your personal details and receipts.",
      contactTitle: "Get in Touch / Community",
      contactDesc: "Reach our support team or connect with plant lovers on our official channels.",
    },
    am: {
      careTitle: "Խնամքի Ծառայություններ",
      careDesc: "Բույսերի պրոֆեսիոնալ խնամք, կանոնավոր ջրում և ձևավորում գրասենյակների ու տների համար:",
      wholesaleTitle: "Մեծածախ Ներմուծում",
      wholesaleDesc: "Բարձրորակ բույսերի մատակարարում և ուղղակի բեռնափոխադրումներ լավագույն գներով:",
      privacyTitle: "Գաղտնիություն",
      privacyDesc: "Ինչպես ենք մենք անվտանգ պահում և պաշտպանում ձեր անձնական տվյալներն ու կտրոնները:",
      contactTitle: "Կապ Մեզ Հետ / Համայնք",
      contactDesc: "Կապվեք մեր աջակցման թիմի հետ կամ միացեք մեզ պաշտոնական ալիքներով:",
    },
    ru: {
      careTitle: "Уход за растениями",
      careDesc: "Профессиональное обслуживание растений, обрезка и регулярный полив для офисов и домов.",
      wholesaleTitle: "Оптовые поставки",
      wholesaleDesc: "Прямой импорт акклиматизированных растений по оптовым ценам в Армению.",
      privacyTitle: "Конфиденциальность",
      privacyDesc: "Как мы безопасно храним и защищаем ваши личные данные и платежные чеки.",
      contactTitle: "Связаться с нами",
      contactDesc: "Напишите в нашу службу поддержки или присоединяйтесь к нашему сообществу.",
    }
  }[lang as 'en' | 'am' | 'ru'] || {
    careTitle: "Care Services",
    careDesc: "Professional plant maintenance, pruning, and scheduled watering for businesses & homes.",
    wholesaleTitle: "Bulk Import & Wholesale",
    wholesaleDesc: "Premium plant logistics, direct imports from nurseries to Armenia at wholesale rates.",
    privacyTitle: "Privacy & Data Policy",
    privacyDesc: "How we securely store, manage, and safeguard your personal details and receipts.",
    contactTitle: "Get in Touch / Community",
    contactDesc: "Reach our support team or connect with plant lovers on our official channels.",
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={`container ${styles.container}`}>
        
        {/* Top Grid: Left Banner & Right Story */}
        <div className={styles.topGrid}>
          
          {/* Left Column: Visual Story Card + Feature Card 1 */}
          <div className={styles.imageCol}>
            <div className={styles.storyCard}>
              <div className={styles.storyBadge}>{dict.aboutUs?.journeyBadge || '🌱 Our Journey'}</div>
              <h3 className={styles.storyCardTitle}>{dict.aboutUs?.journeyTitle || 'Bringing Nature into Modern Living'}</h3>
              <p className={styles.storyCardText}>
                {dict.aboutUs?.journeyText || 'Founded in Yerevan, Masis Garden grew from a passion for botanical aesthetics, air purification, and sustainable urban greenery for homes and offices.'}
              </p>
              <div className={styles.statsMiniGrid}>
                <div className={styles.miniStat}>
                  <span className={styles.miniVal}>{dict.aboutUs?.stat1Val || '5000+'}</span>
                  <span className={styles.miniLabel}>{dict.aboutUs?.stat1Label || 'Happy Homes'}</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniVal}>{dict.aboutUs?.stat2Val || '100%'}</span>
                  <span className={styles.miniLabel}>{dict.aboutUs?.stat2Label || 'Guaranteed Fresh'}</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniVal}>{dict.aboutUs?.stat3Val || '24/7'}</span>
                  <span className={styles.miniLabel}>{dict.aboutUs?.stat3Label || 'Plant Support'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Expanded Story Text + Feature Card 2 */}
          <div className={styles.contentCol}>
            <span className={styles.eyebrow}>📖 {dict.navigation.about}</span>
            <h2 className={styles.title}>{dict.aboutUs?.title || 'Our History & Mission'}</h2>
            
            <div className={styles.divider}></div>

            <p className={styles.description}>
              {dict.aboutUs?.description1 || 'At Masis Garden, we believe that bringing nature indoors enriches lives and transforms spaces. Based in the heart of Yerevan, Armenia, our mission is to provide premium quality indoor plants, handcrafted pots, and stunning moss art to our community.'}
            </p>
            <p className={styles.description}>
              {dict.aboutUs?.description2 || 'Whether you are a seasoned plant parent or just starting your green journey, we are here to support you with expert advice and carefully curated selections.'}
            </p>
            <p className={styles.description}>
              {dict.aboutUs?.description3 || 'Every plant in our collection is hand-inspected for optimal vitality, potted in nutrient-dense soil, and paired with custom artisanal pottery designed to bring living beauty into every room.'}
            </p>
          </div>

        </div>

        {/* 🌿 Modern 4-Card Pillar Grid (Botanic/Luxury Glass Theme) */}
        <div className={styles.pillarsGrid}>
          {/* Card 1: Care Services */}
          <Link href={`/${lang}/blog`} className={styles.pillarCard}>
            <div className={styles.pillarCardHeader}>
              <span className={styles.pillarCardIcon}>🌿</span>
              <span className={styles.pillarCardArrow}>↗</span>
            </div>
            <h4 className={styles.pillarCardTitle}>{sectionTranslations.careTitle}</h4>
            <p className={styles.pillarCardDesc}>{sectionTranslations.careDesc}</p>
          </Link>

          {/* Card 2: Bulk Import */}
          <Link href={`/${lang}/wholesale`} className={styles.pillarCard}>
            <div className={styles.pillarCardHeader}>
              <span className={styles.pillarCardIcon}>🏢</span>
              <span className={styles.pillarCardArrow}>↗</span>
            </div>
            <h4 className={styles.pillarCardTitle}>{sectionTranslations.wholesaleTitle}</h4>
            <p className={styles.pillarCardDesc}>{sectionTranslations.wholesaleDesc}</p>
          </Link>

          {/* Card 3: Privacy Policy */}
          <Link href={`/${lang}/privacy`} className={styles.pillarCard}>
            <div className={styles.pillarCardHeader}>
              <span className={styles.pillarCardIcon}>🔒</span>
              <span className={styles.pillarCardArrow}>↗</span>
            </div>
            <h4 className={styles.pillarCardTitle}>{sectionTranslations.privacyTitle}</h4>
            <p className={styles.pillarCardDesc}>{sectionTranslations.privacyDesc}</p>
          </Link>

          {/* Card 4: Get in Touch / Community */}
          <div className={`${styles.pillarCard} ${styles.contactCard}`}>
            <div className={styles.pillarCardHeader}>
              <span className={styles.pillarCardIcon}>💬</span>
              <span className={styles.pillarCardBadge}>24/7</span>
            </div>
            <h4 className={styles.pillarCardTitle}>{sectionTranslations.contactTitle}</h4>
            <p className={styles.pillarCardDesc} style={{ marginBottom: '14px' }}>{sectionTranslations.contactDesc}</p>
            
            {/* 6 Social icons layout */}
            <div className={styles.miniSocialGrid}>
              <a href="https://wa.me/37499062409" target="_blank" rel="noopener noreferrer" className={styles.miniSocialLink} title="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
              <a href="https://t.me/masisgarden" target="_blank" rel="noopener noreferrer" className={styles.miniSocialLink} title="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
              <a href="https://instagram.com/masis.garden" target="_blank" rel="noopener noreferrer" className={styles.miniSocialLink} title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://facebook.com/masisgarden" target="_blank" rel="noopener noreferrer" className={styles.miniSocialLink} title="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="mailto:masisgarden374@gmail.com" className={styles.miniSocialLink} title="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
              <a href="tel:+37499062409" className={styles.miniSocialLink} title="Phone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
