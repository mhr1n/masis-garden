import { i18n, type Locale } from '../../../i18n-config';
import { getDictionary } from '../../../get-dictionary';
import Link from 'next/link';
import styles from './blog.module.css';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div className={styles.splitLayout}>

      {/* Left: Poster Image */}
      <div className={styles.imageCol}>
        <img
          src="/images/care-clean.jpg"
          alt="Plant Care Service"
          className={styles.posterImg}
        />
      </div>

      {/* Right: Content */}
      <div className={styles.contentCol}>
        <div className={styles.contentInner}>

          <span className={styles.badge}>🌿 {dict.care?.careTips || 'Professional Plant Care'}</span>

          <h1 className={styles.title}>
            {lang === 'ru' ? 'Уход за растениями' : lang === 'am' ? 'Բույսերի Պրոֆ. Խնամք' : 'Professional Plant Care'}
          </h1>

          <p className={styles.subtitle}>
            {lang === 'ru'
              ? 'Мы берём на себя заботу о ваших растениях — в вашем офисе, ресторане или доме. Регулярный полив, обрезка, замена грунта и борьба с вредителями.'
              : lang === 'am'
              ? 'Մենք հոգ ենք տանում ձեր բույսերի մասին՝ ձեր գրասենյակում, ռեստորանում կամ տանը: Կանոնավոր ջրում, կտրտում, հողի փոխարինում և վնասատուների վերահսկում:'
              : 'We take care of your plants — in your office, restaurant, or home. Regular watering, trimming, soil replacement and pest control so you can focus on what matters.'}
          </p>

          <div className={styles.featureList}>

            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📅</span>
              <div>
                <h4 className={styles.featureTitle}>
                  {lang === 'ru' ? 'Регулярные визиты' : lang === 'am' ? 'Կանոնավոր այցելություններ' : 'Regular Scheduled Visits'}
                </h4>
                <p className={styles.featureText}>
                  {lang === 'ru' ? 'Еженедельно или по вашему плану — наши специалисты приедут и позаботятся о растениях.' : lang === 'am' ? 'Շաբաթական կամ ձեր ժամանակացույցի համաձայն' : 'Weekly or on your schedule — our specialists come to you and handle everything.'}
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>✂️</span>
              <div>
                <h4 className={styles.featureTitle}>
                  {lang === 'ru' ? 'Обрезка и уход' : lang === 'am' ? 'Կտրտում և խնամք' : 'Trimming & Grooming'}
                </h4>
                <p className={styles.featureText}>
                  {lang === 'ru' ? 'Поддерживаем красивую форму и здоровье ваших растений круглый год.' : lang === 'am' ? 'Ամբողջ տարի պահպանում ենք ձեր բույսերի գեղեցիկ ձևն ու առողջությունը' : 'We keep your plants healthy, shaped and beautiful throughout the year.'}
                </p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🪲</span>
              <div>
                <h4 className={styles.featureTitle}>
                  {lang === 'ru' ? 'Контроль вредителей' : lang === 'am' ? 'Վնասատուների հսկողություն' : 'Pest & Disease Control'}
                </h4>
                <p className={styles.featureText}>
                  {lang === 'ru' ? 'Выявляем и устраняем болезни и вредителей до того, как они нанесут вред.' : lang === 'am' ? 'Բացահայտում ու վերացնում ենք հիվանդությունները նախքան վնասը' : 'We detect and eliminate pests and diseases before they cause damage.'}
                </p>
              </div>
            </div>

          </div>

          {/* Who is it for */}
          <div className={styles.tagRow}>
            <span className={styles.tag}>🏨 {lang === 'ru' ? 'Отели' : lang === 'am' ? 'Հյուրանոցներ' : 'Hotels'}</span>
            <span className={styles.tag}>🍽️ {lang === 'ru' ? 'Рестораны' : lang === 'am' ? 'Ռեստորաններ' : 'Restaurants'}</span>
            <span className={styles.tag}>🏢 {lang === 'ru' ? 'Офисы' : lang === 'am' ? 'Գրասենյակ' : 'Offices'}</span>
            <span className={styles.tag}>🏠 {lang === 'ru' ? 'Дома' : lang === 'am' ? 'Տներ' : 'Homes'}</span>
          </div>

          <div className={styles.contactActions}>
            <a
              href="https://t.me/whmhran"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnTelegram}
            >
              {lang === 'ru' ? '📞 Связаться' : lang === 'am' ? '📞 Կապ հաստատել' : '📞 Contact Us'}
            </a>
            <a
              href="https://wa.me/37499062409"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWhatsapp}
            >
              WhatsApp
            </a>
          </div>

          <div className={styles.footerLink}>
            <Link href={`/${lang}`} className={styles.backBtn}>
              ← {lang === 'ru' ? 'Назад в магазин' : lang === 'am' ? 'Հետ դեպի խանութ' : 'Back to Store'}
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
