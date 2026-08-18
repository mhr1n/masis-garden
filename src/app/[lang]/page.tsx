import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import CatalogClient from "../../components/CatalogClient";
import AboutSection from "../../components/AboutSection";
import Image from "next/image";
import { Suspense } from "react";
import heroBg from "../../../public/hero-bg.png";
import shopBannerBg from "../../../public/shop-banner-bg.jpg";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        {/* Background Image via next/image (reliable loading) */}
        <Image
          src={heroBg}
          alt="Masis Garden - Premium Apartment Plants"
          fill
          priority
          unoptimized={true}
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div className="hero-content">
          <span className="hero-eyebrow">🌿 {dict.hero.eyebrow}</span>
          <h1>
            {dict.hero.title}{" "}
            <em>{dict.hero.titleEm}</em>
          </h1>
          <p>{dict.hero.subtitle}</p>
          <div className="hero-actions">
            <a href="#catalog" className="btn-primary">{dict.hero.cta}</a>
            <a href="#about" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.6)', color: 'white' }}>
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* ── Slim Luxury Shop Banner ── */}
      <section id="catalog" className="section-padded container">

        {/* ── Slim Glass Shop Banner ── */}
        <div className="shop-slim-banner">
          <Image
            src={shopBannerBg}
            alt="Masis Garden Plants Shop Banner"
            fill
            priority
            unoptimized={true}
            style={{ objectFit: 'cover', objectPosition: 'center 45%', zIndex: 0 }}
          />
          <div className="shop-slim-overlay" />

          <div className="shop-slim-content">
            <div className="shop-slim-main">
              <div className="shop-slim-badge">
                <span className="shop-slim-dot" />
                <span>{dict.navigation.shop}</span>
              </div>
              <h2 className="shop-slim-title">
                {lang === 'am' ? (
                  <>Կանաչ Շունչ <span>Ձեր Տան Համար</span></>
                ) : lang === 'ru' ? (
                  <>Зелёное Дыхание <span>Для Вашего Дома</span></>
                ) : (
                  <>Green Life <span>For Your Home</span></>
                )}
              </h2>
              <p className="shop-slim-quote">
                {lang === 'am'
                  ? '🌱 Յուրաքանչյուր տերև՝ սիրով ու խնամքով'
                  : lang === 'ru'
                  ? '🌱 Каждый лист наполнен любовью и заботой'
                  : '🌱 Every leaf grown with care & warmth'}
              </p>
            </div>

            {/* Inline Feature Stats */}
            <div className="shop-slim-features">
              <div className="shop-slim-chip">
                <span className="chip-icon">🪴</span>
                <span className="chip-text">100+ {lang === 'am' ? 'Բույս' : lang === 'ru' ? 'Видов' : 'Varieties'}</span>
              </div>
              <div className="shop-slim-chip">
                <span className="chip-icon">🚚</span>
                <span className="chip-text">{lang === 'am' ? 'Անվճար առաքում' : lang === 'ru' ? 'Бесплатная доставка' : 'Free Express Delivery'}</span>
              </div>
              <div className="shop-slim-chip">
                <span className="chip-icon">✨</span>
                <span className="chip-text">100% {lang === 'am' ? 'Թարմ' : lang === 'ru' ? 'Свежие' : 'Fresh Guaranteed'}</span>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>}>
          <CatalogClient dict={dict} />
        </Suspense>
      </section>

      {/* ── About Us ── */}
      <AboutSection dict={dict} lang={lang} />
    </div>
  );
}
