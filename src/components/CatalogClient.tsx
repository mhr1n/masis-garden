'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '../context/ProductsContext';
import { useCategories } from '../context/CategoriesContext';
import SidebarFilter, { FilterState, defaultFilters } from './SidebarFilter';
import ProductCard from './ProductCard';
import categoryStyles from './CategoryFilterBar.module.css';

export default function CatalogClient({ dict }: { dict: any }) {
  const { products } = useProducts();
  const { categories } = useCategories();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    } else {
      setFilters((prev) => ({ ...prev, category: 'all' }));
    }
  }, [searchParams]);

  const handleCategorySelect = (catId: string) => {
    if (catId !== 'all' && catId !== 'plant') {
      setFilters((prev) => ({
        ...prev,
        category: catId,
        petFriendly: false,
        airPurifying: false,
        difficulty: [],
        lightRequirement: [],
        growthSpeed: [],
        indoorOutdoor: [],
        watering: [],
        plantSize: [],
      }));
    } else {
      setFilters((prev) => ({ ...prev, category: catId }));
    }
  };

  const categoryList = useMemo(() => [
    { id: 'all', name: dict.filter?.allCategories || 'All Products', emoji: '🌿' },
    ...categories,
  ], [categories, dict]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (filters.category !== 'all' && p.type !== filters.category) return false;
        if (p.price > filters.maxPrice) return false;

        // Apply plant-specific filters only for plants / all categories
        const isPlantCategory = filters.category === 'all' || filters.category === 'plant';
        if (isPlantCategory) {
          if (filters.petFriendly && !p.isPetFriendly) return false;
          if (filters.airPurifying && !p.isAirPurifying) return false;
          if (filters.difficulty.length > 0 && (!p.difficulty || !filters.difficulty.includes(p.difficulty))) return false;
          if (filters.lightRequirement.length > 0 && (!p.lightRequirement || !filters.lightRequirement.includes(p.lightRequirement))) return false;
          if (filters.indoorOutdoor.length > 0 && (!p.indoorOutdoor || !filters.indoorOutdoor.includes(p.indoorOutdoor))) return false;
          if (filters.growthSpeed.length > 0 && (!p.growthSpeed || !filters.growthSpeed.includes(p.growthSpeed))) return false;
          if (filters.plantSize.length > 0 && (!p.size || !filters.plantSize.includes(p.size))) return false;
          if (filters.watering.length > 0) {
            const matchesWatering = filters.watering.some((w) => {
              if (!p.watering) return false;
              const wLower = p.watering.toLowerCase();
              if (w === 'low') return wLower.includes('2–3') || wLower.includes('3 weeks') || wLower.includes('sparingly');
              if (w === 'medium') return wLower.includes('week') || wLower.includes('7–10');
              if (w === 'high') return wLower.includes('moist');
              return false;
            });
            if (!matchesWatering) return false;
          }
        }
        return true;
      })
      .sort((a, b) => a.price - b.price);
  }, [products, filters]);

  return (
    <div className="catalog-container">
      {/* Dedicated Top Category Filter Bar */}
      <div className={categoryStyles.container}>
        {categoryList.map((cat) => (
          <button
            key={cat.id}
            className={`${categoryStyles.pill} ${filters.category === cat.id ? categoryStyles.pillActive : ''}`}
            onClick={() => handleCategorySelect(cat.id)}
          >
            <span className={categoryStyles.icon}>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="catalog-wrapper">
        <SidebarFilter
          filters={filters}
          onChange={setFilters}
          dict={dict}
          resultCount={filtered.length}
        />
        <div>
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>🌿 No plants found. Try adjusting filters.</p>
            </div>
          ) : (
            <div className="grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} dictionary={dict} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
