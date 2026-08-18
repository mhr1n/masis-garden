export type ProductType = 'plant' | 'pot' | 'moss' | 'decor' | 'gift';
export type LightRequirement = 'full_sun' | 'bright_indirect' | 'partial_shade' | 'low_light';
export type WateringFrequency = string; // e.g., "Once per week"
export type Difficulty = 'easy' | 'moderate' | 'advanced';
export type GrowthSpeed = 'slow' | 'medium' | 'fast';
export type CareLevel = 'easy_care' | 'low_maintenance' | 'moderate_care';
export type Humidity = 'low' | 'medium' | 'high';
export type IndoorOutdoor = 'indoor' | 'outdoor' | 'both';
export type PlantType = 'tropical' | 'succulent' | 'cactus' | 'palm' | 'bonsai' | 'hanging' | 'flowering' | 'foliage';
export type LeafColor = 'green' | 'dark_green' | 'variegated' | 'purple' | 'silver';
export type SuitableLocation = 'bedroom' | 'office' | 'living_room' | 'kitchen' | 'bathroom' | 'balcony';
export type PlantSize = 'S' | 'M' | 'L' | 'XL';
export type Tag = 'best_seller' | 'new_arrival' | 'popular' | 'top_rated' | 'low_maintenance' | 'pet_friendly' | 'air_purifying' | 'low_water' | 'bright_light' | 'beginner_friendly';

export interface Product {
  id: string;
  name: string;
  botanicalName?: string;
  armenianName?: string;
  type: ProductType;
  price: number;
  originalPrice?: number; // Optional crossed-out regular price (for sale/discount display)
  inStock?: boolean;
  images: string[];

  // Description
  description: string;
  careTips?: string[];
  features?: string[];

  // Size
  size?: PlantSize;
  height?: string;        // e.g. "45–60 cm"
  potDiameter?: string;   // e.g. "17 cm"
  matureSize?: string;    // e.g. "Up to 2 meters"

  // Care
  lightRequirement?: LightRequirement;
  watering?: WateringFrequency;
  temperature?: string;   // e.g. "18–27°C"
  humidity?: Humidity;
  difficulty?: Difficulty;
  growthSpeed?: GrowthSpeed;
  careLevel?: CareLevel;

  // Characteristics
  isPetFriendly?: boolean;
  isAirPurifying?: boolean;
  indoorOutdoor?: IndoorOutdoor;
  potIncluded?: boolean;

  // Categorization
  plantType?: PlantType;
  leafColor?: LeafColor;
  suitableLocations?: SuitableLocation[];
  tags?: Tag[];

  // For pots/moss variants
  sizes?: string[];
  colors?: string[];
}

export const products: Product[] = [
  {
    id: 'plant-pineapple',
    name: 'Pineapple',
    botanicalName: 'Ananas comosus',
    armenianName: 'Անանաս',
    type: 'plant',
    price: 14900,
    originalPrice: 19900,
    images: ['/images/monstera-1.png'],
    size: 'M',
    height: '60–100 cm',
    potDiameter: '17 cm',
    matureSize: 'Up to 1 meter',
    description: 'A tropical pineapple plant with bold architectural foliage and a unique edible fruit. It thrives in bright light, adds an exotic touch to interiors, and is ideal for sunny indoor spaces.',
    careTips: [
      'Place in bright, sunny spots.',
      'Water every 7–10 days.',
      'Protect from cold draughts.',
    ],
    features: ['Edible Fruit', 'Exotic', 'Sun Loving'],
    lightRequirement: 'full_sun',
    watering: 'Every 7–10 days',
    temperature: '18–30°C',
    humidity: 'medium',
    difficulty: 'moderate',
    growthSpeed: 'medium',
    careLevel: 'moderate_care',
    isPetFriendly: true,
    isAirPurifying: true,
    indoorOutdoor: 'indoor',
    potIncluded: false,
    plantType: 'tropical',
    leafColor: 'green',
    suitableLocations: ['living_room', 'office'],
    tags: ['top_rated', 'pet_friendly', 'new_arrival'],
  },
];

