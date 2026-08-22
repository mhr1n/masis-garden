'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ dict }: { dict: any }) {
  const { isCartOpen, setIsCartOpen, items, removeFromCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, setIsCartOpen]);

  const total = items.reduce((sum, item) => {
    const orig = item.originalPrice ?? 0;
    const cur = item.price;
    const hasDiscount = orig > 0 && orig !== cur;
    const effectivePrice = hasDiscount ? Math.min(orig, cur) : cur;
    return sum + effectivePrice;
  }, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setTimeout(() => setIsCheckoutOpen(true), 300);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}
        ref={drawerRef}
      >
        <div className={styles.header}>
          <h2>{dict.common.cart} ({items.length})</h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            &times;
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>{dict.common.emptyCart}</p>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.cartId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    {(() => {
                      const orig = item.originalPrice ?? 0;
                      const cur = item.price;
                      const hasDiscount = orig > 0 && orig !== cur;
                      const displayCurrent = hasDiscount ? Math.min(orig, cur) : cur;
                      const displayOriginal = hasDiscount ? Math.max(orig, cur) : 0;
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <p className={styles.price}>{displayCurrent.toLocaleString()} ֏</p>
                          {hasDiscount && (
                            <span style={{ fontSize: '0.78rem', color: '#aaa', textDecoration: 'line-through' }}>
                              {displayOriginal.toLocaleString()} ֏
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    {(item.selectedSize || item.selectedColor) && (
                      <p className={styles.options}>
                        {item.selectedSize}
                        {item.selectedSize && item.selectedColor && ' | '}
                        {item.selectedColor}
                      </p>
                    )}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.cartId)}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>{dict.common.total}:</span>
              <span>{total.toLocaleString()} ֏</span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '15px' }}
              onClick={handleCheckout}
            >
              {dict.common.checkout} →
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        dict={dict}
      />
    </>
  );
}
