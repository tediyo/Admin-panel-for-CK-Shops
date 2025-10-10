'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';

interface CoffeeHistory {
  id: number;
  year: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export default function CoffeeHistoryManager() {
  const [history, setHistory] = useState<CoffeeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CoffeeHistory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/coffee-history');
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData: Partial<CoffeeHistory>) => {
    setSaving(true);
    try {
      const url = editingItem ? '/api/coffee-history' : '/api/coffee-history';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem ? { ...itemData, id: editingItem.id } : itemData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingItem ? 'History item updated successfully!' : 'History item created successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchHistory();
        setShowForm(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving history item:', error);
      setMessage('Error saving history item');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this history item?')) return;

    try {
      const response = await fetch(`/api/coffee-history?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('History item deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchHistory();
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
      setMessage('Error deleting history item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openEditForm = (item: CoffeeHistory) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
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
          <h2 className="text-3xl font-bold coffee-text-gradient">Coffee History Management</h2>
          <p className="text-gray-600 mt-1">Create a timeline of coffee's rich history</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchHistory}
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

      {/* Timeline View */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-200"></div>
        
        <div className="space-y-8">
          {history
            .sort((a, b) => parseInt(a.year) - parseInt(b.year))
            .map((item, index) => (
              <div key={item.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                <div className="ml-16 card group hover:scale-105 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                        {item.year}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`badge ${
                            item.is_active ? 'badge-success' : 'badge-error'
                          }`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">{item.description}</p>
                  
                  {item.image_url && (
                    <div className="mb-4">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full max-w-md h-48 object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit History Item' : 'Add New History Item'}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <HistoryForm
              item={editingItem}
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

interface HistoryFormProps {
  item: CoffeeHistory | null;
  onSave: (data: Partial<CoffeeHistory>) => void;
  onCancel: () => void;
  saving: boolean;
}

function HistoryForm({ item, onSave, onCancel, saving }: HistoryFormProps) {
  const [formData, setFormData] = useState({
    year: item?.year || '',
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    is_active: item?.is_active !== false,
    sort_order: item?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Year *
        </label>
        <input
          type="text"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="input-field"
          placeholder="e.g., 1500s, 1600s, 1900s"
          required
        />
      </div>

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
          rows={4}
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

      <div>
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
