'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTickets } from '../../context/TicketsContext';
import { useOrders } from '../../context/OrdersContext';

const ADMIN_PASS = '123456';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { tickets } = useTickets();
  const { orders } = useOrders();

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('admin_auth') === 'true';
    if (isAuthed) setAuthed(true);
  }, []);

  // Close sidebar when clicking a link on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const pwd = (form.elements.namedItem('pwd') as HTMLInputElement).value;
    if (pwd === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e120d' }}>
        <form onSubmit={handleLogin} style={{ background: '#1a2018', padding: '40px', borderRadius: '16px', border: '1px solid #2a3528', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌿</div>
          <h1 style={{ color: '#c5d8b3', margin: '0 0 24px', fontSize: '1.4rem' }}>Admin Access</h1>
          <input type="password" name="pwd" placeholder="Password" style={{ width: '100%', padding: '14px', background: '#0e120d', border: '1px solid #3a4f38', borderRadius: '8px', color: '#fff', marginBottom: '16px' }} autoFocus />
          {error && <p style={{ color: '#e07070', margin: '0 0 16px', fontSize: '0.9rem' }}>Incorrect password</p>}
          <button type="submit" style={{ width: '100%', padding: '14px', background: '#4a5c3f', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="mobile-logo">🌿 Ariel Admin</div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="admin-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          🌿 Ariel Admin
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className={`sidebar-btn ${pathname === '/admin' ? 'active' : ''}`}>
            🪴 All Products
          </Link>
          <Link href="/admin/new" className={`sidebar-btn ${pathname === '/admin/new' ? 'active' : ''}`}>
            ➕ Add Product
          </Link>
          <Link href="/admin/tickets" className={`sidebar-btn ${pathname === '/admin/tickets' ? 'active' : ''}`}>
            💬 Support
            {openTicketsCount > 0 && <span className="sidebar-badge">{openTicketsCount}</span>}
          </Link>
          <Link href="/admin/orders" className={`sidebar-btn ${pathname === '/admin/orders' ? 'active' : ''}`}>
            🛒 Orders
            {pendingOrdersCount > 0 && <span className="sidebar-badge">{pendingOrdersCount}</span>}
          </Link>
          <Link href="/admin/crm" className={`sidebar-btn ${pathname === '/admin/crm' ? 'active' : ''}`}>
            👥 CRM & Customers
          </Link>
          <Link href="/admin/categories" className={`sidebar-btn ${pathname === '/admin/categories' ? 'active' : ''}`}>
            🏷️ Categories
          </Link>
          <Link href="/admin/promos" className={`sidebar-btn ${pathname === '/admin/promos' ? 'active' : ''}`}>
            🎟️ Promos
          </Link>
          <Link href="/admin/emails" className={`sidebar-btn ${pathname === '/admin/emails' ? 'active' : ''}`}>
            📧 Email Campaigns
          </Link>
          
          <div className="sidebar-divider" style={{ margin: '20px 0' }}></div>
          
          <button className="sidebar-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
          <Link href="/en" className="sidebar-btn" target="_blank">
            🌍 View Website
          </Link>
        </nav>
      </aside>
      
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
