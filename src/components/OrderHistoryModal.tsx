'use client';

import { useState, useEffect } from 'react';
import { useOrders, Order, OrderStatus } from '../context/OrdersContext';
import styles from './OrderHistoryModal.module.css';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export default function OrderHistoryModal({ isOpen, onClose, lang = 'en' }: OrderHistoryModalProps) {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [matchingOrders, setMatchingOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  // Auto-fill phone/email from localStorage if available
  useEffect(() => {
    if (isOpen) {
      try {
        const savedPhone = localStorage.getItem('ariel_customer_phone') || '';
        const savedEmail = localStorage.getItem('ariel_customer_email') || '';
        const defaultSearch = savedPhone || savedEmail;
        if (defaultSearch) {
          setSearchTerm(defaultSearch);
          findOrders(defaultSearch);
        }
      } catch {}
    }
  }, [isOpen, orders]);

  const findOrders = (query: string) => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setMatchingOrders([]);
      setSearched(false);
      return;
    }

    const matches = orders.filter((o) => {
      const email = o.customerInfo?.email?.toLowerCase().trim() || '';
      const phone = o.customerInfo?.phone?.replace(/\D/g, '') || '';
      const cleanDigits = clean.replace(/\D/g, '');
      const orderId = o.id.toLowerCase();

      return (
        (clean.includes('@') && email === clean) ||
        (cleanDigits.length >= 6 && phone.includes(cleanDigits)) ||
        orderId.includes(clean)
      );
    });

    setMatchingOrders(matches);
    setSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findOrders(searchTerm);
  };

  const getStepActive = (status: OrderStatus, step: number) => {
    if (status === 'cancelled') return false;
    if (status === 'pending') return step <= 1;
    if (status === 'processing') return step <= 2;
    if (status === 'delivered') return step <= 3;
    return false;
  };

  const texts = {
    en: {
      title: '📦 My Orders & Tracking',
      subtitle: 'Enter your phone number or email to view past orders and live delivery status',
      placeholder: 'Enter phone number or email...',
      searchBtn: 'Find Orders',
      noOrders: 'No orders found for this contact. Make sure it matches the details entered during checkout.',
      items: 'Ordered Items',
      total: 'Total',
      placed: 'Placed',
      preparing: 'Preparing',
      delivered: 'Delivered',
      cancelled: 'Order Cancelled',
      orderId: 'Order',
    },
    am: {
      title: '📦 Իմ Պատվերները',
      subtitle: 'Մուտքագրեք Ձեր հեռախոսահամարը կամ էլ․ փոստը՝ պատվերների կարգավիճակը տեսնելու համար',
      placeholder: 'Հեռախոսահամար կամ էլ․ փոստ...',
      searchBtn: 'Գտնել',
      noOrders: 'Այս տվյալներով պատվերներ չեն գտնվել։',
      items: 'Պատվիրված ապրանքներ',
      total: 'Ընդհանուր',
      placed: 'Ընդունված',
      preparing: 'Պատրաստվում է',
      delivered: 'Առաքված',
      cancelled: 'Չեղարկված',
      orderId: 'Պատվեր',
    },
    ru: {
      title: '📦 Мои Заказы и Статус',
      subtitle: 'Введите ваш номер телефона или email, чтобы посмотреть историю заказов и статус доставки',
      placeholder: 'Номер телефона или email...',
      searchBtn: 'Найти заказы',
      noOrders: 'Заказы по данным контактам не найдены.',
      items: 'Товары в заказе',
      total: 'Итого',
      placed: 'Принят',
      preparing: 'Готовится',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
      orderId: 'Заказ',
    },
  }[lang as 'en' | 'am' | 'ru'] || {
    title: '📦 My Orders & Tracking',
    subtitle: 'Enter your phone number or email to view past orders and live delivery status',
    placeholder: 'Enter phone number or email...',
    searchBtn: 'Find Orders',
    noOrders: 'No orders found for this contact.',
    items: 'Ordered Items',
    total: 'Total',
    placed: 'Placed',
    preparing: 'Preparing',
    delivered: 'Delivered',
    cancelled: 'Order Cancelled',
    orderId: 'Order',
  };

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2>{texts.title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          
          {/* Search Form */}
          <div className={styles.searchBox}>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#9aaa90', lineHeight: 1.5 }}>
              {texts.subtitle}
            </p>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={texts.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.searchBtn}>
                🔍 {texts.searchBtn}
              </button>
            </form>
          </div>

          {/* Orders List */}
          {searched && matchingOrders.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: '#6a7a65', background: '#111710', borderRadius: '16px', border: '1px solid #233122' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{texts.noOrders}</p>
            </div>
          ) : (
            matchingOrders.map((ord) => (
              <div key={ord.id} className={styles.orderCard}>
                
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>{texts.orderId} #{ord.id.slice(4, 14)}</span>
                    <div className={styles.orderDate}>
                      📅 {new Date(ord.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    {ord.status === 'delivered' ? (
                      <span style={{ background: '#1a3a24', color: '#6abc80', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        ✔ {texts.delivered}
                      </span>
                    ) : ord.status === 'processing' ? (
                      <span style={{ background: '#1a2c3a', color: '#6a9fbc', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        ⏳ {texts.preparing}
                      </span>
                    ) : ord.status === 'cancelled' ? (
                      <span style={{ background: '#3a1a1a', color: '#bc6a6a', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        ✖ {texts.cancelled}
                      </span>
                    ) : (
                      <span style={{ background: '#3a2a18', color: '#d8a05b', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                        🕒 {texts.placed}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tracking Stepper (if not cancelled) */}
                {ord.status !== 'cancelled' && (
                  <div className={styles.stepper}>
                    <div className={`${styles.step} ${getStepActive(ord.status, 1) ? styles.stepActive : ''}`}>
                      <div className={styles.stepIcon}>1</div>
                      <span className={styles.stepLabel}>{texts.placed}</span>
                    </div>
                    <div className={`${styles.step} ${getStepActive(ord.status, 2) ? styles.stepActive : ''}`}>
                      <div className={styles.stepIcon}>2</div>
                      <span className={styles.stepLabel}>{texts.preparing}</span>
                    </div>
                    <div className={`${styles.step} ${getStepActive(ord.status, 3) ? styles.stepActive : ''}`}>
                      <div className={styles.stepIcon}>3</div>
                      <span className={styles.stepLabel}>{texts.delivered}</span>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className={styles.itemsList}>
                  <div style={{ fontSize: '0.74rem', color: '#6a7a65', fontWeight: 700, textTransform: 'uppercase' }}>
                    {texts.items}:
                  </div>
                  {ord.items && ord.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <span>🪴 {item.name}</span>
                      <strong style={{ color: '#8fbc6a' }}>{item.price?.toLocaleString()} ֏</strong>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className={styles.orderFooter}>
                  <span style={{ color: '#9aaa90' }}>
                    {ord.customerInfo?.city || 'Yerevan'}, {ord.customerInfo?.address}
                  </span>
                  <div>
                    <span style={{ color: '#9aaa90', fontSize: '0.8rem', marginRight: '6px' }}>{texts.total}:</span>
                    <span className={styles.totalVal}>{ord.total?.toLocaleString()} ֏</span>
                  </div>
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}
