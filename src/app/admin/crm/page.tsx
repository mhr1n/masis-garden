'use client';

import { useState } from 'react';
import { useCRM, Customer } from '../../../context/CRMContext';

export default function AdminCRM() {
  const { customers, updateCustomerTag, addCustomerNote, sendConfirmationEmail } = useCRM();

  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<'all' | 'vip' | 'regular' | 'new'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Email Modal State
  const [emailModalCustomer, setEmailModalCustomer] = useState<Customer | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  // Note editing state inside details modal
  const [noteText, setNoteText] = useState('');

  // Filtering
  const filteredCustomers = customers.filter((c) => {
    const matchesTag = activeTag === 'all' || c.tag === activeTag;
    const query = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query);
    return matchesTag && matchesSearch;
  });

  const vipCount = customers.filter((c) => c.tag === 'vip').length;
  const regularCount = customers.filter((c) => c.tag === 'regular').length;
  const newCount = customers.filter((c) => c.tag === 'new').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  // Open Details Modal
  const handleOpenDetails = (c: Customer) => {
    setSelectedCustomer(c);
    setNoteText(c.notes || '');
  };

  // Save Note
  const handleSaveNote = () => {
    if (!selectedCustomer) return;
    addCustomerNote(selectedCustomer.id, noteText);
    setSelectedCustomer((prev) => (prev ? { ...prev, notes: noteText } : null));
  };

  // Open Email Modal
  const handleOpenEmailModal = (c: Customer) => {
    setEmailModalCustomer(c);
    setEmailSubject(`Order Confirmation & Thank You — Ariel Green Plants`);
    setEmailBody(
      `Hello ${c.name},\n\nThank you for choosing Ariel Green Plants! We have processed your order and your items are being prepared with care.\n\nSummary:\n- Customer: ${c.name}\n- Address: ${c.address}, ${c.city}\n- Total Spending: ${c.totalSpent.toLocaleString()} ֏\n\nIf you have any questions, feel free to reply to this email or reach us anytime.\n\nWarm regards,\nAriel Green Plants Team 🌿`
    );
    setEmailSentNotice(false);
  };

  // Send Email Action
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalCustomer) return;
    sendConfirmationEmail(emailModalCustomer.id, emailSubject, emailBody);
    setEmailSentNotice(true);
    setTimeout(() => {
      setEmailSentNotice(false);
      setEmailModalCustomer(null);
    }, 1800);
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="admin-topbar">
        <div>
          <h1>👥 Customer Relationship Management (CRM)</h1>
          <p>Track customer profiles, spending history, categorize VIPs, and send order confirmation emails</p>
        </div>
      </div>

      {/* CRM Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-val">{customers.length}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-val" style={{ color: '#F2A800' }}>{vipCount}</div>
          <div className="stat-label">VIP Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-val" style={{ color: '#8fbc6a' }}>{regularCount}</div>
          <div className="stat-label">Regular Buyers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-val">{totalRevenue.toLocaleString()} ֏</div>
          <div className="stat-label">Total Customer Revenue</div>
        </div>
      </div>

      {/* Customer Directory Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeTag === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTag('all')}
            >
              All Customers ({customers.length})
            </button>
            <button
              className={`filter-tab ${activeTag === 'vip' ? 'active' : ''}`}
              onClick={() => setActiveTag('vip')}
            >
              ⭐ VIP ({vipCount})
            </button>
            <button
              className={`filter-tab ${activeTag === 'regular' ? 'active' : ''}`}
              onClick={() => setActiveTag('regular')}
            >
              📦 Regular ({regularCount})
            </button>
            <button
              className={`filter-tab ${activeTag === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTag('new')}
            >
              🆕 New ({newCount})
            </button>
          </div>

          {/* Search */}
          <div style={{ minWidth: '240px' }}>
            <input
              type="text"
              className="login-input"
              style={{ margin: 0, padding: '7px 14px', fontSize: '0.85rem' }}
              placeholder="🔍 Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Customer Table */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Info</th>
              <th>Location</th>
              <th>Orders / Spent</th>
              <th>Category Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6a7a65' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="product-name">{c.name}</div>
                    <div className="product-sub">Last order: {c.lastOrderDate}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#c5d8b3' }}>{c.email || '—'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6a7a65' }}>{c.phone || '—'}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#9aaa90' }}>
                      {c.city ? `${c.city}, ${c.address}` : c.address || '—'}
                    </span>
                  </td>
                  <td>
                    <div className="price-cell">{c.totalSpent.toLocaleString()} ֏</div>
                    <div style={{ fontSize: '0.76rem', color: '#6a7a65' }}>{c.totalOrders} order(s)</div>
                  </td>
                  <td>
                    <select
                      value={c.tag}
                      onChange={(e) => updateCustomerTag(c.id, e.target.value as 'vip' | 'regular' | 'new')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        background: c.tag === 'vip' ? '#2a2010' : c.tag === 'regular' ? '#1e3020' : '#102028',
                        color: c.tag === 'vip' ? '#F2A800' : c.tag === 'regular' ? '#8fbc6a' : '#4aabbb',
                        border: '1px solid #3a4f38',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="vip">⭐ VIP</option>
                      <option value="regular">📦 Regular</option>
                      <option value="new">🆕 New</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => handleOpenDetails(c)}>
                        📋 Details
                      </button>
                      <button
                        className="btn-primary-admin"
                        style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        onClick={() => handleOpenEmailModal(c)}
                      >
                        📧 Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details & Notes Modal */}
      {selectedCustomer && (
        <div className="confirm-overlay" onClick={() => setSelectedCustomer(null)}>
          <div
            className="confirm-box"
            style={{ maxWidth: '560px', width: '95%', textAlign: 'left' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>👤 {selectedCustomer.name}</h3>
              <button
                type="button"
                className="img-remove"
                style={{ position: 'static' }}
                onClick={() => setSelectedCustomer(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div><strong>Email:</strong> {selectedCustomer.email || '—'}</div>
              <div><strong>Phone:</strong> {selectedCustomer.phone || '—'}</div>
              <div><strong>Address:</strong> {selectedCustomer.address || '—'}</div>
              <div><strong>City:</strong> {selectedCustomer.city || '—'}</div>
              <div><strong>Total Spent:</strong> <span style={{ color: '#8fbc6a', fontWeight: 'bold' }}>{selectedCustomer.totalSpent.toLocaleString()} ֏</span></div>
              <div><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</div>
            </div>

            {/* Customer Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9aaa90', display: 'block', marginBottom: '6px' }}>
                📝 Internal Customer Notes & Preferences:
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g. Prefers morning delivery, likes Monstera plants..."
                className="login-input"
                style={{ width: '100%', height: '80px', margin: 0, resize: 'vertical' }}
              />
              <button
                className="btn-edit"
                style={{ marginTop: '8px', padding: '6px 14px' }}
                onClick={handleSaveNote}
              >
                💾 Save Note
              </button>
            </div>

            {/* Email History Logs */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: '#c5d8b3', marginBottom: '8px' }}>
                📧 Confirmation Email History ({selectedCustomer.emailHistory.length})
              </h4>
              <div style={{ maxHeight: '140px', overflowY: 'auto', background: '#131810', padding: '10px', borderRadius: '8px', fontSize: '0.8rem' }}>
                {selectedCustomer.emailHistory.length === 0 ? (
                  <div style={{ color: '#6a7a65' }}>No confirmation emails sent yet.</div>
                ) : (
                  selectedCustomer.emailHistory.map((log) => (
                    <div key={log.id} style={{ borderBottom: '1px dashed #2a3528', paddingBottom: '6px', marginBottom: '6px' }}>
                      <div style={{ color: '#8fbc6a', fontWeight: 600 }}>{log.subject}</div>
                      <div style={{ fontSize: '0.74rem', color: '#6a7a65' }}>Sent: {log.date} by {log.sentBy}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-cancel-admin" onClick={() => setSelectedCustomer(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Confirmation Email Modal */}
      {emailModalCustomer && (
        <div className="confirm-overlay" onClick={() => setEmailModalCustomer(null)}>
          <div
            className="confirm-box"
            style={{ maxWidth: '540px', width: '95%', textAlign: 'left' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>📧 Send Confirmation Email</h3>
            <p style={{ marginBottom: '16px' }}>
              To: <strong>{emailModalCustomer.name}</strong> ({emailModalCustomer.email || 'No email address'})
            </p>

            {emailSentNotice ? (
              <div style={{ padding: '30px', textAlign: 'center', background: '#1e3020', borderRadius: '12px', color: '#8fbc6a', fontWeight: 'bold' }}>
                ✅ Confirmation Email Sent Successfully!
              </div>
            ) : (
              <form onSubmit={handleSendEmail}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Email Message / Confirmation Details</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                    required
                  />
                </div>

                <div className="btns">
                  <button
                    type="button"
                    className="btn-cancel-admin"
                    onClick={() => setEmailModalCustomer(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-admin">
                    🚀 Send Confirmation Email
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
