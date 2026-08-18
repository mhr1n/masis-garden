'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt: number;
}

export interface Ticket {
  id: string;
  userPhone: string;
  messages: ChatMessage[];
  status: 'open' | 'closed';
  updatedAt: number;
}

const STORAGE_KEY = 'ariel_tickets_v1';

interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (userPhone: string, message: string) => void;
  replyToTicket: (id: string, reply: string) => void;
  closeTicket: (id: string) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const migrated = parsed.map((t: any) => {
            if (!t.messages) {
              const msgs: ChatMessage[] = [
                { id: `msg_${t.createdAt}`, sender: 'user', text: t.message, createdAt: t.createdAt }
              ];
              if (t.adminReply) {
                msgs.push({ id: `msg_${t.createdAt}_reply`, sender: 'admin', text: t.adminReply, createdAt: t.createdAt + 1000 });
              }
              return { ...t, messages: msgs, updatedAt: t.createdAt };
            }
            return t;
          });
          setTickets(migrated);
        }
      } catch {}
    };

    loadFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const persist = (next: Ticket[]) => {
    setTickets(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const addTicket = (userPhone: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: message,
      createdAt: Date.now()
    };

    const existingOpenIndex = tickets.findIndex(t => t.userPhone === userPhone && t.status === 'open');

    if (existingOpenIndex >= 0) {
      // Append to existing open ticket
      const newTickets = [...tickets];
      newTickets[existingOpenIndex] = {
        ...newTickets[existingOpenIndex],
        messages: [...newTickets[existingOpenIndex].messages, newMessage],
        updatedAt: Date.now()
      };
      persist(newTickets);
    } else {
      // Create new ticket
      const newTicket: Ticket = {
        id: `ticket_${Date.now()}`,
        userPhone,
        messages: [newMessage],
        status: 'open',
        updatedAt: Date.now(),
      };
      persist([...tickets, newTicket]);
    }
  };

  const replyToTicket = (id: string, reply: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'admin',
      text: reply,
      createdAt: Date.now()
    };
    persist(tickets.map(t => t.id === id ? { ...t, messages: [...t.messages, newMessage], updatedAt: Date.now() } : t));
  };

  const closeTicket = (id: string) => {
    persist(tickets.map(t => t.id === id ? { ...t, status: 'closed' } : t));
  };

  return (
    <TicketsContext.Provider value={{ tickets, addTicket, replyToTicket, closeTicket }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error('useTickets must be within TicketsProvider');
  return ctx;
}
