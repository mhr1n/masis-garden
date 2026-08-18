import { supabase } from '../supabase';
import type { Product } from '../../data/products';

export async function fetchProductsFromDb(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return [];
    
    return data.map(item => ({
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
  } catch (e) {
    console.error('Error fetching products from Supabase:', e);
    return [];
  }
}

export async function insertProductToDb(product: Product): Promise<boolean> {
  try {
    const row = {
      id: product.id,
      name: product.name,
      botanical_name: product.botanicalName,
      armenian_name: product.armenianName,
      type: product.type,
      price: product.price,
      original_price: product.originalPrice,
      in_stock: product.inStock !== false,
      images: product.images || [],
      description: product.description || '',
      care_tips: product.careTips || [],
      features: product.features || [],
      size: product.size,
      height: product.height,
      pot_diameter: product.potDiameter,
      mature_size: product.matureSize,
      light_requirement: product.lightRequirement,
      watering: product.watering,
      temperature: product.temperature,
      humidity: product.humidity,
      difficulty: product.difficulty,
      growth_speed: product.growthSpeed,
      care_level: product.careLevel,
      is_pet_friendly: Boolean(product.isPetFriendly),
      is_air_purifying: Boolean(product.isAirPurifying),
      indoor_outdoor: product.indoorOutdoor || 'indoor',
      pot_included: Boolean(product.potIncluded),
      plant_type: product.plantType,
      leaf_color: product.leafColor,
      suitable_locations: product.suitableLocations || [],
      tags: product.tags || [],
    };

    const { error } = await supabase.from('products').upsert([row]);
    if (error) {
      console.error('Supabase product insert error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Failed to insert product into Supabase:', e);
    return false;
  }
}
