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

export interface Branch {
  _id?: string;
  id?: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  description?: string;
  amenities?: string[]; // WiFi, Parking, Outdoor Seating, etc.
  is_main_branch?: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface ContactContent {
  _id?: string;
  id?: number;
  section: string; // 'hero', 'form', 'map', etc.
  field: string; // 'title', 'subtitle', 'description', etc.
  value: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ContactSectionSettings {
  _id?: string;
  id?: number;
  section: string; // 'hero', 'branches', 'form', 'map'
  is_visible: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  _id?: string;
  id?: number;
  menuItemId: string; // Reference to menu item
  name: string;
  description: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  category: string;
  image: string;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  calories?: number;
  prepTime?: number;
}

export interface Order {
  _id?: string;
  id?: number;
  orderNumber: string; // Human-readable order number like #ORD-001
  customerId?: string; // Reference to customer
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'pickup' | 'delivery';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  specialInstructions?: string;
  orderTime: Date;
  estimatedReadyTime?: Date;
  actualReadyTime?: Date;
  completedTime?: Date;
  branchId?: string; // Which branch is handling the order
  notes?: string; // Admin notes
  paymentMethod?: 'cash' | 'card' | 'mobile';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  tracking?: OrderTracking[]; // Order tracking history
  created_at: Date;
  updated_at: Date;
}

export interface OrderSettings {
  _id?: string;
  id?: number;
  setting: string; // 'delivery_fee', 'tax_rate', 'prep_time_pickup', 'prep_time_delivery', etc.
  value: string | number;
  description: string;
  is_active: boolean;
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

export interface Customer {
  _id?: string;
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string; // Hashed password
  address?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrderTracking {
  _id?: string;
  id?: number;
  orderId: string; // Reference to order
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  adminNotes?: string;
  customerNotes?: string;
  statusChangedAt: Date;
  changedBy: 'admin' | 'customer';
  created_at: Date;
  updated_at: Date;
}
