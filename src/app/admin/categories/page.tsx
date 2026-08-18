'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCategories, CategoryItem } from '../../../context/CategoriesContext';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, resetCategories } = useCategories();

  const [isEditing, setIsEditing] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<{ id: string; name: string; emoji: string; description: string }>({
    id: '',
    name: '',
    emoji: '📦',
    description: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return alert('Category Name is required.');

    const catId = isEditing
      ? isEditing.id
      : form.id.trim()
      ? form.id.trim().toLowerCase().replace(/\s+/g, '_')
      : `cat_${Date.now()}`;

    const newCat: CategoryItem = {
      id: catId,
      name: form.name.trim(),
      emoji: form.emoji.trim() || '📦',
      description: form.description.trim(),
    };

    if (isEditing) {
      updateCategory(newCat);
    } else {
      addCategory(newCat);
    }

    // Reset Form
    setIsEditing(null);
    setForm({ id: '', name: '', emoji: '📦', description: '' });
  };

  const handleEditClick = (cat: CategoryItem) => {
    setIsEditing(cat);
    setForm({
      id: cat.id,
      name: cat.name,
      emoji: cat.emoji,
      description: cat.description || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setForm({ id: '', name: '', emoji: '📦', description: '' });
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>🏷️ Category Management</h1>
          <p>Create & manage product categories shown dynamically across Header Nav & Catalog Filters</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-cancel-admin" onClick={resetCategories}>
            🔄 Reset Defaults
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Table of Categories */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Active Categories ({categories.length})</h2>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>ID</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isDefault = cat.id === 'plant' || cat.id === 'pot' || cat.id === 'moss';
                return (
                  <tr key={cat.id}>
                    <td>
                      <div className="product-thumb-cell">
                        <span style={{ fontSize: '1.6rem' }}>{cat.emoji}</span>
                        <div>
                          <div className="product-name">{cat.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: '#131810', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', color: '#8fbc6a' }}>
                        {cat.id}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.84rem', color: '#9aaa90' }}>
                        {cat.description || '—'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => handleEditClick(cat)}>
                          ✏️ Edit
                        </button>
                        {!isDefault && (
                          <button className="btn-del" onClick={() => deleteCategory(cat.id)}>
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add / Edit Form */}
        <div className="form-section" style={{ height: 'fit-content' }}>
          <h3>{isEditing ? `Edit Category` : `➕ Add New Category`}</h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label>Category Emoji Icon *</label>
              <input
                type="text"
                placeholder="e.g. 🌿"
                value={form.emoji}
                onChange={(e) => setForm((prev) => ({ ...prev, emoji: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                placeholder="e.g. Herbs & Seeds"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {!isEditing && (
              <div className="form-group">
                <label>Category ID (slug/optional)</label>
                <input
                  type="text"
                  placeholder="e.g. herbs_seeds"
                  value={form.id}
                  onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
                />
              </div>
            )}

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea
                placeholder="Short description..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {isEditing && (
                <button type="button" className="btn-cancel-admin" onClick={handleCancel} style={{ flex: 1 }}>
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-primary-admin" style={{ flex: 1, justifyContent: 'center' }}>
                {isEditing ? 'Save Changes' : '➕ Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
