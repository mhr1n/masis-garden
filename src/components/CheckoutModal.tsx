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
}

export default function CheckoutModal({ isOpen, onClose, dict }: CheckoutModalProps) {
  const { items, cartCount, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { validatePromo } = usePromos();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
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
    return sum + effectivePrice;
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
            <h3>Order Confirmed!</h3>
            <p>Thank you! We will contact you shortly to confirm delivery details.</p>
            <button className="btn-primary" style={{ marginTop: '8px' }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <div className={styles.body}>

              {/* ── Left: Order Summary ── */}
              <div className={styles.summary}>
                <h3>📋 Order Summary ({cartCount})</h3>

                {items.map((item) => (
                  <div key={item.cartId} className={styles.orderItem}>
                    <div className={styles.itemThumb}>
                      {item.images?.[0] && <img src={item.images[0]} alt={item.name} />}
                    </div>
                    <div className={styles.itemInfo}>
                      <h4>{item.name}</h4>
                      <p className={styles.itemMeta}>
                        {item.selectedSize && `Size: ${item.selectedSize}`}
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
                          <span className={styles.itemPrice}>{displayCurrent.toLocaleString()} ֏</span>
                          {hasDiscount && (
                            <div style={{ fontSize: '0.75rem', color: '#bbb', textDecoration: 'line-through' }}>
                              {displayOriginal.toLocaleString()} ֏
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))}

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>{dict.common.total}</span>
                  <span className={styles.totalAmount}>{total.toLocaleString()} ֏</span>
                </div>

                <div className={styles.promoSection}>
                  <div className={styles.promoInputGroup}>
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value)}
                    />
                    <button type="button" className={styles.promoApplyBtn} onClick={handleApplyPromo}>Apply</button>
                  </div>
                  {promoError && <div style={{ color: '#e05252', fontSize: '0.8rem', marginTop: '4px' }}>{promoError}</div>}
                  {appliedPromo && (
                    <div className={styles.discountRow}>
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-{discountAmount.toLocaleString()} ֏</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right: Delivery Form ── */}
              <div className={styles.form} style={{ overflowY: 'auto' }}>
                <h3>🚚 Delivery Details</h3>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="co-firstName">
                      First Name <span className={styles.required}>*</span>
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
                      Last Name <span className={styles.required}>*</span>
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
                      Phone <span className={styles.required}>*</span>
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
                    <label htmlFor="co-email">Email</label>
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
                    <label htmlFor="co-city">City</label>
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
                      Address <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="co-address"
                      name="address"
                      type="text"
                      placeholder="Street, building, apt..."
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.giftToggle}>
                    <input type="checkbox" checked={form.isGift} onChange={e => setForm({...form, isGift: e.target.checked})} />
                    🎁 Send as a Gift
                  </label>
                  {form.isGift && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: '#fafaf8', border: '1px solid #f0ebe2', borderRadius: '8px', marginBottom: '8px' }}>
                      <input type="text" placeholder="Receiver Name" value={form.giftReceiverName} onChange={e => setForm({...form, giftReceiverName: e.target.value})} style={{ padding: '8px', border: '1px solid #e0d8c8', borderRadius: '6px' }} />
                      <textarea placeholder="Custom Greeting Card Text..." value={form.giftMessage} onChange={e => setForm({...form, giftMessage: e.target.value})} style={{ padding: '8px', border: '1px solid #e0d8c8', borderRadius: '6px', resize: 'none', height: '60px' }} />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="co-note">Note for delivery</label>
                  <textarea
                    id="co-note"
                    name="note"
                    placeholder="Any special instructions..."
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>

                <h3 style={{ marginTop: '20px' }}>💳 Payment Method</h3>
                <div className={styles.paymentTabs}>
                  <button type="button" className={`${styles.paymentTab} ${paymentMethod === 'online' ? styles.active : ''}`} onClick={() => setPaymentMethod('online')}>💳 Online</button>
                  <button type="button" className={`${styles.paymentTab} ${paymentMethod === 'cod' ? styles.active : ''}`} onClick={() => setPaymentMethod('cod')}>💵 Cash</button>
                  <button type="button" className={`${styles.paymentTab} ${paymentMethod === 'bank_transfer' ? styles.active : ''}`} onClick={() => setPaymentMethod('bank_transfer')}>🏦 Transfer</button>
                </div>
                
                {paymentMethod === 'online' && (
                  <div style={{ padding: '16px', background: '#f0f4ec', border: '1.5px solid #c8dcb8', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#2d4520', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      <span>🏛️ Armenian Merchant Gateway (Fast Bank)</span>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#4a603c', lineHeight: '1.4' }}>
                      Upon clicking place order, you will be redirected to the secure bank merchant gateway (<strong>Fast Bank / AmeriaBank / Telcell / Idram</strong>) to complete your online payment.
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
                    You will pay in cash or via POS terminal upon delivery.
                  </div>
                )}
                {paymentMethod === 'bank_transfer' && (
                  <div style={{ padding: '12px', background: '#f5f0e8', borderRadius: '8px', color: '#555', fontSize: '0.85rem', marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>IBAN:</strong> AM123456789000000000</p>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Upload Receipt:</label>
                    <input type="file" accept="image/*" style={{ fontSize: '0.8rem' }} />
                  </div>
                )}

              </div>
            </div>

            {/* ── Footer ── */}
            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
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
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'online' ? `Pay via Bank Gateway · ${total.toLocaleString()} ֏` : `Place Order · ${total.toLocaleString()} ֏`}
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
