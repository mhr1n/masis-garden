'use client';

import { useState } from 'react';
import styles from './ProductCard.module.css';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';

import { useParams } from 'next/navigation';

const TAG_STYLES: Record<string, string> = {
  best_seller: styles.tagGold,
  new_arrival: styles.tagBlue,
  popular:     styles.tagGreen,
  top_rated:   styles.tagGold,
  low_maintenance: styles.tagGreen,
  pet_friendly: styles.tagGreen,
  air_purifying: styles.tagGreen,
  low_water:   styles.tagBlue,
  bright_light: styles.tagOrange,
  beginner_friendly: styles.tagGreen,
};

const TAG_EMOJI: Record<string, string> = {
  best_seller: '🌿',
  new_arrival: '🆕',
  popular: '🔥',
  top_rated: '⭐',
  low_maintenance: '💚',
  pet_friendly: '🐱',
  air_purifying: '🍃',
  low_water: '💧',
  bright_light: '☀',
  beginner_friendly: '🌱',
};

const LIGHT_LABEL: Record<string, string> = {
  full_sun: '☀ Full Sun',
  bright_indirect: '⛅ Bright Indirect',
  partial_shade: '🌤 Partial Shade',
  low_light: '🌑 Low Light',
};

interface ProductCardProps {
  product: Product;
  dictionary: any;
  lang?: string;
}

export default function ProductCard({ product, dictionary, lang }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const params = useParams();
  const currentLang = lang || (params?.lang as string) || 'en';

  const localizedName = currentLang === 'ru' && product.nameRu ? product.nameRu 
                      : currentLang === 'am' && (product.nameAm || product.armenianName) ? (product.nameAm || product.armenianName) 
                      : product.name;

  const primaryTag = product.tags?.[0];

  const isOutOfStock = product.inStock === false;

  const origPrice = product.originalPrice ?? 0;
  const curPrice = product.price;
  const hasDiscount = Boolean(origPrice > 0 && origPrice !== curPrice);
  const displayOriginal = hasDiscount ? Math.max(origPrice, curPrice) : 0;
  const displayCurrent = hasDiscount ? Math.min(origPrice, curPrice) : curPrice;
  const discountPercent = hasDiscount
    ? Math.round(((displayOriginal - displayCurrent) / displayOriginal) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const itemToAdd = hasDiscount ? { ...product, price: displayCurrent } : product;
    addToCart(itemToAdd, product.sizes?.[0], product.colors?.[0]);
  };

  const [imgError, setImgError] = useState(false);
  const coverImage = product.images?.find((img) => Boolean(img && typeof img === 'string' && img.trim().length > 0));
  const showImage = coverImage && !imgError;

  return (
    <>
      <article className={styles.card} onClick={() => setIsModalOpen(true)}>
        {/* Image */}
        <div className={`${styles.imageWrapper} ${isOutOfStock ? styles.outOfStockImage : ''}`}>
          {showImage ? (
            <img
              src={coverImage}
              alt={product.name}
              className={styles.productImg}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span style={{ fontSize: '2.5rem', opacity: 0.7 }}>🍍</span>
            </div>
          )}

          {/* Floating Badges */}
          {hasDiscount && !isOutOfStock && (
            <span className={styles.discountBadge}>
              🔥 -{discountPercent}%
            </span>
          )}

          {primaryTag && !hasDiscount && !isOutOfStock && (
            <span className={`${styles.tag} ${TAG_STYLES[primaryTag] ?? styles.tagGreen}`}>
              {TAG_EMOJI[primaryTag]} {dictionary.tags?.[primaryTag]}
            </span>
          )}

          {isOutOfStock && (
            <div className={styles.outOfStockBadge}>Out of Stock</div>
          )}

          {/* Pet Friendly badge */}
          {product.isPetFriendly && !isOutOfStock && (
            <span className={styles.petBadge} title={dictionary.care?.petFriendly}>🐱</span>
          )}

          {/* Quick Add */}
          {!isOutOfStock && (
            <button className={styles.quickAdd} onClick={handleQuickAdd} aria-label={dictionary.common.addToCart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {product.botanicalName && (
            <p className={styles.botanical}>{product.botanicalName}</p>
          )}
          <h3 className={styles.name}>{localizedName}</h3>

          {/* Meta row */}
          <div className={styles.meta}>
              {product.lightRequirement && (
                <span className={styles.metaItem}>
                  {(() => {
                    const icon = LIGHT_LABEL[product.lightRequirement]?.split(' ')[0] || '☀️';
                    const localized = dictionary.care?.[`light_${product.lightRequirement}`];
                    return localized ? `${icon} ${localized}` : LIGHT_LABEL[product.lightRequirement];
                  })()}
                </span>
              )}
            {product.difficulty && (
              <span className={styles.metaItem}>
                {dictionary.care?.[`difficulty_${product.difficulty}`]}
              </span>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.priceGroup}>
              <p className={styles.price}>{displayCurrent.toLocaleString()} ֏</p>
              {hasDiscount && (
                <span className={styles.originalPrice}>{displayOriginal.toLocaleString()} ֏</span>
              )}
            </div>
            {product.height && <p className={styles.height}>{product.height}</p>}
          </div>
        </div>
      </article>

      {isModalOpen && (
        <ProductModal
          product={product}
          dictionary={dictionary}
          lang={currentLang}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
