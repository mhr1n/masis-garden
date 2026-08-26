'use client';

import { useState, useEffect } from 'react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import styles from './ProductModal.module.css';
import { useParams } from 'next/navigation';

const LIGHT_MAP: Record<string, { icon: string; label: string }> = {
  full_sun:        { icon: '☀', label: 'Full Sun' },
  bright_indirect: { icon: '⛅', label: 'Bright Indirect' },
  partial_shade:   { icon: '🌤', label: 'Partial Shade' },
  low_light:       { icon: '🌑', label: 'Low Light' },
};

interface Props {
  product: Product;
  dictionary: any;
  onClose: () => void;
}

export default function ProductModal({ product, dictionary, onClose }: Props) {
  const { addToCart, setIsCartOpen } = useCart();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';

  const localizedName = lang === 'ru' && product.nameRu ? product.nameRu 
                      : lang === 'am' && product.nameAm ? product.nameAm 
                      : product.name;
  
  const localizedDescription = lang === 'ru' && product.descriptionRu ? product.descriptionRu 
                             : lang === 'am' && product.descriptionAm ? product.descriptionAm 
                             : product.description;

  const localizedWatering = lang === 'ru' && product.wateringRu ? product.wateringRu 
                          : lang === 'am' && product.wateringAm ? product.wateringAm 
                          : product.watering;

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [added, setAdded] = useState(false);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // lock scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAdd = () => {
    const origPrice = product.originalPrice ?? 0;
    const curPrice = product.price;
    const hasDiscount = Boolean(origPrice > 0 && origPrice !== curPrice);
    const displayCurrent = hasDiscount ? Math.min(origPrice, curPrice) : curPrice;
    
    const itemToAdd = hasDiscount ? { ...product, price: displayCurrent } : product;
    addToCart(itemToAdd, selectedSize || undefined, selectedColor || undefined);
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 900);
  };

  const light = product.lightRequirement ? LIGHT_MAP[product.lightRequirement] : null;

  const dict = dictionary;

  const images = product.images || [];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className={styles.grid}>
          {/* ── Left: Image Gallery ── */}
          <div className={styles.imageCol}>
            <div className={styles.mainImageArea}>
              {images[currentImageIdx] ? (
                <img 
                  src={images[currentImageIdx]} 
                  alt={localizedName} 
                  className={styles.mainImg}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.imageLabel}>Image {currentImageIdx + 1}</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    className={`${styles.navBtn} ${styles.prevBtn}`}
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button
                    className={`${styles.navBtn} ${styles.nextBtn}`}
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className={styles.thumbnailList}>
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`${styles.thumbnailBtn} ${idx === currentImageIdx ? styles.thumbnailActive : ''}`}
                    onClick={() => setCurrentImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}

            {/* Shipping badges */}
            <div className={styles.shippingBadges}>
              <span>🚚 {dict.shipping?.free}</span>
              <span>📦 {dict.shipping?.secure}</span>
              <span>⏱ {dict.shipping?.delivery}</span>
            </div>
          </div>

          {/* ── Right: Info ── */}
          <div className={styles.infoCol}>
            {/* Names */}
            {product.botanicalName && (
              <p className={styles.botanical}><em>{product.botanicalName}</em></p>
            )}
            {product.armenianName && (
              <p className={styles.armenian}>{product.armenianName}</p>
            )}
            <h2 className={styles.name}>{localizedName}</h2>
            {(() => {
              const origPrice = product.originalPrice ?? 0;
              const curPrice = product.price;
              const hasDiscount = Boolean(origPrice > 0 && origPrice !== curPrice);
              const displayCurrent = hasDiscount ? Math.min(origPrice, curPrice) : curPrice;
              const displayOriginal = hasDiscount ? Math.max(origPrice, curPrice) : 0;
              const discountPercent = hasDiscount ? Math.round(((displayOriginal - displayCurrent) / displayOriginal) * 100) : 0;
              
              return (
                <div className={styles.priceRow}>
                  <span className={styles.price}>{displayCurrent.toLocaleString()} ֏</span>
                  {hasDiscount && (
                    <>
                      <span className={styles.originalPrice}>{displayOriginal.toLocaleString()} ֏</span>
                      <span className={styles.discountBadge}>-{discountPercent}% OFF</span>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className={styles.tagRow}>
                {product.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.modalTag}>
                    {dict.tags?.[tag]}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className={styles.description}>{localizedDescription}</p>

            {/* ── Care Icons Grid ── */}
            {(product.lightRequirement || product.watering || product.temperature || product.humidity || product.difficulty) && (
              <div className={styles.careGrid}>
                {light && (
                  <div className={styles.careCard}>
                    <span className={styles.careIcon}>{light.icon}</span>
                    <p className={styles.careKey}>{dict.care?.light}</p>
                    <p className={styles.careVal}>{dict.care?.[`light_${product.lightRequirement}`]}</p>
                  </div>
                )}
                {product.watering && (
                  <div className={styles.careCard}>
                    <span className={styles.careIcon}>💧</span>
                    <p className={styles.careKey}>{dict.care?.watering}</p>
                    <p className={styles.careVal}>{localizedWatering}</p>
                  </div>
                )}
                {product.temperature && (
                  <div className={styles.careCard}>
                    <span className={styles.careIcon}>🌡</span>
                    <p className={styles.careKey}>{dict.care?.temperature}</p>
                    <p className={styles.careVal}>{product.temperature}</p>
                  </div>
                )}
                {product.humidity && (
                  <div className={styles.careCard}>
                    <span className={styles.careIcon}>💦</span>
                    <p className={styles.careKey}>{dict.care?.humidity}</p>
                    <p className={styles.careVal}>{dict.care?.[`humidity_${product.humidity}`]}</p>
                  </div>
                )}
                {product.difficulty && (
                  <div className={styles.careCard}>
                    <span className={styles.careIcon}>🌱</span>
                    <p className={styles.careKey}>{dict.care?.difficulty}</p>
                    <p className={styles.careVal}>{dict.care?.[`difficulty_${product.difficulty}`]}</p>
                  </div>
                )}
                {product.growthSpeed && (
                  <div className={styles.careCard}>
                    <span className={styles.careIcon}>📈</span>
                    <p className={styles.careKey}>{dict.care?.growthSpeed}</p>
                    <p className={styles.careVal}>{dict.care?.[`growth_${product.growthSpeed}`]}</p>
                  </div>
                )}
              </div>
            )}

            {/* Specs Row */}
            <div className={styles.specs}>
              {product.height && (
                <div className={styles.spec}>
                  <span>{dict.care?.height}</span>
                  <strong>{product.height}</strong>
                </div>
              )}
              {product.potDiameter && (
                <div className={styles.spec}>
                  <span>{dict.care?.potDiameter}</span>
                  <strong>{product.potDiameter}</strong>
                </div>
              )}
              {product.matureSize && (
                <div className={styles.spec}>
                  <span>{dict.care?.matureSize}</span>
                  <strong>{product.matureSize}</strong>
                </div>
              )}
              <div className={styles.spec}>
                <span>{dict.care?.petFriendly}</span>
                <strong>{product.isPetFriendly ? '✅ ' + dict.care?.petFriendly : '❌ ' + dict.care?.notPetFriendly}</strong>
              </div>
              <div className={styles.spec}>
                <span>{dict.care?.airPurifying}</span>
                <strong>{product.isAirPurifying ? '🍃 Yes' : '—'}</strong>
              </div>
            </div>

            {/* Size selector */}
            {product.sizes && (
              <div className={styles.optionGroup}>
                <label>{dict.common.size}</label>
                <div className={styles.optionPills}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`${styles.optionPill} ${selectedSize === s ? styles.optionPillActive : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors && (
              <div className={styles.optionGroup}>
                <label>{dict.common.color}</label>
                <div className={styles.optionPills}>
                  {product.colors.map(c => (
                    <button
                      key={c}
                      className={`${styles.optionPill} ${selectedColor === c ? styles.optionPillActive : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              className={`btn-primary ${styles.addBtn} ${added ? styles.addBtnSuccess : ''}`}
              onClick={handleAdd}
              disabled={added}
            >
              {added ? '✓ Added to Cart!' : dict.common.addToCart}
            </button>

            {/* Care Tips */}
            {product.careTips && product.careTips.length > 0 && (
              <div className={styles.careTips}>
                <h4>{dict.care?.careTips}</h4>
                <ul>
                  {product.careTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className={styles.features}>
                {product.features.map((f, i) => (
                  <span key={i} className={styles.feature}>✅ {f}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
