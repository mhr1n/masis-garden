import { i18n, type Locale } from '../../../i18n-config';
import Link from 'next/link';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const translations = {
    en: {
      title: "Privacy & Data Policy",
      subtitle: "How we care for your personal details at Masis Garden",
      intro: "We value the trust you place in us. This policy outlines how we handle and protect your information when you shop with us or use our plant care services.",
      cards: [
        {
          icon: "👤",
          title: "What We Collect",
          text: "Your name, phone number, delivery address, and payment confirmation screenshots (receipt files) that you upload."
        },
        {
          icon: "⚙️",
          title: "How We Use It",
          text: "To process your purchases, dispatch deliveries within Armenia, verify manual receipt transfers, and provide support."
        },
        {
          icon: "🛡️",
          title: "Strict Protection",
          text: "All uploaded payment slips and customer files are stored in secure Supabase storage. We never share or sell data."
        },
        {
          icon: "🍪",
          title: "Local Storage",
          text: "We use lightweight local storage only to remember your cart items and preferred language settings."
        },
        {
          icon: "📜",
          title: "Your Rights",
          text: "You can request to delete or edit your order history and personal contact details at any point by contacting us."
        },
        {
          icon: "📞",
          title: "Inquiries",
          text: "Have questions about your data? Reach out directly via WhatsApp, Telegram, or email. We respond within 24 hours."
        }
      ],
      back: "Return to Store"
    },
    am: {
      title: "Գաղտնիության Քաղաքականություն",
      subtitle: "Ինչպես ենք մենք պահպանում ձեր անձնական տվյալները Masis Garden-ում",
      intro: "Մենք գնահատում ենք ձեր վստահությունը: Այս քաղաքականությունը նկարագրում է, թե ինչպես ենք մենք օգտագործում և պաշտպանում ձեր տվյալները մեր խանութից օգտվելիս:",
      cards: [
        {
          icon: "👤",
          title: "Ինչ ենք հավաքում",
          text: "Ձեր անունը, հեռախոսահամարը, առաքման հասցեն և ձեր կողմից վերբեռնված վճարման կտրոնների ֆայլերը:"
        },
        {
          icon: "⚙️",
          title: "Ինչպես ենք օգտագործում",
          text: "Պատվերները ձևակերպելու, Հայաստանի տարածքում առաքում իրականացնելու և աջակցություն ցուցաբերելու համար:"
        },
        {
          icon: "🛡️",
          title: "Անվտանգություն",
          text: "Բոլոր կտրոնները և պատվերները պահվում են անվտանգ Supabase սերվերներում: Տվյալները երրորդ կողմին չեն փոխանցվում:"
        },
        {
          icon: "🍪",
          title: "Տեղային պահոց",
          text: "Մենք օգտագործում ենք տեղային պահոցը (local storage) միայն ձեր զամբյուղը և լեզվի նախընտրությունը հիշելու համար:"
        },
        {
          icon: "📜",
          title: "Ձեր իրավունքները",
          text: "Դուք ցանկացած պահի կարող եք խնդրել ջնջել կամ փոփոխել ձեր պատվերների պատմությունը կամ կոնտակտային տվյալները:"
        },
        {
          icon: "📞",
          title: "Հարցումներ",
          text: "Տվյալների վերաբերյալ հարցերի դեպքում կապվեք մեզ հետ WhatsApp-ի, Telegram-ի կամ էլ. փոստի միջոցով:"
        }
      ],
      back: "Հետ դեպի Խանութ"
    },
    ru: {
      title: "Политика конфиденциальности",
      subtitle: "Как мы заботимся о ваших данных в Masis Garden",
      intro: "Мы ценим ваше доверие. Эта политика описывает, как мы собираем, используем и защищаем вашу информацию при совершении покупок или заказе услуг.",
      cards: [
        {
          icon: "👤",
          title: "Что мы собираем",
          text: "Ваше имя, номер телефона, адрес доставки и загруженные файлы подтверждения оплаты (скриншоты чеков)."
        },
        {
          icon: "⚙️",
          title: "Как это используется",
          text: "Для обработки ваших заказов, доставки по Армении, верификации ручных переводов и поддержки клиентов."
        },
        {
          icon: "🛡️",
          title: "Строгая защита",
          text: "Все платежные чеки и файлы надежно хранятся в защищенном облаке Supabase. Мы не передаем данные третьим лицам."
        },
        {
          icon: "🍪",
          title: "Локальное хранилище",
          text: "Мы используем local storage только для сохранения товаров в вашей корзине и настроек выбранного языка."
        },
        {
          icon: "📜",
          title: "Ваши права",
          text: "Вы можете в любой момент запросить удаление или изменение вашей истории заказов и контактных данных."
        },
        {
          icon: "📞",
          title: "Вопросы и связь",
          text: "Есть вопросы по поводу данных? Напишите нам в WhatsApp, Telegram или на почту. Мы ответим в течение 24 часов."
        }
      ],
      back: "Вернуться в магазин"
    }
  };

  const content = translations[lang as 'en' | 'am' | 'ru'] || translations.en;

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '60px auto 100px auto',
      padding: '0 24px',
      fontFamily: 'var(--font-outfit), sans-serif',
      color: 'var(--color-text)',
      lineHeight: '1.6'
    }}>
      {/* Header section with botanical vibe */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ fontSize: '3rem' }}>🌿</span>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '12px 0 6px 0', letterSpacing: '-0.5px' }}>
          {content.title}
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-primary)', fontWeight: 500, margin: 0 }}>
          {content.subtitle}
        </p>
        <p style={{ maxWidth: '680px', margin: '24px auto 0 auto', fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
          {content.intro}
        </p>
      </div>

      {/* Grid of Minimal Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '50px'
      }}>
        {content.cards.map((card, idx) => (
          <div key={idx} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem'
            }}>
              {card.icon}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: '4px 0 0 0' }}>
              {card.title}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
              {card.text}
            </p>
          </div>
        ))}
      </div>

      {/* Back button container */}
      <div style={{ textAlign: 'center' }}>
        <Link href={`/${lang}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-primary)',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          borderRadius: '30px',
          fontSize: '0.98rem',
          transition: 'background 0.2s, transform 0.2s',
          boxShadow: 'var(--shadow-sm)'
        }}>
          ← {content.back}
        </Link>
      </div>
    </div>
  );
}
