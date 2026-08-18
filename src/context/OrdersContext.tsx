'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

export type PaymentMethod = 'online' | 'cod' | 'bank_transfer';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  note: string;
  isGift?: boolean;
  giftReceiverName?: string;
  giftMessage?: string;
  hidePrice?: boolean;
}

export interface Order {
  id: string;
  customerInfo: CustomerInfo;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  discountApplied?: { code: string; amount: number };
  createdAt: number;
  updatedAt: number;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (
    customerInfo: CustomerInfo, 
    items: CartItem[], 
    total: number, 
    paymentMethod?: PaymentMethod,
    discountApplied?: { code: string; amount: number }
  ) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const STORAGE_KEY = 'ariel_orders_v1';

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setOrders(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load orders', e);
      }
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

  const persist = (next: Order[]) => {
    setOrders(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  };

  const addOrder = (
    customerInfo: CustomerInfo, 
    items: CartItem[], 
    total: number,
    paymentMethod?: PaymentMethod,
    discountApplied?: { code: string; amount: number }
  ) => {
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      customerInfo,
      items,
      total,
      status: 'pending',
      paymentMethod,
      discountApplied,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    persist([...orders, newOrder]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    persist(
      orders.map(o => (o.id === id ? { ...o, status, updatedAt: Date.now() } : o))
    );
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be within OrdersProvider');
  return ctx;
}
