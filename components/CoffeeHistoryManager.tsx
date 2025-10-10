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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Coffee History Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchHistory}
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
            <span>Add Item</span>
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

      {/* Timeline View */}
      <div className="space-y-4">
        {history
          .sort((a, b) => parseInt(a.year) - parseInt(b.year))
          .map((item, index) => (
            <div key={item.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold">{item.year}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(item)}
                        className="p-2 text-gray-400 hover:text-primary-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  
                  {item.image_url && (
                    <div className="mt-3">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
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
