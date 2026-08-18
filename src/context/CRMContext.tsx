'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useOrders } from './OrdersContext';

export interface EmailLog {
  id: string;
  date: string;
  subject: string;
  body: string;
  sentBy: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  tag: 'vip' | 'regular' | 'new';
  notes: string;
  emailHistory: EmailLog[];
}

interface CRMContextType {
  customers: Customer[];
  updateCustomerTag: (customerId: string, tag: 'vip' | 'regular' | 'new') => void;
  addCustomerNote: (customerId: string, note: string) => void;
  sendConfirmationEmail: (customerId: string, subject: string, body: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);
const CRM_META_STORAGE_KEY = 'ariel_crm_meta_v1';

export function CRMProvider({ children }: { children: ReactNode }) {
  const { orders } = useOrders();
  const [crmMeta, setCrmMeta] = useState<Record<string, { tag?: 'vip' | 'regular' | 'new'; notes?: string; emailHistory?: EmailLog[] }>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CRM_META_STORAGE_KEY);
      if (stored) setCrmMeta(JSON.parse(stored));
    } catch {}
  }, []);

  const persistMeta = (next: typeof crmMeta) => {
    setCrmMeta(next);
    try {
      localStorage.setItem(CRM_META_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  // Aggregate customers from orders
  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();

    orders.forEach((order) => {
      const info = order.customerInfo;
      if (!info) return;
      const key = (info.email || info.phone || order.id).toLowerCase().trim();
      const existing = map.get(key);

      const meta = crmMeta[key] || {};
      const orderDate = new Date(order.createdAt).toLocaleDateString();

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.total;
        existing.lastOrderDate = orderDate;
      } else {
        const fullName = `${info.firstName || ''} ${info.lastName || ''}`.trim() || 'Customer';
        const defaultTag: 'vip' | 'regular' | 'new' = order.total > 50000 ? 'vip' : 'new';

        map.set(key, {
          id: key,
          name: fullName,
          email: info.email || '',
          phone: info.phone || '',
          city: info.city || '',
          address: info.address || '',
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: orderDate,
          tag: meta.tag || defaultTag,
          notes: meta.notes || '',
          emailHistory: meta.emailHistory || [],
        });
      }
    });

    return Array.from(map.values());
  }, [orders, crmMeta]);

  const updateCustomerTag = (customerId: string, tag: 'vip' | 'regular' | 'new') => {
    const next = {
      ...crmMeta,
      [customerId]: { ...crmMeta[customerId], tag },
    };
    persistMeta(next);
  };

  const addCustomerNote = (customerId: string, notes: string) => {
    const next = {
      ...crmMeta,
      [customerId]: { ...crmMeta[customerId], notes },
    };
    persistMeta(next);
  };

  const sendConfirmationEmail = (customerId: string, subject: string, body: string) => {
    const currentLogs = crmMeta[customerId]?.emailHistory || [];
    const newLog: EmailLog = {
      id: `email_${Date.now()}`,
      date: new Date().toLocaleString(),
      subject,
      body,
      sentBy: 'Admin (Automated)',
    };
    const next = {
      ...crmMeta,
      [customerId]: {
        ...crmMeta[customerId],
        emailHistory: [newLog, ...currentLogs],
      },
    };
    persistMeta(next);
  };

  return (
    <CRMContext.Provider
      value={{
        customers,
        updateCustomerTag,
        addCustomerNote,
        sendConfirmationEmail,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within CRMProvider');
  return ctx;
}
