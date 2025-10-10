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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Highlight Cards Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchCards}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                <div className="flex space-x-1">
                  {card.is_popular && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {card.is_seasonal && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Seasonal
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">{card.description}</p>
              
              {card.price && (
                <p className="text-lg font-bold text-primary-600">{card.price}</p>
              )}
              
              {card.badge && (
                <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                  {card.badge}
                </span>
              )}
            </div>
            
            <div className="mt-4 flex space-x-2">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCard ? 'Edit Card' : 'Add New Card'}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Badge
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            className="input-field"
            placeholder="New, Limited, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_popular}
            onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Popular</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_seasonal}
            onChange={(e) => setFormData({ ...formData, is_seasonal: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Seasonal</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
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
