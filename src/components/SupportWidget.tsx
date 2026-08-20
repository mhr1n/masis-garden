'use client';

import { useState } from 'react';
import { useTickets } from '../context/TicketsContext';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const { tickets, addTicket } = useTickets();

  // Find tickets associated with this user
  const userTickets = phone 
    ? tickets.filter(t => t.userPhone === phone).sort((a, b) => a.updatedAt - b.updatedAt)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() && message.trim()) {
      addTicket(phone.trim(), message.trim());
      setMessage('');
    }
  };

  return (
    <div className="support-widget-container" style={{ position: 'fixed', zIndex: 9999 }}>
      <style jsx>{`
        .support-widget-container {
          bottom: 24px;
          right: 24px;
        }
        @media (max-width: 768px) {
          .support-widget-container {
            bottom: 84px;
            right: 16px;
          }
        }
      `}</style>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--color-primary)', color: 'white', border: 'none',
            borderRadius: '50%', width: '60px', height: '60px', fontSize: '24px',
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.65)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '24px', width: '340px', maxWidth: 'calc(100vw - 48px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{ background: 'rgba(74, 92, 63, 0.9)', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.3px' }}>Support Chat</h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>✕</button>
          </div>

          {/* Body */}
          <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {!phone ? (
              <div>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#444', fontWeight: 500 }}>
                  Enter your phone number to start a conversation or check your replies.
                </p>
                <input 
                  type="tel" 
                  placeholder="e.g. 09123456789" 
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.8)', color: '#222', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setPhone((e.target as HTMLInputElement).value);
                    }
                  }}
                  onBlur={e => setPhone(e.target.value)}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'rgba(255,255,255,0.7)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <span style={{ fontSize: '0.85rem', color: '#444' }}><strong>Phone:</strong> {phone}</span>
                  <button onClick={() => setPhone('')} style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: '#4a5c3f', cursor: 'pointer', fontWeight: 600 }}>Change</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', flex: 1 }}>
                  {userTickets.length === 0 ? (
                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-light)', margin: '20px 0' }}>No messages yet. How can we help?</p>
                  ) : (
                    userTickets.map(ticket => (
                      <div key={ticket.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                        {(ticket.messages || []).map((msg, i) => {
                          const isUser = msg.sender === 'user';
                          return (
                            <div key={msg.id} style={{ 
                              background: isUser ? 'rgba(197, 216, 179, 0.5)' : 'rgba(255, 255, 255, 0.8)', 
                              padding: '12px 16px', 
                              borderRadius: '16px', 
                              borderBottomRightRadius: isUser ? '4px' : '16px', 
                              borderBottomLeftRadius: isUser ? '16px' : '4px',
                              alignSelf: isUser ? 'flex-end' : 'flex-start', 
                              maxWidth: '85%', 
                              border: `1px solid ${isUser ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.6)'}`, 
                              backdropFilter: 'blur(10px)',
                              boxShadow: isUser ? 'none' : '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                              {!isUser && (
                                <strong style={{ color: '#4a5c3f', display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>🌿 Ariel Support</strong>
                              )}
                              <p style={{ margin: 0, fontSize: '0.95rem', color: '#1a1a1a', lineHeight: 1.4 }}>{msg.text}</p>
                              <span style={{ fontSize: '0.7rem', color: '#555', marginTop: '6px', display: 'block', textAlign: isUser ? 'right' : 'left' }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          );
                        })}
                        {ticket.status === 'open' && (ticket.messages || []).length > 0 && ticket.messages[ticket.messages.length - 1].sender === 'user' && (
                          <div style={{ fontSize: '0.75rem', color: '#888', alignSelf: 'flex-end', marginRight: '6px', fontStyle: 'italic' }}>
                            Delivered ✔
                          </div>
                        )}
                        {ticket.status === 'closed' && (
                          <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.8rem', color: '#888' }}>
                            Ticket closed
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px', marginTop: 'auto' }}>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    style={{ flex: 1, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '1rem', background: 'rgba(255,255,255,0.8)', color: '#1a1a1a', outline: 'none' }}
                  />
                  <button 
                    type="submit" 
                    disabled={!message.trim()}
                    style={{ background: '#4a5c3f', color: 'white', border: 'none', borderRadius: '8px', padding: '0 20px', fontSize: '1rem', cursor: message.trim() ? 'pointer' : 'not-allowed', opacity: message.trim() ? 1 : 0.5, fontWeight: 600 }}
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
