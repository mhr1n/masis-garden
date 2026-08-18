'use client';

import { useState } from 'react';
import { useTickets } from '../../../context/TicketsContext';

export default function TicketsAdminPage() {
  const { tickets, replyToTicket, closeTicket } = useTickets();
  const [replyText, setReplyText] = useState('');
  const [activeTicket, setActiveTicket] = useState<string | null>(null);

  const openTickets = tickets.filter(t => t.status === 'open').sort((a, b) => b.updatedAt - a.updatedAt);
  const closedTickets = tickets.filter(t => t.status === 'closed').sort((a, b) => b.updatedAt - a.updatedAt);

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    replyToTicket(id, replyText);
    setReplyText('');
    setActiveTicket(null);
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Support Tickets</h1>
          <p>Manage and reply to customer inquiries (Conversations stay open until you close them)</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Open Conversations ({openTickets.length})</h2>
        </div>

        {openTickets.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎉</div>
            <h3>All caught up!</h3>
            <p>No open support tickets.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
            {openTickets.map(ticket => (
              <div key={ticket.id} style={{ background: '#131810', border: '1px solid #2a3528', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #2a3528', paddingBottom: '12px' }}>
                  <strong style={{ color: '#c5d8b3', fontSize: '1.1rem' }}>📞 {ticket.userPhone}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#6a7a65' }}>
                    Last updated: {new Date(ticket.updatedAt).toLocaleString()}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
                  {(ticket.messages || []).map(msg => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                      <div key={msg.id} style={{
                        background: isAdmin ? '#1a2018' : '#1e261a',
                        border: `1px solid ${isAdmin ? '#3a4f38' : '#2a3528'}`,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                      }}>
                        {isAdmin && <strong style={{ display: 'block', color: '#8fbc6a', fontSize: '0.8rem', marginBottom: '4px' }}>You</strong>}
                        {!isAdmin && <strong style={{ display: 'block', color: '#9aaa90', fontSize: '0.8rem', marginBottom: '4px' }}>Customer</strong>}
                        <p style={{ color: '#e8eee5', margin: '0', fontSize: '0.95rem', lineHeight: 1.4 }}>{msg.text}</p>
                        <span style={{ fontSize: '0.7rem', color: '#555', marginTop: '6px', display: 'block', textAlign: isAdmin ? 'right' : 'left' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    )
                  })}
                </div>
                
                {activeTicket === ticket.id ? (
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', borderTop: '1px solid #2a3528', paddingTop: '16px' }}>
                    <textarea 
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      style={{ padding: '12px', borderRadius: '8px', background: '#1a2018', border: '1px solid #3a4f38', color: '#e8eee5', minHeight: '80px', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn-cancel-admin" onClick={() => {setActiveTicket(null); setReplyText('');}} style={{ padding: '6px 12px' }}>Cancel</button>
                      <button className="btn-primary-admin" onClick={() => handleReply(ticket.id)} style={{ padding: '6px 12px' }}>Send Reply</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #2a3528', paddingTop: '16px' }}>
                    <button className="btn-primary-admin" onClick={() => setActiveTicket(ticket.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>💬 Reply</button>
                    <button className="btn-cancel-admin" onClick={() => closeTicket(ticket.id)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>🔒 Close Ticket</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {closedTickets.length > 0 && (
        <div className="admin-card" style={{ marginTop: '24px', opacity: 0.7 }}>
          <div className="admin-card-header">
            <h2>Recently Closed</h2>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {closedTickets.slice(0, 5).map(ticket => (
              <div key={ticket.id} style={{ borderBottom: '1px solid #2a3528', paddingBottom: '16px' }}>
                <div style={{ fontSize: '0.9rem', color: '#9aaa90', marginBottom: '8px' }}><strong>📞 {ticket.userPhone}</strong></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(ticket.messages || []).map(msg => (
                    <div key={msg.id} style={{ fontSize: '0.9rem', color: msg.sender === 'admin' ? '#8fbc6a' : '#e8eee5', paddingLeft: msg.sender === 'admin' ? '12px' : '0' }}>
                      <strong>{msg.sender === 'admin' ? 'A: ' : 'Q: '}</strong>
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
