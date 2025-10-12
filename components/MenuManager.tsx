'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  RefreshCw, 
  Coffee, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Clock, 
  Heart,
  TrendingUp,
  Award,
  X,
  Check
} from 'lucide-react';
import { MenuItem, MenuCategory } from '@/lib/models';

export default function MenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [initializing, setInitializing] = useState(false);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    rating: 5,
    image: '',
    isPopular: false,
    isNew: false,
    prepTime: 0,
    calories: 0,
    isVegan: false,
    isGlutenFree: false,
    is_active: true,
    sort_order: 0
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/menu-items'),
        fetch('/api/menu-categories')
      ]);

      const [itemsData, categoriesData] = await Promise.all([
        itemsResponse.json(),
        categoriesResponse.json()
      ]);

      if (itemsData.success) {
        setMenuItems(itemsData.data);
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem ? { ...itemForm, _id: editingItem._id } : itemForm),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save menu item');
      }

      await fetchData();
      setShowAddItem(false);
      setEditingItem(null);
      resetItemForm();
      setMessage('Menu item saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving menu item:', error);
      setMessage('Error saving menu item');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/menu-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCategory ? { ...categoryForm, _id: editingCategory._id } : categoryForm),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save category');
      }

      await fetchData();
      setShowAddCategory(false);
      setEditingCategory(null);
      resetCategoryForm();
      setMessage('Category saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving category:', error);
      setMessage('Error saving category');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await fetch(`/api/menu-items?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete menu item');
      }

      await fetchData();
      setMessage('Menu item deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setMessage('Error deleting menu item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/menu-categories?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete category');
      }

      await fetchData();
      setMessage('Category deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting category:', error);
      setMessage('Error deleting category');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const initializeMenuData = async () => {
    if (!confirm('This will clear all existing menu data and replace it with sample data. Continue?')) return;

    setInitializing(true);
    try {
      const response = await fetch('/api/init-menu', {
        method: 'POST',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize menu data');
      }

      await fetchData();
      setMessage(`Menu data initialized successfully! Added ${data.data.categories} categories and ${data.data.menuItems} menu items.`);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error initializing menu data:', error);
      setMessage('Error initializing menu data');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setInitializing(false);
    }
  };

  const resetItemForm = () => {
    setItemForm({
      name: '',
      description: '',
      price: 0,
      category: '',
      rating: 5,
      image: '',
      isPopular: false,
      isNew: false,
      prepTime: 0,
      calories: 0,
      isVegan: false,
      isGlutenFree: false,
      is_active: true,
      sort_order: 0
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      sort_order: 0,
      is_active: true
    });
  };

  const startEditItem = (item: MenuItem) => {
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      rating: item.rating,
      image: item.image,
      isPopular: item.isPopular || false,
      isNew: item.isNew || false,
      prepTime: item.prepTime || 0,
      calories: item.calories || 0,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      is_active: item.is_active,
      sort_order: item.sort_order
    });
    setEditingItem(item);
    setShowAddItem(true);
  };

  const startEditCategory = (category: MenuCategory) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      sort_order: category.sort_order,
      is_active: category.is_active
    });
    setEditingCategory(category);
    setShowAddCategory(true);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold professional-text-gradient font-serif">Menu Management</h2>
          <p className="text-amber-700 mt-1">Manage your coffee shop's menu items and categories</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchData}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={initializeMenuData}
            disabled={initializing}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            {initializing ? (
              <>
                <div className="spinner" />
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <Coffee className="h-5 w-5" />
                <span>Init Sample Data</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowAddCategory(true);
              setEditingCategory(null);
              resetCategoryForm();
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => {
              setShowAddItem(true);
              setEditingItem(null);
              resetItemForm();
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {/* Categories Section */}
      <div className="card-elevated">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <Coffee className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900">Categories</h3>
            <p className="text-sm text-amber-700">Manage menu categories</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category._id} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditCategory(category)}
                    className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id!)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Menu Items</h3>
              <p className="text-sm text-amber-700">Manage your menu items</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {item.isPopular && (
                    <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}
                  {item.isNew && (
                    <div className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      <Award className="h-3 w-3" />
                      <span>New</span>
                    </div>
                  )}
                </div>
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => startEditItem(item)}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-amber-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id!)}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                  <span className="text-2xl font-bold text-amber-600">${item.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                  {item.prepTime > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.prepTime}min</span>
                    </div>
                  )}
                  {item.calories > 0 && (
                    <span>{item.calories} cal</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {item.isVegan && <span className="text-green-600 text-xs">🌱</span>}
                  {item.isGlutenFree && <span className="text-blue-600 text-xs">GF</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddItem(false);
                    setEditingItem(null);
                    resetItemForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={itemForm.rating}
                    onChange={(e) => setItemForm({ ...itemForm, rating: parseFloat(e.target.value) || 5 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time (minutes)</label>
                  <input
                    type="number"
                    value={itemForm.prepTime}
                    onChange={(e) => setItemForm({ ...itemForm, prepTime: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                  <input
                    type="number"
                    value={itemForm.calories}
                    onChange={(e) => setItemForm({ ...itemForm, calories: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={itemForm.sort_order}
                    onChange={(e) => setItemForm({ ...itemForm, sort_order: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Item description"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={itemForm.isPopular}
                    onChange={(e) => setItemForm({ ...itemForm, isPopular: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Popular</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={itemForm.isNew}
                    onChange={(e) => setItemForm({ ...itemForm, isNew: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">New</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={itemForm.isVegan}
                    onChange={(e) => setItemForm({ ...itemForm, isVegan: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Vegan</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={itemForm.isGlutenFree}
                    onChange={(e) => setItemForm({ ...itemForm, isGlutenFree: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Gluten Free</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setEditingItem(null);
                  resetItemForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={saving || !itemForm.name || !itemForm.description || !itemForm.category}
                className="btn-primary disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{editingItem ? 'Update' : 'Create'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingCategory ? 'Edit Category' : 'Add Category'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setEditingCategory(null);
                    resetCategoryForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="input-field min-h-[80px]"
                  placeholder="Category description"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={categoryForm.sort_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={categoryForm.is_active}
                  onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={saving || !categoryForm.name}
                className="btn-primary disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{editingCategory ? 'Update' : 'Create'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
