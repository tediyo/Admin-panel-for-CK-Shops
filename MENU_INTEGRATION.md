# Menu Integration Guide

This guide explains how to integrate the menu management system with the coffee shop frontend.

## Overview

The menu management system consists of:
- **Admin Panel**: Manage menu items and categories
- **API Endpoints**: CRUD operations for menu data
- **Public API**: Fetch menu data for the frontend

## API Endpoints

### Admin Endpoints (Protected)
- `GET /api/menu-items` - Fetch all menu items
- `POST /api/menu-items` - Create/update menu item
- `DELETE /api/menu-items?id={id}` - Delete menu item
- `GET /api/menu-categories` - Fetch all categories
- `POST /api/menu-categories` - Create/update category
- `DELETE /api/menu-categories?id={id}` - Delete category
- `POST /api/init-menu` - Initialize with sample data

### Public Endpoints
- `GET /api/public/menu` - Fetch public menu data for frontend

## Frontend Integration

To integrate with the coffee shop frontend, update the menu page to fetch data from the admin panel:

### 1. Update the API call in `coffee-shop/src/lib/api.ts`:

```typescript
export const fetchMenuData = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/public/menu');
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return null;
  }
};
```

### 2. Update the menu page to use dynamic data:

```typescript
// In coffee-shop/src/app/menu/page.tsx
import { fetchMenuData } from '@/lib/api';

export default function MenuPage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuData = async () => {
      const data = await fetchMenuData();
      setMenuData(data);
      setLoading(false);
    };
    loadMenuData();
  }, []);

  if (loading) {
    return <div>Loading menu...</div>;
  }

  // Use menuData.allItems instead of static menuItems array
  const menuItems = menuData?.allItems || [];
  
  // Rest of your component...
}
```

## Data Structure

### MenuItem Interface
```typescript
interface MenuItem {
  _id?: string;
  id?: number;
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
```

### MenuCategory Interface
```typescript
interface MenuCategory {
  _id?: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

## Setup Instructions

1. **Start the admin panel**:
   ```bash
   cd coffee-shop-admin-panel
   npm run dev
   ```

2. **Initialize sample data**:
   - Go to the admin panel dashboard
   - Navigate to "Menu Management" > "Menu Items"
   - Click "Init Sample Data" to populate with sample menu items

3. **Update coffee shop frontend**:
   - Modify the API calls to fetch from the admin panel
   - Update the menu page to use dynamic data
   - Test the integration

## Features

- ✅ Full CRUD operations for menu items and categories
- ✅ Image support for menu items
- ✅ Category filtering and sorting
- ✅ Popular/New item badges
- ✅ Dietary information (Vegan, Gluten-Free)
- ✅ Preparation time and calorie information
- ✅ Rating system
- ✅ Active/Inactive status management
- ✅ Sort order customization
- ✅ Responsive admin interface
- ✅ Real-time preview of changes

## Notes

- The admin panel runs on port 3001 by default
- The coffee shop frontend runs on port 3000 by default
- Make sure both servers are running for full integration
- The public API endpoint doesn't require authentication
- All admin endpoints require authentication


