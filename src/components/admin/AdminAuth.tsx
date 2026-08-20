'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTickets } from '../../context/TicketsContext';
import { useOrders } from '../../context/OrdersContext';

const ADMIN_PASS = '123456';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const pathname = usePathname();
  const { tickets } = useTickets();
  const { orders } = useOrders();

  const openTicketsCount = tickets.filter(t => t.status === 'open').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('admin_auth') === 'true';
    if (isAuthed) setAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-icon">🔒</div>
          <h1>Admin Access</h1>
          <p>Please enter the admin password</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="login-input"
              placeholder="Password..."
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoFocus
            />
            {error && <div className="login-error">Incorrect password</div>}
            <button type="submit" className="btn-primary-admin" style={{ width: '100%', justifyContent: 'center' }}>
              Login
            </button>
          </form>
          <Link href="/en" style={{ display: 'block', marginTop: '20px', color: '#6a7a65', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          🌿 Ariel Admin
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin" className={`sidebar-btn ${pathname === '/admin' ? 'active' : ''}`}>
            📋 All Products
          </Link>
          <Link href="/admin/new" className={`sidebar-btn ${pathname === '/admin/new' ? 'active' : ''}`}>
            ➕ Add Product
          </Link>
          <Link href="/admin/tickets" className={`sidebar-btn ${pathname === '/admin/tickets' ? 'active' : ''}`}>
            🎫 Support
            {openTicketsCount > 0 && <span className="sidebar-badge">{openTicketsCount}</span>}
          </Link>
          <Link href="/admin/orders" className={`sidebar-btn ${pathname === '/admin/orders' ? 'active' : ''}`}>
            📦 Orders
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
