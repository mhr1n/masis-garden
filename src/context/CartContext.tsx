'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '../data/products';

export interface CartItem extends Product {
  cartId: string;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, size?: string, color?: string) => {
    setItems(prev => [
      ...prev,
      {
        ...product,
        cartId: Math.random().toString(36).substr(2, 9),
        selectedSize: size,
        selectedColor: color,
      }
    ]);
  };

  const removeFromCart = (cartId: string) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.length;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
