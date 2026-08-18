'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products as defaultProducts } from '../data/products';
import type { Product } from '../data/products';

const STORAGE_KEY = 'ariel_products_v3';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge stored products with defaults so any new default products also appear
          const storedIds = new Set(parsed.map(p => p.id));
          const missingDefaults = defaultProducts.filter(dp => !storedIds.has(dp.id));
          setProducts([...parsed, ...missingDefaults]);
          return;
        }
      }
    } catch {}
    setProducts(defaultProducts);
  };

  useEffect(() => {
    loadFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadFromStorage();
      }
    };

    const handleCustomUpdate = () => {
      loadFromStorage();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage-products-updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage-products-updated', handleCustomUpdate);
    };
  }, []);

  const persist = (next: Product[]) => {
    setProducts(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('local-storage-products-updated'));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  };

  return (
    <ProductsContext.Provider value={{
      products,
      addProduct: (p) => {
        const updated = [...products.filter(x => x.id !== p.id), p];
        persist(updated);
      },
      updateProduct: (p) => {
        const updated = products.map(x => x.id === p.id ? p : x);
        persist(updated);
      },
      deleteProduct: (id) => {
        const updated = products.filter(x => x.id !== id);
        persist(updated);
      },
      resetToDefaults: () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
        setProducts(defaultProducts);
        window.dispatchEvent(new Event('local-storage-products-updated'));
      },
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be within ProductsProvider');
  return ctx;
}
