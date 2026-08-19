'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
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

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const formatted: Order[] = data.map(item => {
          // Parse customer name into firstName and lastName for context compatibility
          const nameParts = item.customer_name ? item.customer_name.split(' ') : [''];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          return {
            id: item.id,
            customerInfo: {
              firstName,
              lastName,
              phone: item.phone || '',
              email: item.email || '',
              city: item.city || '',
              address: item.address || '',
              note: '',
              isGift: item.is_gift,
              giftMessage: item.gift_message || '',
            },
            items: item.items || [],
            total: Number(item.total_amount),
            status: (item.status as OrderStatus) || 'pending',
            paymentMethod: item.payment_method as PaymentMethod,
            discountApplied: item.discount_amount ? { code: 'PROMO', amount: Number(item.discount_amount) } : undefined,
            createdAt: new Date(item.created_at).getTime(),
            updatedAt: new Date(item.created_at).getTime(),
          };
        });
        setOrders(formatted);
      }
    } catch (err) {
      console.error('Failed to load orders from Supabase:', err);
    }
  };

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addOrder = async (
    customerInfo: CustomerInfo, 
    items: CartItem[], 
    total: number,
    paymentMethod?: PaymentMethod,
    discountApplied?: { code: string; amount: number }
  ) => {
    // Note: CheckoutModal.tsx already pushes to the DB directly via saveOrderToDb.
    // However, if called elsewhere, we push it to Supabase here as well.
    const row = {
      id: `ORD-${Date.now()}`,
      customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
      email: customerInfo.email || '',
      phone: customerInfo.phone || '',
      address: customerInfo.address || '',
      city: customerInfo.city || 'Yerevan',
      payment_method: paymentMethod || 'cod',
      total_amount: total,
      discount_amount: discountApplied?.amount || 0,
      status: 'pending',
      items: items,
      is_gift: Boolean(customerInfo.isGift),
      gift_message: customerInfo.giftMessage || '',
    };
    
    await supabase.from('orders').insert([row]);
    // State updates automatically via postgres_changes subscription
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status, updatedAt: Date.now() } : o)));
    await supabase.from('orders').update({ status }).eq('id', id);
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
