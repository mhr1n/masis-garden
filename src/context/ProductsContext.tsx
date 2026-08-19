'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../data/products';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch all products from Supabase
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      if (data) {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.name,
          botanicalName: item.botanical_name,
          armenianName: item.armenian_name,
          type: item.type,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          inStock: item.in_stock,
          images: item.images || [],
          description: item.description || '',
          careTips: item.care_tips || [],
          features: item.features || [],
          size: item.size,
          height: item.height,
          potDiameter: item.pot_diameter,
          matureSize: item.mature_size,
          lightRequirement: item.light_requirement,
          watering: item.watering,
          temperature: item.temperature,
          humidity: item.humidity,
          difficulty: item.difficulty,
          growthSpeed: item.growth_speed,
          careLevel: item.care_level,
          isPetFriendly: item.is_pet_friendly,
          isAirPurifying: item.is_air_purifying,
          indoorOutdoor: item.indoor_outdoor,
          potIncluded: item.pot_included,
          plantType: item.plant_type,
          leafColor: item.leaf_color,
          suitableLocations: item.suitable_locations || [],
          tags: item.tags || [],
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
    }
  };

  useEffect(() => {
    loadProducts();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        loadProducts(); // Reload on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { data, error } = await supabase.storage
        .from('masis-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('masis-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Failed to upload image:', err);
      return null;
    }
  };

  const addProduct = async (p: Product) => {
    setProducts(prev => [p, ...prev.filter(x => x.id !== p.id)]); // instant UI update
    
    const row = {
      id: p.id,
      name: p.name,
      botanical_name: p.botanicalName,
      armenian_name: p.armenianName,
      type: p.type,
      price: p.price,
      original_price: p.originalPrice,
      in_stock: p.inStock !== false,
      images: p.images || [],
      description: p.description || '',
      care_tips: p.careTips || [],
      features: p.features || [],
      size: p.size,
      height: p.height,
      pot_diameter: p.potDiameter,
      mature_size: p.matureSize,
      light_requirement: p.lightRequirement,
      watering: p.watering,
      temperature: p.temperature,
      humidity: p.humidity,
      difficulty: p.difficulty,
      growth_speed: p.growthSpeed,
      care_level: p.careLevel,
      is_pet_friendly: Boolean(p.isPetFriendly),
      is_air_purifying: Boolean(p.isAirPurifying),
      indoor_outdoor: p.indoorOutdoor || 'indoor',
      pot_included: Boolean(p.potIncluded),
      plant_type: p.plantType,
      leaf_color: p.leafColor,
      suitable_locations: p.suitableLocations || [],
      tags: p.tags || [],
    };
    await supabase.from('products').upsert([row]);
  };

  const updateProduct = async (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
    
    const row = {
      id: p.id,
      name: p.name,
      botanical_name: p.botanicalName,
      armenian_name: p.armenianName,
      type: p.type,
      price: p.price,
      original_price: p.originalPrice,
      in_stock: p.inStock !== false,
      images: p.images || [],
      description: p.description || '',
      care_tips: p.careTips || [],
      features: p.features || [],
      size: p.size,
      height: p.height,
      pot_diameter: p.potDiameter,
      mature_size: p.matureSize,
      light_requirement: p.lightRequirement,
      watering: p.watering,
      temperature: p.temperature,
      humidity: p.humidity,
      difficulty: p.difficulty,
      growth_speed: p.growthSpeed,
      care_level: p.careLevel,
      is_pet_friendly: Boolean(p.isPetFriendly),
      is_air_purifying: Boolean(p.isAirPurifying),
      indoor_outdoor: p.indoorOutdoor || 'indoor',
      pot_included: Boolean(p.potIncluded),
      plant_type: p.plantType,
      leaf_color: p.leafColor,
      suitable_locations: p.suitableLocations || [],
      tags: p.tags || [],
    };
    await supabase.from('products').update(row).eq('id', p.id);
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, uploadImage }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be within ProductsProvider');
  return ctx;
}
