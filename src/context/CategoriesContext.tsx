'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
  description?: string;
}

export const defaultCategories: CategoryItem[] = [
  { id: 'plant', name: 'Plants', emoji: '🌱', description: 'Indoor & outdoor living plants' },
  { id: 'pot', name: 'Pots', emoji: '🏺', description: 'Handcrafted ceramic & terracotta planters' },
  { id: 'moss', name: 'Moss Art', emoji: '🖼️', description: 'Zero-maintenance preserved moss wall art' },
  { id: 'decor', name: 'Decor', emoji: '✨', description: 'Botanical decor & accessories' },
  { id: 'gift', name: 'Gifts', emoji: '🎁', description: 'Curated plant gift sets & hampers' },
];

const STORAGE_KEY = 'ariel_categories_v1';

interface CategoriesContextType {
  categories: CategoryItem[];
  addCategory: (cat: CategoryItem) => void;
  updateCategory: (cat: CategoryItem) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CategoryItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure default categories exist
          const storedIds = new Set(parsed.map(c => c.id));
          const missingDefaults = defaultCategories.filter(dc => !storedIds.has(dc.id));
          if (missingDefaults.length > 0) {
            const updated = [...parsed, ...missingDefaults];
            setCategories(updated);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return;
          }
          setCategories(parsed);
          return;
        }
      }
    } catch {}
    setCategories(defaultCategories);
  };

  useEffect(() => {
    loadFromStorage();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadFromStorage();
    };
    const handleCustom = () => loadFromStorage();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage-categories-updated', handleCustom);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage-categories-updated', handleCustom);
    };
  }, []);

  const persist = (next: CategoryItem[]) => {
    setCategories(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('local-storage-categories-updated'));
    } catch (e) {
      console.error('Failed to save categories:', e);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory: (cat) => {
          const updated = [...categories.filter((c) => c.id !== cat.id), cat];
          persist(updated);
        },
        updateCategory: (cat) => {
          const updated = categories.map((c) => (c.id === cat.id ? cat : c));
          persist(updated);
        },
        deleteCategory: (id) => {
          // Keep default plant, pot, moss if attempted
          const updated = categories.filter((c) => c.id !== id);
          persist(updated);
        },
        resetCategories: () => {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {}
          setCategories(defaultCategories);
          window.dispatchEvent(new Event('local-storage-categories-updated'));
        },
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
}
