'use client';

import { useState, useRef } from 'react';
import { useBlog, BlogPost } from '../../../context/BlogContext';
import Link from 'next/link';
import '../admin.css';

const CATEGORIES = [
  { value: 'care', label: '🌿 Plant Care' },
  { value: 'species', label: '🔬 Species Guide' },
  { value: 'decoration', label: '🖼️ Decoration' },
  { value: 'tips', label: '💡 Tips & Tricks' },
];

const EMPTY: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'> = {
  title: '', titleRu: '', titleAm: '',
  summary: '', summaryRu: '', summaryAm: '',
  content: '', contentRu: '', contentAm: '',
  coverImage: '',
  tags: [],
  category: 'care',
  readTime: 3,
};

export default function AdminBlogPage() {
  const { posts, addPost, updatePost, deletePost } = useBlog();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [tagsInput, setTagsInput] = useState('');
  const [activeTab, setActiveTab] = useState<'en' | 'ru' | 'am'>('en');
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setForm(EMPTY);
    setTagsInput('');
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (post: BlogPost) => {
    setForm({
      title: post.title, titleRu: post.titleRu || '', titleAm: post.titleAm || '',
      summary: post.summary, summaryRu: post.summaryRu || '', summaryAm: post.summaryAm || '',
      content: post.content, contentRu: post.contentRu || '', contentAm: post.contentAm || '',
      coverImage: post.coverImage || '',
      tags: post.tags,
      category: post.category,
      readTime: post.readTime,
    });
    setTagsInput(post.tags.join(', '));
    setEditing(post);
    setCreating(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, coverImage: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const data = { ...form, tags };
    if (editing) {
      updatePost(editing.id, data);
    } else {
      addPost(data);
    }
    setCreating(false);
    setEditing(null);
  };

  const handleDelete = (post: BlogPost) => {
    if (confirm(`Delete "${post.title}"?`)) deletePost(post.id);
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>📖 Blog & Plant Guide</h1>
          <p>Manage educational articles and plant care guides</p>
        </div>
        <button className="btn-primary-admin" onClick={openCreate}>➕ New Article</button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-val">{posts.length}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        {CATEGORIES.map(cat => (
          <div className="stat-card" key={cat.value}>
            <div className="stat-icon">{cat.label.split(' ')[0]}</div>
            <div className="stat-val">{posts.filter(p => p.category === cat.value).length}</div>
            <div className="stat-label">{cat.label.replace(/^[^ ]+ /, '')}</div>
          </div>
        ))}
      </div>

      {/* Form Modal Overlay */}
      {creating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'var(--admin-surface)', borderRadius: '20px', width: '100%', maxWidth: '760px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{editing ? '✏️ Edit Article' : '📝 New Article'}</h2>
              <button onClick={() => setCreating(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>✕</button>
            </div>

            {/* Language Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
              {(['en', 'ru', 'am'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '6px 16px', border: '1.5px solid', borderColor: activeTab === tab ? 'var(--admin-primary)' : 'var(--admin-border)', borderRadius: '50px', background: activeTab === tab ? 'var(--admin-primary)' : 'transparent', color: activeTab === tab ? '#fff' : 'inherit', cursor: 'pointer', fontWeight: 600, fontSize: '0.84rem' }}>
                  {tab === 'en' ? '🇬🇧 English' : tab === 'ru' ? '🇷🇺 Русский' : '🇦🇲 Հայերեն'}
                </button>
              ))}
            </div>

            {/* Title */}
            <div>
              <label className="form-label">Title ({activeTab.toUpperCase()})</label>
              <input className="form-input" value={activeTab === 'en' ? form.title : activeTab === 'ru' ? form.titleRu || '' : form.titleAm || ''}
                onChange={e => setForm(f => ({ ...f, [activeTab === 'en' ? 'title' : activeTab === 'ru' ? 'titleRu' : 'titleAm']: e.target.value }))}
                placeholder="Article title..." />
            </div>

            {/* Summary */}
            <div>
              <label className="form-label">Short Summary ({activeTab.toUpperCase()})</label>
              <textarea className="form-input" rows={2} value={activeTab === 'en' ? form.summary : activeTab === 'ru' ? form.summaryRu || '' : form.summaryAm || ''}
                onChange={e => setForm(f => ({ ...f, [activeTab === 'en' ? 'summary' : activeTab === 'ru' ? 'summaryRu' : 'summaryAm']: e.target.value }))}
                placeholder="Short description shown in listing..." />
            </div>

            {/* Content */}
            <div>
              <label className="form-label">Content ({activeTab.toUpperCase()} — supports Markdown: ## H2, **bold**, - list)</label>
              <textarea className="form-input" rows={12} value={activeTab === 'en' ? form.content : activeTab === 'ru' ? form.contentRu || '' : form.contentAm || ''}
                onChange={e => setForm(f => ({ ...f, [activeTab === 'en' ? 'content' : activeTab === 'ru' ? 'contentRu' : 'contentAm']: e.target.value }))}
                placeholder="## Introduction&#10;&#10;Write your article content here...&#10;&#10;## Watering&#10;&#10;- Water every 1-2 weeks&#10;- Allow soil to dry" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }} />
            </div>

            {/* Category + ReadTime */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Read Time (minutes)</label>
                <input className="form-input" type="number" min={1} max={60} value={form.readTime}
                  onChange={e => setForm(f => ({ ...f, readTime: parseInt(e.target.value) || 3 }))} />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="form-label">Tags (comma separated)</label>
              <input className="form-input" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                placeholder="monstera, watering, tropical, beginner..." />
            </div>

            {/* Cover Image */}
            <div>
              <label className="form-label">Cover Image</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn-cancel-admin" onClick={() => fileRef.current?.click()}>📷 Upload Image</button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
                {form.coverImage && (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={form.coverImage} alt="cover preview" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--admin-border)' }} />
                    <button onClick={() => setForm(f => ({ ...f, coverImage: '' }))}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#c44', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
              <button className="btn-cancel-admin" onClick={() => setCreating(false)}>Cancel</button>
              <button className="btn-primary-admin" onClick={handleSave} disabled={!form.title.trim()}>
                {editing ? '✅ Save Changes' : '✅ Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div style={{ background: 'var(--admin-surface)', borderRadius: '16px', border: '1px solid var(--admin-border)', overflow: 'hidden', marginTop: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--admin-border)' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cover</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Read</th>
              <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>No articles yet. Create your first one!</td></tr>
            )}
            {posts.map((post, i) => (
              <tr key={post.id} style={{ borderBottom: i < posts.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ width: 60, height: 42, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(135deg, #3A4831, #5B6A4A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'rgba(255,255,255,0.4)' }}>
                    {post.coverImage ? <img src={post.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌿'}
                  </div>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{post.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{post.tags.slice(0, 3).map(t => `#${t}`).join(' ')}</div>
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <span style={{ background: 'rgba(74,92,63,0.12)', color: '#3A4831', padding: '4px 12px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600 }}>
                    {CATEGORIES.find(c => c.value === post.category)?.label}
                  </span>
                </td>
                <td style={{ padding: '12px 20px', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>⏱ {post.readTime} min</td>
                <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <Link href={`/en/blog/${post.slug}`} target="_blank" className="btn-cancel-admin" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>👁 View</Link>
                    <button className="btn-cancel-admin" style={{ fontSize: '0.78rem', padding: '6px 12px' }} onClick={() => openEdit(post)}>✏️ Edit</button>
                    <button className="btn-cancel-admin" style={{ fontSize: '0.78rem', padding: '6px 12px', color: '#cc6666', borderColor: '#4d2020' }} onClick={() => handleDelete(post)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
