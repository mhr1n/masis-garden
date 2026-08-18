'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductsContext';

export default function AdminDashboard() {
  const { products, deleteProduct, resetToDefaults } = useProducts();
  const [filter, setFilter] = useState<'all' | 'plant' | 'pot' | 'moss'>('all');

  const filtered = products.filter(p => filter === 'all' || p.type === filter);

  const stats = {
    total: products.length,
    plants: products.filter(p => p.type === 'plant').length,
    pots: products.filter(p => p.type === 'pot').length,
    moss: products.filter(p => p.type === 'moss').length,
  };

  const confirmDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const confirmReset = () => {
    if (confirm(`WARNING: This will delete all custom products and reset to defaults. Are you sure?`)) {
      resetToDefaults();
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your store catalogue and inventory</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-cancel-admin" onClick={confirmReset} style={{ color: '#cc6666', borderColor: '#4d2020' }}>
            Reset to Defaults
          </button>
          <Link href="/admin/new" className="btn-primary-admin">
            ➕ Add Product
          </Link>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-val">{stats.total}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌿</div>
          <div className="stat-val">{stats.plants}</div>
          <div className="stat-label">Plants</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏺</div>
          <div className="stat-val">{stats.pots}</div>
          <div className="stat-label">Pots</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-val">{stats.moss}</div>
          <div className="stat-label">Moss Art</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Product List</h2>
          <div className="filter-tabs">
            {(['all', 'plant', 'pot', 'moss'] as const).map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🍃</div>
            <h3>No products found</h3>
            <p>Try changing the filter or add a new product.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="product-thumb-cell">
                        <div className="product-thumb">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} />}
                        </div>
                        <div>
                          <div className="product-name">{p.name}</div>
                          <div className="product-sub">{p.botanicalName || 'No botanical name'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.type}`}>
                        {p.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="price-cell">{p.price.toLocaleString()} ֏</td>
                    <td>
                      {p.inStock === false ? (
                        <span style={{ color: '#cc6666', fontSize: '0.85rem', fontWeight: 600 }}>Out of Stock</span>
                      ) : (
                        <span style={{ color: '#8fbc6a', fontSize: '0.85rem', fontWeight: 600 }}>In Stock</span>
                      )}
                    </td>
                    <td style={{ color: '#6a7a65', fontSize: '0.85rem', fontWeight: 600 }}>
                      {p.images?.length || 0} pics
                    </td>
                    <td>
                      <div className="action-btns">
                        <Link href={`/admin/${p.id}`} className="btn-edit">Edit</Link>
                        <button className="btn-del" onClick={() => confirmDelete(p.id, p.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
