'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

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

interface TicketsContextType {
  tickets: Ticket[];
  addTicket: (userPhone: string, message: string) => Promise<void>;
  replyToTicket: (id: string, reply: string) => Promise<void>;
  closeTicket: (id: string) => Promise<void>;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadTickets = async () => {
    try {
      const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      if (data) {
        const formatted: Ticket[] = data.map(item => {
          let parsedMessages: ChatMessage[] = [];
          try {
            parsedMessages = JSON.parse(item.message);
            if (!Array.isArray(parsedMessages)) throw new Error('Not array');
          } catch {
            // Fallback for old schema
            parsedMessages = [
              { id: `msg_${item.created_at}`, sender: 'user', text: item.message, createdAt: new Date(item.created_at).getTime() }
            ];
          }

          return {
            id: item.id,
            userPhone: item.phone || item.customer_name || 'Unknown',
            messages: parsedMessages,
            status: (item.status as 'open' | 'closed') || 'open',
            updatedAt: new Date(item.created_at).getTime(),
          };
        });
        setTickets(formatted);
      }
    } catch (err) {
      console.error('Failed to load tickets from Supabase', err);
    }
  };

  useEffect(() => {
    loadTickets();

    const channel = supabase
      .channel('public:tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        loadTickets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTicket = async (userPhone: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: message,
      createdAt: Date.now()
    };

    const existingOpenIndex = tickets.findIndex(t => t.userPhone === userPhone && t.status === 'open');

    if (existingOpenIndex >= 0) {
      // Append to existing ticket
      const ticket = tickets[existingOpenIndex];
      const newMessages = [...ticket.messages, newMessage];
      setTickets(prev => prev.map((t, i) => i === existingOpenIndex ? { ...t, messages: newMessages, updatedAt: Date.now() } : t));
      
      await supabase.from('tickets').update({
        message: JSON.stringify(newMessages)
      }).eq('id', ticket.id);
    } else {
      // Create new ticket
      const newTicket: Ticket = {
        id: `TKT-${Date.now()}`,
        userPhone,
        messages: [newMessage],
        status: 'open',
        updatedAt: Date.now(),
      };
      setTickets(prev => [newTicket, ...prev]);

      const row = {
        id: newTicket.id,
        customer_name: userPhone,
        phone: userPhone,
        subject: 'Support Chat',
        message: JSON.stringify(newTicket.messages),
        status: 'open',
      };
      await supabase.from('tickets').insert([row]);
    }
  };

  const replyToTicket = async (id: string, reply: string) => {
    const ticket = tickets.find(t => t.id === id);
    if (!ticket) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'admin',
      text: reply,
      createdAt: Date.now()
    };
    const newMessages = [...ticket.messages, newMessage];
    
    setTickets(prev => prev.map(t => t.id === id ? { ...t, messages: newMessages, updatedAt: Date.now() } : t));
    
    await supabase.from('tickets').update({
      message: JSON.stringify(newMessages)
    }).eq('id', id);
  };

  const closeTicket = async (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed' } : t));
    await supabase.from('tickets').update({ status: 'closed' }).eq('id', id);
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
