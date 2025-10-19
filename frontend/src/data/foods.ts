/**
 * Food Database for Virtual Pet System
 * Cultural foods from Korean, Mandarin Chinese, and Universal cuisines
 */

export interface Food {
  id: string;
  name: string;
  emoji: string;
  origin: 'korean' | 'chinese' | 'universal';
  category: 'meal' | 'snack' | 'dessert' | 'drink';
  price: number; // in coins
  happinessBoost: number;
  hungerReduction: number;
  description: string;
  culturalFact?: string;
}

export const FOODS: Food[] = [
  // Korean Foods
  {
    id: 'bibimbap',
    name: 'Bibimbap',
    emoji: '🍲',
    origin: 'korean',
    category: 'meal',
    price: 35,
    happinessBoost: 12,
    hungerReduction: 40,
    description: 'Mixed rice bowl with vegetables and egg',
  },
  {
    id: 'tteokbokki',
    name: 'Tteokbokki',
    emoji: '🍢',
    origin: 'korean',
    category: 'snack',
    price: 25,
    happinessBoost: 10,
    hungerReduction: 30,
    description: 'Spicy rice cakes in sweet-savory sauce',
  },
  {
    id: 'kimchi',
    name: 'Kimchi',
    emoji: '🥬',
    origin: 'korean',
    category: 'snack',
    price: 15,
    happinessBoost: 8,
    hungerReduction: 20,
    description: 'Fermented vegetables with spicy seasoning',
  },
  {
    id: 'bulgogi',
    name: 'Bulgogi',
    emoji: '🥩',
    origin: 'korean',
    category: 'meal',
    price: 40,
    happinessBoost: 14,
    hungerReduction: 45,
    description: 'Sweet marinated beef grilled to perfection',
  },
  {
    id: 'bingsu',
    name: 'Bingsu',
    emoji: '🍧',
    origin: 'korean',
    category: 'dessert',
    price: 30,
    happinessBoost: 15,
    hungerReduction: 25,
    description: 'Shaved ice with sweet toppings and fruit',
  },
  {
    id: 'korean-tea',
    name: 'Korean Tea',
    emoji: '🍵',
    origin: 'korean',
    category: 'drink',
    price: 10,
    happinessBoost: 6,
    hungerReduction: 15,
    description: 'Traditional herbal tea',
  },

  // Chinese Foods
  {
    id: 'peking-duck',
    name: 'Peking Duck',
    emoji: '🦆',
    origin: 'chinese',
    category: 'meal',
    price: 50,
    happinessBoost: 16,
    hungerReduction: 50,
    description: 'Crispy roasted duck served with pancakes',
  },
  {
    id: 'dumplings',
    name: 'Dumplings',
    emoji: '🥟',
    origin: 'chinese',
    category: 'meal',
    price: 30,
    happinessBoost: 12,
    hungerReduction: 35,
    description: 'Steamed or fried pouches filled with meat and vegetables',
  },
  {
    id: 'fried-rice',
    name: 'Fried Rice',
    emoji: '🍚',
    origin: 'chinese',
    category: 'meal',
    price: 25,
    happinessBoost: 10,
    hungerReduction: 35,
    description: 'Stir-fried rice with eggs and vegetables',
  },
  {
    id: 'bao-buns',
    name: 'Bao Buns',
    emoji: '🥟',
    origin: 'chinese',
    category: 'snack',
    price: 20,
    happinessBoost: 9,
    hungerReduction: 28,
    description: 'Soft steamed buns with savory filling',
  },
  {
    id: 'mooncake',
    name: 'Mooncake',
    emoji: '🥮',
    origin: 'chinese',
    category: 'dessert',
    price: 35,
    happinessBoost: 13,
    hungerReduction: 25,
    description: 'Sweet pastry with lotus seed or red bean filling',
  },
  {
    id: 'bubble-tea',
    name: 'Bubble Tea',
    emoji: '🧋',
    origin: 'chinese',
    category: 'drink',
    price: 20,
    happinessBoost: 11,
    hungerReduction: 20,
    description: 'Sweet milk tea with chewy tapioca pearls',
  },
  {
    id: 'spring-rolls',
    name: 'Spring Rolls',
    emoji: '🥢',
    origin: 'chinese',
    category: 'snack',
    price: 18,
    happinessBoost: 8,
    hungerReduction: 25,
    description: 'Crispy fried rolls with vegetables',
  },

  // Universal Foods (available worldwide)
  {
    id: 'pizza',
    name: 'Pizza',
    emoji: '🍕',
    origin: 'universal',
    category: 'meal',
    price: 30,
    happinessBoost: 11,
    hungerReduction: 38,
    description: 'Cheesy flatbread with delicious toppings',
  },
  {
    id: 'burger',
    name: 'Burger',
    emoji: '🍔',
    origin: 'universal',
    category: 'meal',
    price: 28,
    happinessBoost: 10,
    hungerReduction: 36,
    description: 'Grilled patty in a soft bun',
  },
  {
    id: 'sushi',
    name: 'Sushi',
    emoji: '🍣',
    origin: 'universal',
    category: 'meal',
    price: 40,
    happinessBoost: 13,
    hungerReduction: 35,
    description: 'Fresh fish with seasoned rice',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    emoji: '🍝',
    origin: 'universal',
    category: 'meal',
    price: 32,
    happinessBoost: 11,
    hungerReduction: 40,
    description: 'Italian noodles with savory sauce',
  },
  {
    id: 'salad',
    name: 'Fresh Salad',
    emoji: '🥗',
    origin: 'universal',
    category: 'meal',
    price: 20,
    happinessBoost: 7,
    hungerReduction: 30,
    description: 'Crispy vegetables with dressing',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    emoji: '🍪',
    origin: 'universal',
    category: 'dessert',
    price: 15,
    happinessBoost: 9,
    hungerReduction: 18,
    description: 'Sweet baked treats',
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream',
    emoji: '🍦',
    origin: 'universal',
    category: 'dessert',
    price: 18,
    happinessBoost: 12,
    hungerReduction: 20,
    description: 'Frozen sweet cream in many flavors',
  },
  {
    id: 'smoothie',
    name: 'Fruit Smoothie',
    emoji: '🥤',
    origin: 'universal',
    category: 'drink',
    price: 22,
    happinessBoost: 10,
    hungerReduction: 22,
    description: 'Blended fruit with yogurt',
  },
  {
    id: 'popcorn',
    name: 'Popcorn',
    emoji: '🍿',
    origin: 'universal',
    category: 'snack',
    price: 12,
    happinessBoost: 7,
    hungerReduction: 15,
    description: 'Fluffy popped corn kernels',
  },
  {
    id: 'fruit-bowl',
    name: 'Fruit Bowl',
    emoji: '🍇',
    origin: 'universal',
    category: 'snack',
    price: 16,
    happinessBoost: 8,
    hungerReduction: 20,
    description: 'Fresh mixed fruits',
  },
];

// Helper functions to filter foods
export function getFoodsByOrigin(origin: 'korean' | 'chinese' | 'universal'): Food[] {
  return FOODS.filter((food) => food.origin === origin);
}

export function getFoodsByCategory(category: 'meal' | 'snack' | 'dessert' | 'drink'): Food[] {
  return FOODS.filter((food) => food.category === category);
}

export function getFoodById(id: string): Food | undefined {
  return FOODS.find((food) => food.id === id);
}

// Get affordable foods based on user's coin balance
export function getAffordableFoods(coins: number): Food[] {
  return FOODS.filter((food) => food.price <= coins);
}
