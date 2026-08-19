'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProducts } from '../../../context/ProductsContext';
import { useCategories } from '../../../context/CategoriesContext';
import type { Product, ProductType } from '../../../data/products';

export default function ProductForm({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const isNew = resolvedParams.id === 'new';
  const { products, addProduct, updateProduct, uploadImage } = useProducts();
  const { categories } = useCategories();
  const router = useRouter();

  const [form, setForm] = useState<Partial<Product>>({
    id: `prod_${Date.now()}`,
    type: 'plant',
    name: '',
    price: 0,
    inStock: true,
    images: [],
    description: '',
    careTips: [],
    features: [],
    tags: []
  });

  const [imgInput, setImgInput] = useState('');

  useEffect(() => {
    if (!isNew) {
      const existing = products.find(p => p.id === resolvedParams.id);
      if (existing) setForm(existing);
      else router.push('/admin'); // Not found
    }
  }, [isNew, resolvedParams.id, products, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (name: string) => {
    setForm(prev => ({ ...prev, [name]: !(prev as any)[name] }));
  };

  const handleArrayChange = (field: 'careTips' | 'features', index: number, value: string) => {
    const arr = [...(form[field] || [])];
    arr[index] = value;
    setForm(prev => ({ ...prev, [field]: arr }));
  };
  const addArrayItem = (field: 'careTips' | 'features') => {
    setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };
  const removeArrayItem = (field: 'careTips' | 'features', index: number) => {
    const arr = [...(form[field] || [])];
    arr.splice(index, 1);
    setForm(prev => ({ ...prev, [field]: arr }));
  };

  // Image Management
  const addImageURL = () => {
    if (!imgInput.trim()) return;
    setForm(prev => ({ ...prev, images: [...(prev.images || []), imgInput.trim()] }));
    setImgInput('');
  };
  const makeCoverImage = (index: number) => {
    const imgs = [...(form.images || [])];
    if (index <= 0 || index >= imgs.length) return;
    const [selected] = imgs.splice(index, 1);
    imgs.unshift(selected);
    setForm(prev => ({ ...prev, images: imgs }));
  };

  const removeImage = (index: number) => {
    const imgs = [...(form.images || [])];
    imgs.splice(index, 1);
    setForm(prev => ({ ...prev, images: imgs }));
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use a placeholder or loading state if needed, but for simplicity we'll just wait
    // Ideally we would set a loading state here.
    const url = await uploadImage(file);
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: [url, ...(prev.images || [])],
      }));
    } else {
      alert("Failed to upload image. Please check your Supabase Storage settings.");
    }
    
    e.target.value = '';
  };

  // Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name and Price are required.");
    
    // Ensure ID exists
    const toSave = { ...form, id: form.id || `prod_${Date.now()}` } as Product;
    
    if (isNew) {
      addProduct(toSave);
    } else {
      updateProduct(toSave);
    }
    
    router.push('/admin');
  };

  const isPlant = form.type === 'plant';

  return (
    <div className="form-wrap">
      <div className="admin-topbar">
        <div>
          <h1>{isNew ? 'Add New Product' : `Edit Product`}</h1>
          <p>{isNew ? 'Create a new item for your catalogue' : 'Update the product details below'}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin" className="btn-cancel-admin">Cancel</Link>
          <button className="btn-primary-admin" onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        
        {/* ── BASIC INFO ── */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group form-full">
              <label>Product Name (English) *</label>
              <input name="name" value={form.name || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Botanical Name</label>
              <input name="botanicalName" value={form.botanicalName || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Armenian Name</label>
              <input name="armenianName" value={form.armenianName || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Product Category / Type *</label>
              <select name="type" value={form.type || 'plant'} onChange={handleChange} required>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Final Selling Price (֏) * (قیمت فروش)</label>
              <input type="number" step="1" name="price" value={form.price || 0} onChange={handleChange} required />
              <small style={{ color: '#888', display: 'block', marginTop: '4px', fontSize: '0.75rem' }}>The final discounted price customer pays (e.g. 11,900)</small>
            </div>

            <div className="form-group">
              <label>Old / Original Price (֏) (Optional - for Discount)</label>
              <input
                type="number"
                step="1"
                name="originalPrice"
                placeholder="e.g. 13900"
                value={form.originalPrice || ''}
                onChange={(e) => setForm(prev => ({ ...prev, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined }))}
              />
              <small style={{ color: '#888', display: 'block', marginTop: '4px', fontSize: '0.75rem' }}>The old price to be crossed out (e.g. 13,900). Automatically displays discount badge!</small>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <label className="toggle-row" style={{ width: '100%', marginTop: 'auto' }}>
                <div className="toggle-label">📦 In Stock (Available)</div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={form.inStock !== false} onChange={() => handleToggle('inStock')} />
                  <span className="toggle-slider"></span>
                </label>
              </label>
            </div>
            
            <div className="form-group form-full">
              <label>Description</label>
              <textarea name="description" value={form.description || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ── IMAGES ── */}
        <div className="form-section">
          <h3>Product Images</h3>
          <div className="image-manager">
            {/* Gallery */}
            {(form.images && form.images.length > 0) && (
              <div className="image-grid">
                {form.images.map((img, i) => (
                  <div key={i} className={`image-item ${i === 0 ? 'is-cover' : ''}`}>
                    <img src={img} alt={`Product image ${i+1}`} />
                    {i === 0 ? (
                      <span className="cover-badge">⭐ Main Cover Photo</span>
                    ) : (
                      <button
                        type="button"
                        className="btn-make-cover"
                        onClick={() => makeCoverImage(i)}
                        title="Set as main cover photo for product card"
                      >
                        ⭐ Set Cover
                      </button>
                    )}
                    <button type="button" className="img-remove" onClick={() => removeImage(i)} title="Remove photo">✕</button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add Image Controls */}
            <div className="image-add-area">
              {/* File Upload */}
              <label className="image-upload-btn">
                <span>📁 Upload Image</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              
              {/* URL Input */}
              <div className="image-url-input-wrap">
                <input 
                  type="text" 
                  placeholder="Or paste an image URL here..." 
                  value={imgInput} 
                  onChange={e => setImgInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageURL(); } }}
                />
                <button type="button" onClick={addImageURL}>Add URL</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── PLANT DETAILS & FILTER ATTRIBUTES (For plants) ── */}
        {isPlant && (
          <div className="form-section">
            <h3>🌿 Plant Details & Filter Attributes</h3>
            <div className="form-grid-3">
              {/* 1. Size */}
              <div className="form-group">
                <label>📏 Size Category</label>
                <select name="size" value={form.size || ''} onChange={handleChange}>
                  <option value="">Select size...</option>
                  <option value="S">🪴 Small (S)</option>
                  <option value="M">🌿 Medium (M)</option>
                  <option value="L">🌳 Large (L)</option>
                  <option value="XL">🌴 Extra Large (XL)</option>
                </select>
              </div>

              {/* 2. Light Requirement */}
              <div className="form-group">
                <label>☀️ Light Requirement</label>
                <select name="lightRequirement" value={form.lightRequirement || ''} onChange={handleChange}>
                  <option value="">Select light...</option>
                  <option value="full_sun">☀️ Full Sun</option>
                  <option value="bright_indirect">🌤 Bright Indirect Light</option>
                  <option value="partial_shade">⛅ Partial Shade</option>
                  <option value="low_light">🌑 Low Light</option>
                </select>
              </div>

              {/* 3. Care Difficulty */}
              <div className="form-group">
                <label>🌱 Care Difficulty</label>
                <select name="difficulty" value={form.difficulty || ''} onChange={handleChange}>
                  <option value="">Select difficulty...</option>
                  <option value="easy">🌱 Easy</option>
                  <option value="moderate">🌿 Moderate</option>
                  <option value="advanced">🌳 Advanced</option>
                </select>
              </div>

              {/* 4. Growth Speed */}
              <div className="form-group">
                <label>🚀 Growth Speed</label>
                <select name="growthSpeed" value={form.growthSpeed || ''} onChange={handleChange}>
                  <option value="">Select speed...</option>
                  <option value="slow">🐢 Slow</option>
                  <option value="medium">🌿 Medium</option>
                  <option value="fast">⚡ Fast</option>
                </select>
              </div>

              {/* 5. Placement */}
              <div className="form-group">
                <label>📍 Placement</label>
                <select name="indoorOutdoor" value={form.indoorOutdoor || ''} onChange={handleChange}>
                  <option value="">Select placement...</option>
                  <option value="indoor">🏠 Indoor</option>
                  <option value="outdoor">🌳 Outdoor</option>
                  <option value="both">🏡 Indoor & Outdoor</option>
                </select>
              </div>

              {/* 6. Watering Frequency */}
              <div className="form-group">
                <label>💧 Watering Frequency</label>
                <input name="watering" placeholder="e.g. Once per week, Every 2–3 weeks..." value={form.watering || ''} onChange={handleChange} />
              </div>

              {/* Additional Specs */}
              <div className="form-group">
                <label>📏 Height (e.g. 45–60 cm)</label>
                <input name="height" value={form.height || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>🏺 Pot Diameter (e.g. 17 cm)</label>
                <input name="potDiameter" value={form.potDiameter || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>🌳 Mature Size (e.g. Up to 2m)</label>
                <input name="matureSize" value={form.matureSize || ''} onChange={handleChange} />
              </div>
            </div>

            {/* Toggles */}
            <div style={{ marginTop: '20px' }}>
              <div className="form-grid">
                <div className="toggle-group">
                  <label className="toggle-row">
                    <div className="toggle-label">🐱 Pet Friendly (Non-toxic)</div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={!!form.isPetFriendly} onChange={() => handleToggle('isPetFriendly')} />
                      <span className="toggle-slider"></span>
                    </label>
                  </label>
                </div>
                <div className="toggle-group">
                  <label className="toggle-row">
                    <div className="toggle-label">🍃 Air Purifying</div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={!!form.isAirPurifying} onChange={() => handleToggle('isAirPurifying')} />
                      <span className="toggle-slider"></span>
                    </label>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── DYNAMIC LISTS ── */}
        <div className="form-section">
          <h3>Care Tips & Features</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Key Features (Bullet points)</label>
              <div className="dynamic-list">
                {(form.features || []).map((feat, i) => (
                  <div key={i} className="dynamic-item">
                    <input value={feat} onChange={(e) => handleArrayChange('features', i, e.target.value)} />
                    <button type="button" className="btn-remove-item" onClick={() => removeArrayItem('features', i)}>×</button>
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={() => addArrayItem('features')}>+ Add Feature</button>
              </div>
            </div>

            <div className="form-group">
              <label>Care Tips (Bullet points)</label>
              <div className="dynamic-list">
                {(form.careTips || []).map((tip, i) => (
                  <div key={i} className="dynamic-item">
                    <input value={tip} onChange={(e) => handleArrayChange('careTips', i, e.target.value)} />
                    <button type="button" className="btn-remove-item" onClick={() => removeArrayItem('careTips', i)}>×</button>
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={() => addArrayItem('careTips')}>+ Add Care Tip</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── TAGS ── */}
        <div className="form-section">
          <h3>Tags & Filters</h3>
          <div className="checkbox-grid">
            {['best_seller', 'new_arrival', 'popular', 'top_rated', 'beginner_friendly', 'low_water', 'low_maintenance'].map(tag => (
              <label key={tag} className="checkbox-item">
                <input 
                  type="checkbox" 
                  checked={(form.tags || []).includes(tag as any)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    let newTags = [...(form.tags || [])];
                    if (checked) newTags.push(tag as any);
                    else newTags = newTags.filter(t => t !== tag);
                    setForm(prev => ({ ...prev, tags: newTags }));
                  }}
                />
                <span>{tag.replace('_', ' ').toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
}
