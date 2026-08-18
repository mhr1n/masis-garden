'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
  createdAt: number;
}

interface PromoContextType {
  promos: PromoCode[];
  addPromo: (promo: Omit<PromoCode, 'id' | 'createdAt'>) => void;
  removePromo: (id: string) => void;
  togglePromoStatus: (id: string, isActive: boolean) => void;
  validatePromo: (code: string) => PromoCode | null;
}

const STORAGE_KEY = 'ariel_promos_v1';

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export function PromoProvider({ children }: { children: ReactNode }) {
  const [promos, setPromos] = useState<PromoCode[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPromos(JSON.parse(stored));
      } else {
        // Add a default promo for demo purposes
        const defaultPromo: PromoCode = {
          id: 'promo_default',
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          isActive: true,
          createdAt: Date.now()
        };
        setPromos([defaultPromo]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultPromo]));
      }
    } catch (e) {
      console.error('Failed to load promos', e);
    }
  }, []);

  const persist = (next: PromoCode[]) => {
    setPromos(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save promos', e);
    }
  };

  const addPromo = (promo: Omit<PromoCode, 'id' | 'createdAt'>) => {
    const newPromo: PromoCode = {
      ...promo,
      id: `promo_${Date.now()}`,
      createdAt: Date.now(),
    };
    persist([...promos, newPromo]);
  };

  const removePromo = (id: string) => {
    persist(promos.filter(p => p.id !== id));
  };

  const togglePromoStatus = (id: string, isActive: boolean) => {
    persist(promos.map(p => p.id === id ? { ...p, isActive } : p));
  };

  const validatePromo = (code: string): PromoCode | null => {
    const found = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.isActive);
    return found || null;
  };

  return (
    <PromoContext.Provider value={{ promos, addPromo, removePromo, togglePromoStatus, validatePromo }}>
      {children}
    </PromoContext.Provider>
  );
}

export function usePromos() {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error('usePromos must be within PromoProvider');
  return ctx;
}
