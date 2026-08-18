'use client';

import { useState } from 'react';
import { usePromos, PromoCode } from '../../../context/PromoContext';

export default function PromosAdminPage() {
  const { promos, addPromo, removePromo, togglePromoStatus } = usePromos();
  const [form, setForm] = useState({ code: '', type: 'percentage' as 'percentage' | 'fixed', value: 10 });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || form.value <= 0) {
      setError('Please provide a valid code and value');
      return;
    }
    
    // check if code already exists
    if (promos.some(p => p.code.toUpperCase() === form.code.toUpperCase())) {
      setError('This code already exists');
      return;
    }

    addPromo({
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.value,
      isActive: true,
    });

    setForm({ code: '', type: 'percentage', value: 10 });
    setError('');
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Promo Codes</h1>
          <p>Manage discount codes for your customers</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Create Promo Card */}
        <div className="admin-card" style={{ alignSelf: 'start' }}>
          <div className="admin-card-header">
            <h2>Add New Promo</h2>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
            {error && <div style={{ color: '#ff6b6b', background: '#2a1a1a', padding: '8px', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c5d8b3' }}>Code String</label>
              <input
                type="text"
                placeholder="e.g. SPRING20"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                style={{ width: '100%', padding: '10px', background: '#1a2018', border: '1px solid #3a4f38', color: '#fff', borderRadius: '6px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c5d8b3' }}>Discount Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as 'percentage' | 'fixed' })}
                style={{ width: '100%', padding: '10px', background: '#1a2018', border: '1px solid #3a4f38', color: '#fff', borderRadius: '6px' }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (֏)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c5d8b3' }}>Discount Value</label>
              <input
                type="number"
                min="1"
                value={form.value}
                onChange={e => setForm({ ...form, value: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', background: '#1a2018', border: '1px solid #3a4f38', color: '#fff', borderRadius: '6px' }}
                required
              />
            </div>

            <button type="submit" className="btn-primary-admin" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              Create Promo Code
            </button>
          </form>
        </div>

        {/* List Promos Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Active Codes ({promos.length})</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
            {promos.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🎟️</div>
                <h3>No promo codes yet</h3>
              </div>
            ) : (
              promos.map(promo => (
                <div key={promo.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#131810',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #2a3528',
                  opacity: promo.isActive ? 1 : 0.6
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, color: promo.isActive ? '#8fbc6a' : '#888', letterSpacing: '1px' }}>{promo.code}</h3>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        padding: '4px 8px', 
                        background: '#1a2018', 
                        borderRadius: '4px',
                        border: '1px solid #2a3528',
                        color: '#c5d8b3'
                      }}>
                        {promo.type === 'percentage' ? `${promo.value}% OFF` : `${promo.value.toLocaleString()} ֏ OFF`}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6a7a65' }}>
                      Created: {new Date(promo.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#c5d8b3', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={promo.isActive}
                        onChange={(e) => togglePromoStatus(promo.id, e.target.checked)}
                      />
                      Active
                    </label>
                    <button 
                      onClick={() => { if(confirm('Are you sure you want to delete this promo?')) removePromo(promo.id) }}
                      style={{ background: '#3a1a1a', color: '#ff6b6b', border: '1px solid #ff6b6b40', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
