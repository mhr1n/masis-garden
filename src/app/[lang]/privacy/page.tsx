import { i18n, type Locale } from '../../../i18n-config';
import Link from 'next/link';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const translations = {
    en: {
      title: "Privacy Policy",
      intro: "Your privacy is important to us. This Privacy Policy explains how Masis Garden collects, uses, and safeguards your personal data.",
      sec1Title: "1. Information We Collect",
      sec1Text: "We collect information you provide directly to us when placing an order, including your name, phone number, shipping address, and payment confirmation details (receipt files).",
      sec2Title: "2. How We Use Your Information",
      sec2Text: "We use your details solely to process orders, manage deliveries, verify payments, and provide customer support.",
      sec3Title: "3. Data Security",
      sec3Text: "We implement secure systems to store your receipt files and order details. We do not sell or share your personal data with third-parties.",
      back: "Back to Home"
    },
    am: {
      title: "Գաղտնիության Քաղաքականություն",
      intro: "Ձեր գաղտնիությունը կարևոր է մեզ համար: Այս քաղաքականությունը բացատրում է, թե ինչպես է Masis Garden-ը հավաքում, օգտագործում և պաշտպանում ձեր անձնական տվյալները:",
      sec1Title: "1. Հավաքագրվող տեղեկատվությունը",
      sec1Text: "Մենք հավաքում ենք ձեր տրամադրած տեղեկությունները պատվեր կատարելիս, ներառյալ անունը, հեռախոսահամարը, առաքման հասցեն և վճարման հաստատման մանրամասները (կտրոնի ֆայլը):",
      sec2Title: "2. Տվյալների օգտագործումը",
      sec2Text: "Մենք օգտագործում ենք ձեր տվյալները բացառապես պատվերները մշակելու, առաքումը կազմակերպելու, վճարումները ստուգելու և հաճախորդների աջակցություն տրամադրելու համար:",
      sec3Title: "3. Տվյալների պաշտպանությունը",
      sec3Text: "Մենք ներդնում ենք անվտանգ համակարգեր ձեր կտրոնների և պատվերների տվյալները պահելու համար: Մենք չենք վաճառում կամ կիսում ձեր տվյալները երրորդ կողմերի հետ:",
      back: "Հետ դեպի Գլխավոր"
    },
    ru: {
      title: "Политика конфиденциальности",
      intro: "Ваша конфиденциальность важна для нас. Настоящая Политика объясняет, как Masis Garden собирает, использует и защищает ваши личные данные.",
      sec1Title: "1. Сбор информации",
      sec1Text: "Мы собираем данные, которые вы предоставляете при оформлении заказа, включая имя, номер телефона, адрес доставки и подтверждение оплаты (файлы чеков).",
      sec2Title: "2. Использование информации",
      sec2Text: "Мы используем ваши данные исключительно для обработки заказов, организации доставки, подтверждения оплаты и поддержки клиентов.",
      sec3Title: "3. Безопасность данных",
      sec3Text: "Мы применяем надежные системы защиты для хранения ваших чеков и деталей заказов. Мы не продаем и не передаем ваши данные третьим лицам.",
      back: "На главную"
    }
  };

  const content = translations[lang as 'en' | 'am' | 'ru'] || translations.en;

  return (
    <div style={{
      maxWidth: '800px',
      margin: '60px auto',
      padding: '0 24px',
      fontFamily: 'var(--font-outfit), sans-serif',
      color: 'var(--color-text)',
      lineHeight: '1.7'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>{content.title}</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '40px' }}>{content.intro}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '48px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{content.sec1Title}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{content.sec1Text}</p>
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{content.sec2Title}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{content.sec2Text}</p>
        </div>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>{content.sec3Title}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{content.sec3Text}</p>
        </div>
      </div>

      <Link href={`/${lang}`} style={{
        display: 'inline-block',
        color: 'var(--color-primary)',
        textDecoration: 'none',
        fontWeight: 600,
        borderBottom: '2px solid var(--color-primary)',
        paddingBottom: '2px'
      }}>
        {content.back}
      </Link>
    </div>
  );
}
