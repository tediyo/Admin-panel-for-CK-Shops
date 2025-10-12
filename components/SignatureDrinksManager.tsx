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
  X,
  Check,
  Flame
} from 'lucide-react';
import { SignatureDrink } from '@/lib/models';

export default function SignatureDrinksManager() {
  const [drinks, setDrinks] = useState<SignatureDrink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<SignatureDrink | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [initializing, setInitializing] = useState(false);

  // Form state
  const [drinkForm, setDrinkForm] = useState({
    name: '',
    span: '',
    description: '',
    price: 0,
    category: '',
    rating: 5,
    prepTime: 0,
    image: '',
    ingredients: [] as string[],
    is_active: true,
    sort_order: 0
  });

  const [newIngredient, setNewIngredient] = useState('');

  const categories = [
    { id: 'coffee', name: 'Coffee', icon: '☕' },
    { id: 'cold', name: 'Cold Drinks', icon: '🧊' },
    { id: 'pastry', name: 'Pastries', icon: '🥐' },
    { id: 'specialty', name: 'Specialty', icon: '✨' }
  ];

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const response = await fetch('/api/signature-drinks');
      const data = await response.json();
      if (data.success) {
        setDrinks(data.data);
      }
    } catch (error) {
      console.error('Error fetching drinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDrink = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/signature-drinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingDrink ? { ...drinkForm, _id: editingDrink._id } : drinkForm),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save signature drink');
      }

      await fetchDrinks();
      setShowAddDrink(false);
      setEditingDrink(null);
      resetDrinkForm();
      setMessage('Signature drink saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving drink:', error);
      setMessage('Error saving signature drink');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDrink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this signature drink?')) return;

    try {
      const response = await fetch(`/api/signature-drinks?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete signature drink');
      }

      await fetchDrinks();
      setMessage('Signature drink deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting drink:', error);
      setMessage('Error deleting signature drink');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetDrinkForm = () => {
    setDrinkForm({
      name: '',
      span: '',
      description: '',
      price: 0,
      category: '',
      rating: 5,
      prepTime: 0,
      image: '',
      ingredients: [],
      is_active: true,
      sort_order: 0
    });
    setNewIngredient('');
  };

  const startEditDrink = (drink: SignatureDrink) => {
    setDrinkForm({
      name: drink.name,
      span: drink.span,
      description: drink.description,
      price: drink.price,
      category: drink.category,
      rating: drink.rating,
      prepTime: drink.prepTime,
      image: drink.image,
      ingredients: drink.ingredients,
      is_active: drink.is_active,
      sort_order: drink.sort_order
    });
    setEditingDrink(drink);
    setShowAddDrink(true);
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setDrinkForm(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setDrinkForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const initializeSignatureDrinks = async () => {
    if (!confirm('This will clear all existing signature drinks and replace them with sample data. Continue?')) return;

    setInitializing(true);
    try {
      const response = await fetch('/api/init-signature-drinks', {
        method: 'POST',
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize signature drinks data');
      }

      await fetchDrinks();
      setMessage(`Signature drinks data initialized successfully! Added ${data.data.signatureDrinks} drinks.`);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error initializing signature drinks data:', error);
      setMessage('Error initializing signature drinks data');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setInitializing(false);
    }
  };

  const filteredDrinks = selectedCategory === 'all' 
    ? drinks 
    : drinks.filter(drink => drink.category === selectedCategory);

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
          <h2 className="text-3xl font-bold professional-text-gradient font-serif">Signature Drinks Management</h2>
          <p className="text-amber-700 mt-1">Manage your coffee shop's signature drinks showcase</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchDrinks}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={initializeSignatureDrinks}
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
                <Flame className="h-5 w-5" />
                <span>Init Sample Data</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setShowAddDrink(true);
              setEditingDrink(null);
              resetDrinkForm();
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Drink</span>
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

      {/* Category Filter */}
      <div className="card-elevated">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900">Filter by Category</h3>
            <p className="text-sm text-amber-700">View drinks by category</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            All Drinks
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Signature Drinks Grid */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Signature Drinks</h3>
              <p className="text-sm text-amber-700">Manage your signature drinks showcase</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrinks.map((drink) => (
            <div key={drink._id} className="bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => startEditDrink(drink)}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4 text-amber-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteDrink(drink._id!)}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{drink.name}</h4>
                    <p className="text-amber-600 font-medium">{drink.span}</p>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">${drink.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{drink.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span>{drink.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{drink.prepTime}min</span>
                  </div>
                  <span className="capitalize">{drink.category}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {drink.ingredients.slice(0, 3).map((ingredient, index) => (
                    <span key={index} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      {ingredient}
                    </span>
                  ))}
                  {drink.ingredients.length > 3 && (
                    <span className="text-xs text-gray-500">+{drink.ingredients.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Drink Modal */}
      {showAddDrink && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingDrink ? 'Edit Signature Drink' : 'Add Signature Drink'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddDrink(false);
                    setEditingDrink(null);
                    resetDrinkForm();
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
                    value={drinkForm.name}
                    onChange={(e) => setDrinkForm({ ...drinkForm, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Ethiopian"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Span *</label>
                  <input
                    type="text"
                    value={drinkForm.span}
                    onChange={(e) => setDrinkForm({ ...drinkForm, span: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Yirgacheffe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={drinkForm.price}
                    onChange={(e) => setDrinkForm({ ...drinkForm, price: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    value={drinkForm.category}
                    onChange={(e) => setDrinkForm({ ...drinkForm, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
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
                    value={drinkForm.rating}
                    onChange={(e) => setDrinkForm({ ...drinkForm, rating: parseFloat(e.target.value) || 5 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time (minutes)</label>
                  <input
                    type="number"
                    value={drinkForm.prepTime}
                    onChange={(e) => setDrinkForm({ ...drinkForm, prepTime: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={drinkForm.image}
                    onChange={(e) => setDrinkForm({ ...drinkForm, image: e.target.value })}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={drinkForm.sort_order}
                    onChange={(e) => setDrinkForm({ ...drinkForm, sort_order: parseInt(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={drinkForm.description}
                  onChange={(e) => setDrinkForm({ ...drinkForm, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  placeholder="Drink description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Add ingredient"
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <button
                    onClick={addIngredient}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {drinkForm.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{ingredient}</span>
                      <button
                        onClick={() => removeIngredient(index)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={drinkForm.is_active}
                  onChange={(e) => setDrinkForm({ ...drinkForm, is_active: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddDrink(false);
                  setEditingDrink(null);
                  resetDrinkForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDrink}
                disabled={saving || !drinkForm.name || !drinkForm.span || !drinkForm.description || !drinkForm.category}
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
                    <span>{editingDrink ? 'Update' : 'Create'}</span>
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
