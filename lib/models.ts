// MongoDB Document Interfaces

export interface HomeContent {
  _id?: string;
  section: string;
  field: string;
  value: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CoffeeFact {
  _id?: string;
  fact: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CoffeeHistory {
  _id?: string;
  year: string;
  title: string;
  description: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface HighlightCard {
  _id?: string;
  title: string;
  description: string;
  image_url?: string;
  price?: string;
  badge?: string;
  is_popular: boolean;
  is_seasonal: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface DisplaySetting {
  _id?: string;
  setting_key: string;
  setting_value: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface MenuItem {
  _id?: string;
  id?: number; // For backward compatibility
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  prepTime?: number;
  calories?: number;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface MenuCategory {
  _id?: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SignatureDrink {
  _id?: string;
  id?: number; // For backward compatibility
  name: string;
  span: string;
  image: string;
  ingredients: string[];
  price: number;
  rating: number;
  prepTime: number;
  description: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AboutValue {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  icon: string; // Icon name from Lucide React
  color: string; // Gradient color classes
  bgColor: string; // Background gradient classes
  image?: string; // Optional background image
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AboutMilestone {
  _id?: string;
  id?: number;
  year: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AboutFAQ {
  _id?: string;
  id?: number;
  question: string;
  answer: string;
  category: string;
  icon: string; // Icon name from Lucide React
  helpful: number;
  tags: string[];
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AboutContent {
  _id?: string;
  id?: number;
  section: string; // 'hero', 'story', 'mission', etc.
  field: string; // 'title', 'subtitle', 'description', etc.
  value: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AboutSectionSettings {
  _id?: string;
  id?: number;
  section: string; // 'hero', 'story', 'mission', 'values', 'timeline', 'faq'
  is_visible: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
