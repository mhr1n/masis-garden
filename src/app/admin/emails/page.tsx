'use client';

import { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { supabase } from '../../../lib/supabase';

interface Campaign {
  id: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
  status: 'sent' | 'failed';
}

export default function EmailCampaignsPage() {
  const { customers } = useCRM();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('');
  const [senderName, setSenderName] = useState('Masis Garden Team');
  const [audience, setAudience] = useState<'all' | 'vip' | 'regular' | 'new'>('all');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; sent?: number; error?: string } | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [preview, setPreview] = useState(false);

  // Filter customers by selected tag (audience), then extract valid emails
  const validCustomers = customers.filter(c => c.email && c.email.includes('@'));
  const filteredCustomers = audience === 'all' ? validCustomers : validCustomers.filter(c => c.tag === audience);
  
  // Create unique recipients list (to avoid sending multiple emails to the same address if there are duplicates)
  const uniqueEmails = new Set<string>();
  const allRecipients: { email: string; name: string }[] = [];
  
  filteredCustomers.forEach(c => {
    const email = c.email.trim();
    if (!uniqueEmails.has(email)) {
      uniqueEmails.add(email);
      allRecipients.push({ email, name: c.name });
    }
  });

  const recipientCount = allRecipients.length;

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in Subject and Message.');
      return;
    }
    if (recipientCount === 0) {
      alert('No customers with email addresses found in this audience.');
      return;
    }
    if (!confirm(`Send this campaign to ${recipientCount} customers? This action cannot be undone.`)) return;

    setSending(true);
    setResult(null);

    try {
      const res = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          recipients: allRecipients,
          promoCode: promoCode.trim() || null,
          promoDiscount: promoDiscount.trim() || null,
          senderName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({ success: true, sent: data.sent });
        // Save to local campaign history
        const newCampaign: Campaign = {
          id: `camp_${Date.now()}`,
          subject,
          sentAt: new Date().toISOString(),
          recipientCount: data.sent,
          status: 'sent',
        };
        setCampaigns(prev => [newCampaign, ...prev]);
        // Reset form
        setSubject('');
        setMessage('');
        setPromoCode('');
        setPromoDiscount('');
      } else {
        setResult({ success: false, error: data.error });
      }
    } catch (err) {
      setResult({ success: false, error: 'Failed to connect to email server.' });
    } finally {
      setSending(false);
    }
  };

  const charCount = message.length;

  return (
    <div>
      {/* Top Bar */}
      <div className="admin-topbar">
        <div>
          <h1>📧 Email Campaigns</h1>
          <p>Send newsletters, promotions, and announcements to your customers</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-val">{recipientCount}</div>
          <div className="stat-label">Customers with Email</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-val">{campaigns.length}</div>
          <div className="stat-label">Campaigns Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-val">{campaigns.reduce((sum, c) => sum + c.recipientCount, 0)}</div>
          <div className="stat-label">Total Emails Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆓</div>
          <div className="stat-val">3,000</div>
          <div className="stat-label">Monthly Limit (Free Plan)</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
        
        {/* Composer */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>✍️ Compose Campaign</h2>
            <button
              onClick={() => setPreview(!preview)}
              className="btn-cancel-admin"
              style={{ padding: '6px 16px', fontSize: '0.82rem' }}
            >
              {preview ? '✏️ Edit' : '👁️ Preview'}
            </button>
          </div>

          {preview ? (
            /* Preview Mode */
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#f0f4ed', borderRadius: '16px', padding: '24px', maxWidth: '560px', margin: '0 auto' }}>
                <div style={{ background: '#4a5c3f', borderRadius: '12px 12px 0 0', padding: '24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px' }}>🌿</div>
                  <h2 style={{ color: '#fff', margin: '8px 0 2px', fontSize: '18px' }}>Masis Garden</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '12px' }}>Bringing nature closer to you</p>
                </div>
                <div style={{ background: '#c5d8b3', padding: '12px 24px', textAlign: 'center' }}>
                  <strong style={{ color: '#2d3d26' }}>{subject || '(No subject)'}</strong>
                </div>
                <div style={{ background: '#fff', padding: '24px', borderRadius: '0 0 12px 12px' }}>
                  <p style={{ color: '#3a4d35', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginTop: 0 }}>
                    {message || '(No message)'}
                  </p>
                  {promoCode && (
                    <div style={{ background: '#2d3d26', borderRadius: '10px', padding: '20px', textAlign: 'center', marginTop: '16px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: '8px' }}>🎁 PROMO CODE</div>
                      <div style={{ color: '#c5d8b3', fontSize: '24px', fontWeight: 900, letterSpacing: '4px', fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '8px', border: '2px dashed rgba(255,255,255,0.3)', display: 'inline-block' }}>
                        {promoCode}
                      </div>
                      {promoDiscount && <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '8px', fontSize: '13px' }}>{promoDiscount}% discount</div>}
                    </div>
                  )}
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <span style={{ background: '#4a5c3f', color: '#fff', padding: '12px 28px', borderRadius: '50px', fontSize: '13px', fontWeight: 700 }}>🌿 Visit Masis Garden</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Sender Name */}
              <div className="form-group">
                <label>📛 Sender Name (shown in email)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  placeholder="e.g. Masis Garden Team"
                  className="form-control"
                />
              </div>

              {/* Subject */}
              <div className="form-group">
                <label>📌 Email Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. 🌿 Special offer for our valued customers!"
                  className="form-control"
                />
              </div>

              {/* Message */}
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>✉️ Message Body *</span>
                  <span style={{ color: charCount > 1000 ? '#cc6666' : '#6a7a65', fontSize: '0.8rem' }}>{charCount} chars</span>
                </label>
                <div style={{ background: '#2a3528', padding: '10px 14px', borderRadius: '8px 8px 0 0', fontSize: '0.85rem', color: '#c5d8b3', border: '1px solid #3a4f38', borderBottom: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>💡 <strong>Pro Tip:</strong> Type <code>{'{CustomerName}'}</code> to personalize the email. E.g. "Hello {'{CustomerName}'}!"</span>
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={`Write your message here...\n\nYou can write in Armenian, English or Russian.\nExample: Բարև {CustomerName}! / Hello {CustomerName}! / Привет {CustomerName}!\n\nThe email will be beautifully formatted and sent to all your customers.`}
                  style={{ minHeight: '200px', resize: 'vertical', padding: '14px', background: '#1a2018', border: '1px solid #3a4f38', borderRadius: '0 0 10px 10px', color: '#e8eee5', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.7', width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Promo Code (optional) */}
              <div style={{ background: '#131810', border: '1px solid #2a3528', borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 14px', color: '#8fbc6a', fontSize: '0.9rem' }}>🎁 Attach Promo Code (Optional)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Promo Code</label>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SUMMER20"
                      className="form-control"
                      style={{ textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>Discount %</label>
                    <input
                      type="number"
                      value={promoDiscount}
                      onChange={e => setPromoDiscount(e.target.value)}
                      placeholder="e.g. 20"
                      className="form-control"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: '0.78rem', color: '#6a7a65' }}>
                  💡 Make sure this code exists in your <a href="/admin/promos" style={{ color: '#8fbc6a' }}>Promos section</a> before sending.
                </p>
              </div>

              {/* Recipient Info */}
              <div style={{ background: '#1a2018', border: '1px solid #2a3528', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ color: '#c5d8b3', fontWeight: 700, fontSize: '1rem' }}>📬 {recipientCount} recipients</div>
                  <div style={{ color: '#6a7a65', fontSize: '0.8rem', marginTop: '2px' }}>
                    Target Audience:
                    <select
                      value={audience}
                      onChange={e => setAudience(e.target.value as any)}
                      style={{ marginLeft: '10px', background: '#131810', color: '#c5d8b3', border: '1px solid #3a4f38', borderRadius: '6px', padding: '4px 8px', fontSize: '0.8rem' }}
                    >
                      <option value="all">🌐 All Customers</option>
                      <option value="vip">⭐ VIP Only</option>
                      <option value="regular">👥 Regular Only</option>
                      <option value="new">🆕 New Customers Only</option>
                    </select>
                  </div>
                </div>
                {recipientCount === 0 && (
                  <span style={{ color: '#cc8866', fontSize: '0.8rem', background: '#2d1a0e', padding: '4px 10px', borderRadius: '6px' }}>
                    No emails match
                  </span>
                )}
              </div>

              {/* Result */}
              {result && (
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: result.success ? '#1a2c1a' : '#2c1a1a',
                  border: `1px solid ${result.success ? '#3a5f3a' : '#5f3a3a'}`,
                  color: result.success ? '#8fbc6a' : '#cc6666',
                  fontWeight: 600,
                }}>
                  {result.success
                    ? `✅ Campaign sent successfully to ${result.sent} customers!`
                    : `❌ Error: ${result.error}`}
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={sending || !subject.trim() || !message.trim() || recipientCount === 0}
                className="btn-primary-admin"
                style={{
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  opacity: (sending || !subject.trim() || !message.trim() || recipientCount === 0) ? 0.5 : 1,
                  cursor: (sending || !subject.trim() || !message.trim() || recipientCount === 0) ? 'not-allowed' : 'pointer',
                }}
              >
                {sending ? '⏳ Sending...' : `🚀 Send to ${recipientCount} Customers`}
              </button>
            </div>
          )}
        </div>

        {/* Campaign History */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>📋 Sent Campaigns</h2>
          </div>
          {campaigns.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: '#6a7a65' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📭</div>
              <p style={{ margin: 0 }}>No campaigns sent yet.</p>
            </div>
          ) : (
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {campaigns.map(c => (
                <div key={c.id} style={{ background: '#131810', border: '1px solid #2a3528', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 600, color: '#c5d8b3', fontSize: '0.9rem', marginBottom: '6px' }}>{c.subject}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6a7a65', fontSize: '0.78rem' }}>
                      {new Date(c.sentAt).toLocaleString()}
                    </span>
                    <span style={{ background: '#1a2c1a', color: '#8fbc6a', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      ✅ {c.recipientCount} sent
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
