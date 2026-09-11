'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders, PaymentMethod } from '../context/OrdersContext';
import { usePromos, PromoCode } from '../context/PromoContext';
import { saveOrderToDb } from '../lib/db/orders';
import styles from './CheckoutModal.module.css';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict: any;
  lang?: string;
}

export default function CheckoutModal({ isOpen, onClose, dict, lang = 'en' }: CheckoutModalProps) {
  const { items, cartCount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { validatePromo } = usePromos();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [copied, setCopied] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    note: '',
    isGift: false,
    giftReceiverName: '',
    giftMessage: '',
    hidePrice: false,
  });

  const subtotal = items.reduce((sum, item) => {
    const orig = item.originalPrice ?? 0;
    const cur = item.price;
    const hasDiscount = orig > 0 && orig !== cur;
    const effectivePrice = hasDiscount ? Math.min(orig, cur) : cur;
    return sum + (effectivePrice * (item.quantity || 1));
  }, 0);
  const discountAmount = appliedPromo 
    ? (appliedPromo.type === 'percentage' ? subtotal * (appliedPromo.value / 100) : appliedPromo.value)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setPaymentMethod('online');
      setCopied(false);
      setPromoCodeInput('');
      setAppliedPromo(null);
      setPromoError('');
      setForm({ firstName: '', lastName: '', phone: '', email: '', address: '', city: '', note: '', isGift: false, giftReceiverName: '', giftMessage: '', hidePrice: false });
    }
  }, [isOpen]);

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim()) return;
    const promo = validatePromo(promoCodeInput.trim());
    if (promo) {
      setAppliedPromo(promo);
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to Supabase orders table
    const orderId = `ORD-${Date.now()}`;
    await saveOrderToDb({
      customerName: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      paymentMethod,
      totalAmount: total,
      discountAmount,
      items,
      isGift: form.isGift,
      giftMessage: form.giftMessage,
    });
    
    // Remember customer phone/email for order tracking
    try {
      if (form.phone) localStorage.setItem('ariel_customer_phone', form.phone);
      if (form.email) localStorage.setItem('ariel_customer_email', form.email);
    } catch {}

    // OrdersContext automatically listens to Supabase realtime, 
    // so we don't need to call a local addOrder function.

    // Send order confirmation email if email is provided
    if (form.email?.trim()) {
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerName: `${form.firstName} ${form.lastName}`,
            email: form.email,
            items,
            totalAmount: subtotal,
            discountAmount,
            paymentMethod,
            address: form.address,
            city: form.city,
          }),
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr);
      }
    }
    
    // Empty the cart
    clearCart();
    
    setLoading(false);
    setSubmitted(true);
  };

  const isValid = form.firstName.trim() && form.lastName.trim() && form.phone.trim() && form.address.trim();

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      />

      <div className={`${styles.modal} ${isOpen ? styles.open : ''}`} role="dialog" aria-modal="true">
        {/* ── Header ── */}
        <div className={styles.header}>
          <h2>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 20a1 1 0 100-2 1 1 0 000 2zM20 20a1 1 0 100-2 1 1 0 000 2z"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            {dict.common.checkout}
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>🌿</div>
            <h3>{dict.checkout.orderConfirmed}</h3>
            <p>{dict.checkout.thankYouMsg}</p>
            <button className="btn-primary" style={{ marginTop: '8px' }} onClick={onClose}>
              {dict.checkout.continueShopping}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <div className={styles.body}>

              {/* ── Left: Order Summary ── */}
              <div className={styles.summary}>
                <h3>📋 {dict.checkout.orderSummary} ({cartCount})</h3>

                {items.map((item) => {
                  const localizedName =
                    lang === 'ru' && item.nameRu ? item.nameRu :
                    lang === 'am' && (item.nameAm || item.armenianName) ? (item.nameAm || item.armenianName) :
                    item.name;

                  return (
                  <div key={item.cartId} className={styles.orderItem}>
                    <div className={styles.itemThumb}>
                      {item.images?.[0] && <img src={item.images[0]} alt={localizedName} />}
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>
                        {(item.quantity && item.quantity > 1) && <span style={{ color: '#4a603c', marginRight: '4px' }}>{item.quantity}×</span>}
                        {localizedName}
                      </h4>
                      <p className={styles.itemMeta}>
                        {item.selectedSize && `${dict.common.size || 'Size'}: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && ' · '}
                        {item.selectedColor}
                      </p>
                    </div>
                    {(() => {
                      const orig = item.originalPrice ?? 0;
                      const cur = item.price;
                      const hasDiscount = orig > 0 && orig !== cur;
                      const displayCurrent = hasDiscount ? Math.min(orig, cur) : cur;
                      const displayOriginal = hasDiscount ? Math.max(orig, cur) : 0;
                      return (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span className={styles.itemPrice}>{(displayCurrent * (item.quantity || 1)).toLocaleString()} ֏</span>
                          {hasDiscount && (
                            <div style={{ fontSize: '0.75rem', color: '#bbb', textDecoration: 'line-through' }}>
                              {(displayOriginal * (item.quantity || 1)).toLocaleString()} ֏
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  );
                })}

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>{dict.common.total}</span>
                  <span className={styles.totalAmount}>{total.toLocaleString()} ֏</span>
                </div>

                <div className={styles.promoSection}>
                  <div className={styles.promoInputGroup}>
                    <input 
                      type="text" 
                      placeholder={dict.checkout.promoCode || "Promo Code"} 
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value)}
                    />
                    <button type="button" className={styles.promoApplyBtn} onClick={handleApplyPromo}>{dict.checkout.apply}</button>
                  </div>
                  {promoError && <div style={{ color: '#e05252', fontSize: '0.8rem', marginTop: '4px' }}>{dict.checkout.invalidPromo}</div>}
                  {appliedPromo && (
                    <div className={styles.discountRow}>
                      <span>{dict.checkout.discount} ({appliedPromo.code})</span>
                      <span>-{discountAmount.toLocaleString()} ֏</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: Delivery Form ── */}
              <div className={styles.form} style={{ overflowY: 'auto' }}>
                <h3>🚚 {dict.checkout.deliveryDetails}</h3>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-firstName">
                      {dict.checkout.firstName} <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="co-firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-lastName">
                      {dict.checkout.lastName} <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="co-lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-phone">
                      {dict.checkout.phone} <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="co-phone"
                      name="phone"
                      type="tel"
                      placeholder="+374 XX XXX XXX"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-email">{dict.checkout.email}</label>
                    <input
                      id="co-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-city">{dict.checkout.city}</label>
                    <input
                      id="co-city"
                      name="city"
                      type="text"
                      placeholder="Yerevan"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-address">
                      {dict.checkout.address} <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="co-address"
                      name="address"
                      type="text"
                      placeholder={dict.checkout.addressPlaceholder}
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.giftToggle}>
                    <input type="checkbox" checked={form.isGift} onChange={e => setForm({...form, isGift: e.target.checked})} />
                    🎁 {dict.checkout.sendAsGift}
                  </label>
                  {form.isGift && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#fafaf8', border: '1px solid #f0ebe2', borderRadius: '8px', marginBottom: '8px' }}>
                      <input type="text" placeholder={dict.checkout.receiverName} value={form.giftReceiverName} onChange={e => setForm({...form, giftReceiverName: e.target.value})} style={{ padding: '8px', border: '1px solid #e0d8c8', borderRadius: '6px' }} />
                      <textarea placeholder={dict.checkout.cardMessage} value={form.giftMessage} onChange={e => setForm({...form, giftMessage: e.target.value})} style={{ padding: '8px', border: '1px solid #e0d8c8', borderRadius: '6px', resize: 'none', height: '60px' }} />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="co-note">{dict.checkout.deliveryNote}</label>
                  <textarea
                    id="co-note"
                    name="note"
                    placeholder={dict.checkout.notePlaceholder}
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>

                <h3 style={{ marginTop: '20px' }}>💳 {dict.checkout.paymentMethod}</h3>
                <div className={styles.paymentTabs}>
                  <button type="button" className={`${styles.paymentTab} ${paymentMethod === 'online' ? styles.active : ''}`} onClick={() => setPaymentMethod('online')}>💳 {dict.checkout.paymentOnline}</button>
                  <button type="button" className={`${styles.paymentTab} ${paymentMethod === 'cod' ? styles.active : ''}`} onClick={() => setPaymentMethod('cod')}>💵 {dict.checkout.paymentCash}</button>
                  <button type="button" className={`${styles.paymentTab} ${paymentMethod === 'bank_transfer' ? styles.active : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>🏦 {dict.checkout.paymentTransfer}</button>
                </div>
                
                {paymentMethod === 'online' && (
                  <div style={{ padding: '16px', background: '#f0f4ec', border: '1.5px solid #c8dcb8', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#2d4520', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      <span>🏛️ {dict.checkout.onlineGatewayTitle}</span>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#4a603c', lineHeight: '1.4' }}>
                      {dict.checkout.onlineGatewayDesc}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d4e2c8', fontWeight: 'bold', color: '#2d4520' }}>🏦 Fast Bank</span>
                      <span style={{ fontSize: '0.75rem', background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d4e2c8', fontWeight: 'bold', color: '#ff6600' }}>🟠 Idram</span>
                      <span style={{ fontSize: '0.75rem', background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d4e2c8', fontWeight: 'bold', color: '#e60000' }}>🔴 Telcell</span>
                      <span style={{ fontSize: '0.75rem', background: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid #d4e2c8', fontWeight: 'bold', color: '#004080' }}>💳 ArCa / Visa / MC</span>
                    </div>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <div style={{ padding: '12px', background: '#e8f0e2', borderRadius: '8px', color: '#3a4f38', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {dict.checkout.cashDesc}
                  </div>
                )}
                {paymentMethod === 'bank_transfer' && (
                  <div style={{ padding: '16px', background: '#f5f0e8', borderRadius: '12px', color: '#555', fontSize: '0.85rem', marginBottom: '16px', border: '1px solid #e0d8c8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e0d8c8', marginBottom: '16px' }}>
                      <div>
                        <strong style={{ color: '#2d4520', display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>AMERIA BANK</strong>
                        <span style={{ fontSize: '1rem', letterSpacing: '1px', color: '#333' }}>9051195200334701</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('9051195200334701');
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        style={{
                          background: copied ? '#4a603c' : '#f0ebe2',
                          color: copied ? '#fff' : '#4a603c',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        {copied ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        )}
                      </button>
                    </div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#3a4f38' }}>{dict.checkout.uploadReceipt}</label>
                    <input type="file" accept="image/*" style={{ fontSize: '0.8rem', width: '100%', padding: '8px', background: '#fff', border: '1px solid #e0d8c8', borderRadius: '6px' }} />
                  </div>
                )}

              </div>
            </div>

            {/* ── Footer ── */}
            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                {dict.checkout.cancel}
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!isValid || loading}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    {dict.checkout.processing}
                  </>
                ) : (
                  <>
                    {paymentMethod === 'online' ? `${dict.checkout.payViaGateway} · ${total.toLocaleString()} ֏` : `${dict.checkout.placeOrder} · ${total.toLocaleString()} ֏`}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
