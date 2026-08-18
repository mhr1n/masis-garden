'use client';

import { useState, useCallback } from 'react';
import styles from './SidebarFilter.module.css';
import { useCategories } from '../context/CategoriesContext';

export interface FilterState {
  category: string;
  petFriendly: boolean;
  airPurifying: boolean;
  difficulty: string[];
  lightRequirement: string[];
  growthSpeed: string[];
  indoorOutdoor: string[];
  watering: string[];
  plantSize: string[];
  maxPrice: number;
}

const defaultFilters: FilterState = {
  category: 'all',
  petFriendly: false,
  airPurifying: false,
  difficulty: [],
  lightRequirement: [],
  growthSpeed: [],
  indoorOutdoor: [],
  watering: [],
  plantSize: [],
  maxPrice: 200000,
};

interface SidebarFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  dict: any;
  resultCount: number;
}

export default function SidebarFilter({ filters, onChange, dict, resultCount }: SidebarFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories: dynamicCategories } = useCategories();

  const update = useCallback(
    (partial: Partial<FilterState>) => onChange({ ...filters, ...partial }),
    [filters, onChange]
  );

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const showPlantFilters = filters.category === 'all' || filters.category === 'plant';

  const handleCategorySelect = (key: string) => {
    if (key !== 'all' && key !== 'plant') {
      // Clear plant-specific filters when switching to non-plant categories
      update({
        category: key,
        petFriendly: false,
        airPurifying: false,
        difficulty: [],
        lightRequirement: [],
        growthSpeed: [],
        indoorOutdoor: [],
        watering: [],
        plantSize: [],
      });
    } else {
      update({ category: key });
    }
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.maxPrice < 200000 ||
    (showPlantFilters &&
      (filters.petFriendly ||
        filters.airPurifying ||
        filters.difficulty.length > 0 ||
        filters.lightRequirement.length > 0 ||
        filters.growthSpeed.length > 0 ||
        filters.indoorOutdoor.length > 0 ||
        filters.watering.length > 0 ||
        filters.plantSize.length > 0));

  const categoryList = [
    { key: 'all', label: '🌿 ' + dict.filter.allCategories },
    ...dynamicCategories.map(c => ({ key: c.id, label: `${c.emoji} ${c.name}` })),
  ];

  const lightOptions = [
    { key: 'full_sun', label: '☀️ ' + dict.care.light_full_sun },
    { key: 'bright_indirect', label: '🌤 ' + dict.care.light_bright_indirect },
    { key: 'partial_shade', label: '⛅ ' + dict.care.light_partial_shade },
    { key: 'low_light', label: '🌑 ' + dict.care.light_low_light },
  ];

  const difficultyOptions = [
    { key: 'easy', label: '🌱 ' + dict.care.difficulty_easy },
    { key: 'moderate', label: '🌿 ' + dict.care.difficulty_moderate },
    { key: 'advanced', label: '🌳 ' + dict.care.difficulty_advanced },
  ];

  const growthOptions = [
    { key: 'slow', label: '🐢 ' + dict.care.growth_slow },
    { key: 'medium', label: '🌿 ' + dict.care.growth_medium },
    { key: 'fast', label: '⚡ ' + dict.care.growth_fast },
  ];

  const placementOptions = [
    { key: 'indoor', label: '🏠 ' + dict.care.indoor },
    { key: 'outdoor', label: '🌳 ' + dict.care.outdoor },
    { key: 'both', label: '🏡 ' + dict.care.both },
  ];

  const wateringOptions = [
    { key: 'low', label: '🌵 Low Water (Every 2–3 weeks)' },
    { key: 'medium', label: '💧 Regular Water (Once a week)' },
    { key: 'high', label: '🌊 Frequent Water (Keep moist)' },
  ];

  const sizeOptions = [
    { key: 'S', label: '🪴 Small (S)' },
    { key: 'M', label: '🌿 Medium (M)' },
    { key: 'L', label: '🌳 Large (L)' },
    { key: 'XL', label: '🌴 Extra Large (XL)' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h10M4 18h7"/>
        </svg>
        {dict.filter.title}
        {hasActiveFilters && <span className={styles.activeDot} />}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3>🔍 {dict.filter.title}</h3>
          <div className={styles.headerActions}>
            {hasActiveFilters && (
              <button className={styles.clearBtn} onClick={() => onChange(defaultFilters)}>
                {dict.filter.clearAll}
              </button>
            )}
            <button className={styles.closeSidebarBtn} onClick={() => setIsOpen(false)} aria-label="Close filters">
              ✕
            </button>
          </div>
        </div>

        <p className={styles.resultCount}>
          {resultCount} {dict.filter.resultsCount}
        </p>

        {/* Price Range (Always visible) */}

        {/* 2. Price Range (Always visible) */}
        <div className={styles.section}>
          <h4>💰 {dict.filter.priceRange}</h4>
          <div className={styles.priceRow}>
            <span>1,000 ֏</span>
            <span>{filters.maxPrice.toLocaleString()} ֏</span>
          </div>
          <input
            type="range"
            min={1000}
            max={200000}
            step={1000}
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: Number(e.target.value) })}
            className={styles.rangeInput}
          />
        </div>

        {/* Plant-Specific Filters (Only visible for Plants / All) */}
        {showPlantFilters && (
          <>
            {/* 3 & 4. Toggles: Pet Friendly & Air Purifying */}
            <div className={styles.section}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={filters.petFriendly}
                  onChange={(e) => update({ petFriendly: e.target.checked })}
                />
                <span className={styles.toggleSlider} />
                <span className={styles.toggleLabel}>🐱 {dict.filter.petFriendly}</span>
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={filters.airPurifying}
                  onChange={(e) => update({ airPurifying: e.target.checked })}
                />
                <span className={styles.toggleSlider} />
                <span className={styles.toggleLabel}>🍃 {dict.filter.airPurifying}</span>
              </label>
            </div>

            {/* 5. Light Requirement */}
            <div className={styles.section}>
              <h4>☀️ {dict.filter.light}</h4>
              {lightOptions.map(({ key, label }) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.lightRequirement.includes(key)}
                    onChange={() => update({ lightRequirement: toggleArray(filters.lightRequirement, key) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* 6. Care Difficulty */}
            <div className={styles.section}>
              <h4>🌱 {dict.filter.difficulty}</h4>
              {difficultyOptions.map(({ key, label }) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.difficulty.includes(key)}
                    onChange={() => update({ difficulty: toggleArray(filters.difficulty, key) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* 7. Growth Speed */}
            <div className={styles.section}>
              <h4>🚀 {dict.filter.growthSpeed}</h4>
              {growthOptions.map(({ key, label }) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.growthSpeed.includes(key)}
                    onChange={() => update({ growthSpeed: toggleArray(filters.growthSpeed, key) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* 8. Placement */}
            <div className={styles.section}>
              <h4>📍 {dict.filter.indoorOutdoor}</h4>
              {placementOptions.map(({ key, label }) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.indoorOutdoor.includes(key)}
                    onChange={() => update({ indoorOutdoor: toggleArray(filters.indoorOutdoor, key) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* 9. Watering */}
            <div className={styles.section}>
              <h4>💧 {dict.care.watering}</h4>
              {wateringOptions.map(({ key, label }) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.watering.includes(key)}
                    onChange={() => update({ watering: toggleArray(filters.watering, key) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* 10. Plant Size */}
            <div className={styles.section}>
              <h4>📏 {dict.filter.plantSize}</h4>
              {sizeOptions.map(({ key, label }) => (
                <label key={key} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.plantSize.includes(key)}
                    onChange={() => update({ plantSize: toggleArray(filters.plantSize, key) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export { defaultFilters };
