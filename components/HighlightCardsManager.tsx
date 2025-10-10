'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';

interface HighlightCard {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: string;
  badge: string;
  is_popular: boolean;
  is_seasonal: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function HighlightCardsManager() {
  const [cards, setCards] = useState<HighlightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<HighlightCard | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/highlight-cards');
      const data = await response.json();
      if (data.success) {
        setCards(data.data);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (cardData: Partial<HighlightCard>) => {
    setSaving(true);
    try {
      const url = editingCard ? '/api/highlight-cards' : '/api/highlight-cards';
      const method = editingCard ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCard ? { ...cardData, id: editingCard.id } : cardData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingCard ? 'Card updated successfully!' : 'Card created successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchCards();
        setShowForm(false);
        setEditingCard(null);
      }
    } catch (error) {
      console.error('Error saving card:', error);
      setMessage('Error saving card');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const response = await fetch(`/api/highlight-cards?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Card deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchCards();
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      setMessage('Error deleting card');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openEditForm = (card: HighlightCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCard(null);
  };

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
          <h2 className="text-3xl font-bold coffee-text-gradient">Highlight Cards Management</h2>
          <p className="text-gray-600 mt-1">Create and manage featured product cards</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchCards}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Card</span>
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div key={card.id} className="card group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative mb-6 overflow-hidden rounded-xl">
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500 font-medium">No image</span>
                  </div>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                {card.is_popular && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                    Popular
                  </span>
                )}
                {card.is_seasonal && (
                  <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                    Seasonal
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                {card.price && (
                  <p className="text-2xl font-bold coffee-text-gradient">{card.price}</p>
                )}
                {card.badge && (
                  <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-semibold">
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => openEditForm(card)}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                className="btn-danger flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCard ? 'Edit Card' : 'Add New Card'}
                </h3>
              </div>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <CardForm
              card={editingCard}
              onSave={handleSave}
              onCancel={closeForm}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface CardFormProps {
  card: HighlightCard | null;
  onSave: (data: Partial<HighlightCard>) => void;
  onCancel: () => void;
  saving: boolean;
}

function CardForm({ card, onSave, onCancel, saving }: CardFormProps) {
  const [formData, setFormData] = useState({
    title: card?.title || '',
    description: card?.description || '',
    image_url: card?.image_url || '',
    price: card?.price || '',
    badge: card?.badge || '',
    is_popular: card?.is_popular || false,
    is_seasonal: card?.is_seasonal || false,
    is_active: card?.is_active !== false,
    sort_order: card?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            placeholder="Enter card title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Price
          </label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="input-field"
            placeholder="$X.XX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          rows={3}
          placeholder="Describe your product or offer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="input-field"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Badge
        </label>
        <input
          type="text"
          value={formData.badge}
          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          className="input-field"
          placeholder="New, Limited, Special, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_popular}
            onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
          />
          <span className="text-sm font-semibold text-gray-700">Popular</span>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_seasonal}
            onChange={(e) => setFormData({ ...formData, is_seasonal: e.target.checked })}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span className="text-sm font-semibold text-gray-700">Seasonal</span>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
          />
          <span className="text-sm font-semibold text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex space-x-3 pt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="spinner" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Card</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
