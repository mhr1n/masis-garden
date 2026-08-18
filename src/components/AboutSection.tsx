'use client';

import Link from 'next/link';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  dict: any;
  lang?: string;
}

export default function AboutSection({ dict, lang = 'en' }: AboutSectionProps) {
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

            {/* Clickable Feature Card 1 (Wholesale & B2B Orders) */}
            <Link href={`/${lang}/wholesale`} className={`${styles.stretchedCard} ${styles.clickableCard}`}>
              <span className={styles.pillarIcon}>🌱</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <strong>{dict.aboutUs?.b2bTitle || 'Botanical Mastery & Bulk Supply'}</strong>
                  <span className={styles.b2bBadge}>{dict.aboutUs?.b2bBadge || '🤝 B2B & Wholesale ↗'}</span>
                </div>
                <p>{dict.aboutUs?.b2bText || 'Bulk plant supply & direct imports from Iran to Armenia for shops, online stores & gardens.'}</p>
              </div>
            </Link>
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

            {/* Stretched Feature Card 2 — clickable link to Blog */}
            <Link href={`/${lang}/blog`} className={`${styles.stretchedCard} ${styles.clickableCard}`}>
              <span className={styles.pillarIcon}>📖</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <strong>{dict.aboutUs?.mossTitle || 'Plant Care Guide'}</strong>
                  <span className={styles.b2bBadge}>{dict.aboutUs?.blogBadge || '📚 Read Articles ↗'}</span>
                </div>
                <p>{dict.aboutUs?.mossText || 'Expert care tips, species guides & decoration ideas from our botanical team.'}</p>
              </div>
            </Link>
          </div>

        </div>

        {/* Bottom Full-Width Glassmorphic Social Community Section */}
        <div className={styles.glassSocialBox}>
          <div className={styles.socialHeader}>
            <div className={styles.communityTag}>{dict.aboutUs?.communityTag || '✨ Community Hub'}</div>
            <h4 className={styles.socialTitle}>{dict.aboutUs?.socialTitle || 'Join Our Botanical Community'}</h4>
            <p className={styles.socialSubtitle}>{dict.aboutUs?.socialSubtitle || 'Connect with plant lovers across Yerevan on our official social channels'}</p>
          </div>

          <div className={styles.socialLinks}>
            {/* Telegram */}
            <a href="https://t.me/masisgarden" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={`${styles.socialLink} ${styles.telegramLink}`}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M21.9 3.1L1.1 11.1a.5.5 0 000 .9l5.8 2.3 2.3 6.7a.5.5 0 00.9.1l3-3.6 5.8 2.2a.5.5 0 00.6-.4L22.5 3.6a.5.5 0 00-.6-.5z"/>
                </svg>
              </div>
              <span>Telegram</span>
              <span className={styles.arrowIcon}>→</span>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/masis.garden" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${styles.socialLink} ${styles.instagramLink}`}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <span>Instagram</span>
              <span className={styles.arrowIcon}>→</span>
            </a>

            {/* Facebook */}
            <a href="https://facebook.com/masisgarden" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${styles.socialLink} ${styles.facebookLink}`}>
              <div className={styles.iconWrapper}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </div>
              <span>Facebook</span>
              <span className={styles.arrowIcon}>→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
