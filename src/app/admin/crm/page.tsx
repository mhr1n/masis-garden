'use client';

import { useState } from 'react';
import { useCRM, Customer } from '../../../context/CRMContext';
import { useOrders, Order } from '../../../context/OrdersContext';

export default function AdminCRM() {
  const { customers, updateCustomerTag, addCustomerNote, sendConfirmationEmail } = useCRM();
  const { orders } = useOrders();

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<'all' | 'vip' | 'regular' | 'new'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Email Modal State
  const [emailModalCustomer, setEmailModalCustomer] = useState<Customer | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSentNotice, setEmailSentNotice] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Note editing state inside details modal
  const [noteText, setNoteText] = useState('');
  const [noteSavedNotice, setNoteSavedNotice] = useState(false);

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchesTag = activeTag === 'all' || c.tag === activeTag;
    const query = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query);
    return matchesTag && matchesSearch;
  });

  const vipCount = customers.filter((c) => c.tag === 'vip').length;
  const regularCount = customers.filter((c) => c.tag === 'regular').length;
  const newCount = customers.filter((c) => c.tag === 'new').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrdersCount = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  // Helper: Find all orders for a specific customer
  const getCustomerOrders = (customer: Customer): Order[] => {
    return orders.filter((o) => {
      const emailMatch = customer.email && o.customerInfo?.email?.toLowerCase().trim() === customer.email.toLowerCase().trim();
      const phoneMatch = customer.phone && o.customerInfo?.phone?.trim() === customer.phone.trim();
      const nameMatch = customer.name && `${o.customerInfo?.firstName || ''} ${o.customerInfo?.lastName || ''}`.toLowerCase().trim() === customer.name.toLowerCase().trim();
      return emailMatch || phoneMatch || nameMatch;
    });
  };

  // Open Details Modal
  const handleOpenDetails = (c: Customer) => {
    setSelectedCustomer(c);
    setNoteText(c.notes || '');
    setNoteSavedNotice(false);
  };

  // Save Note
  const handleSaveNote = () => {
    if (!selectedCustomer) return;
    addCustomerNote(selectedCustomer.id, noteText);
    setNoteSavedNotice(true);
    setTimeout(() => setNoteSavedNotice(false), 3000);
  };

  // Open Send Email Modal
  const handleOpenEmailModal = (c: Customer) => {
    setEmailModalCustomer(c);
    setEmailSubject(`🌿 Special Update from Masis Garden`);
    setEmailBody(
      `Hello ${c.name.split(' ')[0] || 'Customer'},\n\nWe wanted to reach out and thank you for being a valued customer at Masis Garden.\n\nBest regards,\nMasis Garden Team`
    );
    setEmailSentNotice(false);
  };

  // Send Email handler
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalCustomer) return;
    setIsSendingEmail(true);

    try {
      if (emailModalCustomer.email) {
        await fetch('/api/send-bulk-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: emailSubject,
            message: emailBody,
            recipients: [{ email: emailModalCustomer.email, name: emailModalCustomer.name }],
            senderName: 'Masis Garden Care',
          }),
        });
      }

      sendConfirmationEmail(emailModalCustomer.id, emailSubject, emailBody);
      setEmailSentNotice(true);
      setTimeout(() => {
        setEmailSentNotice(false);
        setEmailModalCustomer(null);
      }, 2000);
    } catch (err) {
      alert('Failed to send email. Please check internet and API key.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span style={{ background: '#1a3a24', color: '#6abc80', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Delivered ✔</span>;
      case 'processing':
        return <span style={{ background: '#1a2c3a', color: '#6a9fbc', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Processing ⏳</span>;
      case 'cancelled':
        return <span style={{ background: '#3a1a1a', color: '#bc6a6a', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Cancelled ✖</span>;
      default:
        return <span style={{ background: '#3a2a18', color: '#d8a05b', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>Pending 🕒</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Bar */}
      <div className="admin-topbar">
        <div>
          <h1>👥 Customer Relationship (CRM)</h1>
          <p>Manage customer profiles, purchase history, VIP segments, and direct communication</p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-val">{customers.length}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-val" style={{ color: '#F2A800' }}>{vipCount}</div>
          <div className="stat-label">VIP Clients</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-val">{totalOrdersCount}</div>
          <div className="stat-label">Total Orders Placed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-val" style={{ color: '#8fbc6a' }}>{totalRevenue.toLocaleString()} ֏</div>
          <div className="stat-label">Customer Lifetime Value</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTag('all')}
              style={{
                background: activeTag === 'all' ? '#4a5c3f' : '#1e261c',
                color: activeTag === 'all' ? '#fff' : '#9aaa90',
                border: '1px solid #3a4f38',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: '0.2s',
              }}
            >
              All ({customers.length})
            </button>
            <button
              onClick={() => setActiveTag('vip')}
              style={{
                background: activeTag === 'vip' ? '#2d2410' : '#1e261c',
                color: activeTag === 'vip' ? '#F2A800' : '#9aaa90',
                border: `1px solid ${activeTag === 'vip' ? '#F2A800' : '#3a4f38'}`,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: '0.2s',
              }}
            >
              ⭐ VIP ({vipCount})
            </button>
            <button
              onClick={() => setActiveTag('regular')}
              style={{
                background: activeTag === 'regular' ? '#1a2e1d' : '#1e261c',
                color: activeTag === 'regular' ? '#8fbc6a' : '#9aaa90',
                border: `1px solid ${activeTag === 'regular' ? '#8fbc6a' : '#3a4f38'}`,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: '0.2s',
              }}
            >
              👥 Regular ({regularCount})
            </button>
            <button
              onClick={() => setActiveTag('new')}
              style={{
                background: activeTag === 'new' ? '#10222a' : '#1e261c',
                color: activeTag === 'new' ? '#4aabbb' : '#9aaa90',
                border: `1px solid ${activeTag === 'new' ? '#4aabbb' : '#3a4f38'}`,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: '0.2s',
              }}
            >
              🆕 New ({newCount})
            </button>
          </div>

          <div style={{ flex: '1 1 260px', maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by name, phone, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Orders & Spent</th>
                <th>Segment Tag</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: '#6a7a65' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
                    No customers found matching this criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const initials = c.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'C';

                  return (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => handleOpenDetails(c)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: c.tag === 'vip' ? '#2a2010' : '#243022',
                              border: `2px solid ${c.tag === 'vip' ? '#F2A800' : '#3a4f38'}`,
                              color: c.tag === 'vip' ? '#F2A800' : '#c5d8b3',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#e8eee5', fontSize: '0.95rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6a7a65' }}>Last active: {c.lastOrderDate}</div>
                          </div>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ fontSize: '0.85rem', color: '#c5d8b3' }}>
                          {c.email ? (
                            <a href={`mailto:${c.email}`} style={{ color: '#8fbc6a', textDecoration: 'none' }}>
                              ✉️ {c.email}
                            </a>
                          ) : (
                            <span style={{ color: '#6a7a65' }}>No email</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#9aaa90', marginTop: '2px' }}>
                          {c.phone ? (
                            <a href={`tel:${c.phone}`} style={{ color: '#9aaa90', textDecoration: 'none' }}>
                              📞 {c.phone}
                            </a>
                          ) : (
                            '—'
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem', color: '#e8eee5' }}>{c.city || 'Yerevan'}</div>
                        <div style={{ fontSize: '0.76rem', color: '#6a7a65', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.address || '—'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#8fbc6a', fontSize: '0.95rem' }}>
                          {c.totalSpent.toLocaleString()} ֏
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#6a7a65' }}>{c.totalOrders} order(s)</div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          value={c.tag}
                          onChange={(e) => updateCustomerTag(c.id, e.target.value as 'vip' | 'regular' | 'new')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            background: c.tag === 'vip' ? '#2a2010' : c.tag === 'regular' ? '#1e3020' : '#102028',
                            color: c.tag === 'vip' ? '#F2A800' : c.tag === 'regular' ? '#8fbc6a' : '#4aabbb',
                            border: `1px solid ${c.tag === 'vip' ? '#F2A800' : '#3a4f38'}`,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="vip">⭐ VIP</option>
                          <option value="regular">👥 Regular</option>
                          <option value="new">🆕 New</option>
                        </select>
                      </td>
                      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn-secondary-admin"
                            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                            onClick={() => handleOpenDetails(c)}
                          >
                            🔍 Details
                          </button>
                          <button
                            className="btn-primary-admin"
                            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                            onClick={() => handleOpenEmailModal(c)}
                          >
                            ✉️ Email
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 🌟 ULTRA MODERN CUSTOMER DETAILS & ORDERS MODAL 🌟 */}
      {/* ============================================================ */}
      {selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 10, 5, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            style={{
              background: '#141a13',
              border: '1px solid #2d3f2c',
              borderRadius: '20px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e2d1d, #141a13)',
                padding: '24px 28px',
                borderBottom: '1px solid #2d3f2c',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: selectedCustomer.tag === 'vip' ? '#2a2010' : '#243022',
                    border: `2px solid ${selectedCustomer.tag === 'vip' ? '#F2A800' : '#4a5c3f'}`,
                    color: selectedCustomer.tag === 'vip' ? '#F2A800' : '#c5d8b3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.3rem',
                  }}
                >
                  {selectedCustomer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'C'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>
                      {selectedCustomer.name}
                    </h2>
                    {selectedCustomer.tag === 'vip' && (
                      <span style={{ background: '#2a2010', color: '#F2A800', border: '1px solid #F2A800', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                        ⭐ VIP MEMBER
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#8fbc6a', fontSize: '0.85rem', marginTop: '2px' }}>
                    Customer ID: <code style={{ color: '#c5d8b3' }}>{selectedCustomer.id.slice(0, 16)}</code>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="btn-primary-admin"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  onClick={() => handleOpenEmailModal(selectedCustomer)}
                >
                  ✉️ Send Email
                </button>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  style={{
                    background: '#243022',
                    border: '1px solid #3a4f38',
                    color: '#c5d8b3',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Quick Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                  background: '#0d130c',
                  padding: '18px',
                  borderRadius: '14px',
                  border: '1px solid #233122',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#6a7a65', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</div>
                  <div style={{ fontSize: '0.92rem', color: '#c5d8b3', fontWeight: 600, marginTop: '3px' }}>
                    {selectedCustomer.email || '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#6a7a65', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</div>
                  <div style={{ fontSize: '0.92rem', color: '#c5d8b3', fontWeight: 600, marginTop: '3px' }}>
                    {selectedCustomer.phone || '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#6a7a65', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                  <div style={{ fontSize: '0.92rem', color: '#c5d8b3', fontWeight: 600, marginTop: '3px' }}>
                    {selectedCustomer.address ? `${selectedCustomer.address}, ${selectedCustomer.city || 'Yerevan'}` : '—'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#6a7a65', textTransform: 'uppercase', fontWeight: 700 }}>Total Spent (LTV)</div>
                  <div style={{ fontSize: '1.1rem', color: '#8fbc6a', fontWeight: 800, marginTop: '3px' }}>
                    {selectedCustomer.totalSpent.toLocaleString()} ֏
                  </div>
                </div>
              </div>

              {/* Order History Section */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#c5d8b3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📦 Purchase History ({getCustomerOrders(selectedCustomer).length} Orders)
                  </h3>
                </div>

                {getCustomerOrders(selectedCustomer).length === 0 ? (
                  <div style={{ background: '#0d130c', border: '1px solid #233122', padding: '24px', borderRadius: '12px', textAlign: 'center', color: '#6a7a65' }}>
                    No recorded orders yet for this profile.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {getCustomerOrders(selectedCustomer).map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          background: '#0e140e',
                          border: '1px solid #283a27',
                          borderRadius: '12px',
                          padding: '16px',
                          transition: '0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{ord.id}</span>
                            <span style={{ color: '#6a7a65', fontSize: '0.8rem' }}>
                              📅 {new Date(ord.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {getStatusBadge(ord.status)}
                            <strong style={{ color: '#8fbc6a', fontSize: '1.05rem' }}>
                              {ord.total.toLocaleString()} ֏
                            </strong>
                          </div>
                        </div>

                        {/* Items in order */}
                        <div style={{ background: '#141c14', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#6a7a65', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                            Ordered Items:
                          </div>
                          {ord.items && ord.items.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {ord.items.map((item, idx) => (
                                <div key={idx} style={{ background: '#1e2b1d', border: '1px solid #334a32', padding: '6px 12px', borderRadius: '6px', color: '#c5d8b3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>🪴 <strong>{item.name}</strong></span>
                                  <span style={{ color: '#8fbc6a' }}>{item.price?.toLocaleString()} ֏</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: '#6a7a65' }}>Item details recorded</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Notes & Preferences */}
              <div style={{ background: '#0d130c', border: '1px solid #233122', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#c5d8b3', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📝 Internal Staff Notes & VIP Preferences:
                  </label>
                  {noteSavedNotice && (
                    <span style={{ color: '#8fbc6a', fontSize: '0.8rem', fontWeight: 700 }}>
                      ✔ Note saved!
                    </span>
                  )}
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Prefers morning delivery, likes indoor tropical plants, loyal VIP customer..."
                  className="form-control"
                  style={{ minHeight: '80px', resize: 'vertical', fontSize: '0.9rem', lineHeight: '1.6' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button className="btn-secondary-admin" style={{ padding: '6px 16px' }} onClick={handleSaveNote}>
                    💾 Save Notes
                  </button>
                </div>
              </div>

              {/* Communication Logs */}
              {selectedCustomer.emailHistory && selectedCustomer.emailHistory.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#c5d8b3', marginBottom: '10px' }}>
                    📨 Sent Email History ({selectedCustomer.emailHistory.length})
                  </h4>
                  <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#0d130c', padding: '12px', borderRadius: '10px', border: '1px solid #233122' }}>
                    {selectedCustomer.emailHistory.map((log) => (
                      <div key={log.id} style={{ borderBottom: '1px solid #1e2b1d', paddingBottom: '8px', marginBottom: '8px' }}>
                        <div style={{ color: '#8fbc6a', fontWeight: 600, fontSize: '0.88rem' }}>{log.subject}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6a7a65' }}>Sent: {log.date} by {log.sentBy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid #2d3f2c', background: '#0d130c', display: 'flex', justifyContent: 'flex-end', borderRadius: '0 0 20px 20px' }}>
              <button className="btn-secondary-admin" onClick={() => setSelectedCustomer(null)}>
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 📧 DIRECT CUSTOMER EMAIL MODAL */}
      {/* ============================================================ */}
      {emailModalCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 10, 5, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setEmailModalCustomer(null)}
        >
          <div
            style={{
              background: '#141a13',
              border: '1px solid #2d3f2c',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>
                ✉️ Send Message to {emailModalCustomer.name}
              </h3>
              <button
                onClick={() => setEmailModalCustomer(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9aaa90',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#8fbc6a', fontSize: '0.85rem', marginBottom: '16px', background: '#0e140e', padding: '10px 14px', borderRadius: '8px', border: '1px solid #233122' }}>
              To: <strong>{emailModalCustomer.name}</strong> &lt;{emailModalCustomer.email || 'No email registered'}&gt;
            </p>

            {emailSentNotice ? (
              <div style={{ padding: '30px', textAlign: 'center', background: '#1e3020', borderRadius: '12px', color: '#8fbc6a', fontWeight: 'bold' }}>
                ✔ Email Sent Successfully via Resend!
              </div>
            ) : (
              <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label>Message</label>
                  <textarea
                    className="form-control"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn-cancel-admin"
                    onClick={() => setEmailModalCustomer(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-admin" disabled={isSendingEmail}>
                    {isSendingEmail ? '⏳ Sending...' : '🚀 Send Email'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
