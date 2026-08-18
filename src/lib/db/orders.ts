import { supabase } from '../supabase';

export interface OrderInput {
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  paymentMethod: string;
  totalAmount: number;
  discountAmount?: number;
  items: any[];
  isGift?: boolean;
  giftMessage?: string;
}

export async function saveOrderToDb(order: OrderInput): Promise<string | null> {
  try {
    const id = `ORD-${Date.now()}`;
    const row = {
      id,
      customer_name: order.customerName,
      email: order.email || '',
      phone: order.phone,
      address: order.address,
      city: order.city || 'Yerevan',
      payment_method: order.paymentMethod,
      total_amount: order.totalAmount,
      discount_amount: order.discountAmount || 0,
      status: 'pending',
      items: order.items,
      is_gift: Boolean(order.isGift),
      gift_message: order.giftMessage || '',
    };

    const { error } = await supabase.from('orders').insert([row]);
    if (error) {
      console.error('Error inserting order to Supabase:', error);
      return id; // fallback local ID
    }
    return id;
  } catch (e) {
    console.error('Failed to save order to Supabase:', e);
    return `ORD-${Date.now()}`;
  }
}
