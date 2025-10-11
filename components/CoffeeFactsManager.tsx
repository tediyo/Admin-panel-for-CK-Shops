'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';

interface CoffeeFact {
  _id?: string;
  id?: number; // For backward compatibility
  fact: string;
  is_active: boolean;
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
}

export default function CoffeeFactsManager() {
  const [facts, setFacts] = useState<CoffeeFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFact, setEditingFact] = useState<CoffeeFact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    try {
      const response = await fetch('/api/coffee-facts');
      const data = await response.json();
      if (data.success) {
        setFacts(data.data);
      }
    } catch (error) {
      console.error('Error fetching facts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (factData: Partial<CoffeeFact>) => {
    setSaving(true);
    try {
      const url = editingFact ? '/api/coffee-facts' : '/api/coffee-facts';
      const method = editingFact ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingFact ? { ...factData, id: editingFact._id || editingFact.id } : factData),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(editingFact ? 'Fact updated successfully!' : 'Fact created successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchFacts();
        setShowForm(false);
        setEditingFact(null);
      }
    } catch (error) {
      console.error('Error saving fact:', error);
      setMessage('Error saving fact');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (fact: CoffeeFact) => {
    if (!confirm('Are you sure you want to delete this fact?')) return;

    try {
      const id = fact._id || fact.id;
      const response = await fetch(`/api/coffee-facts?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Fact deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchFacts();
      }
    } catch (error) {
      console.error('Error deleting fact:', error);
      setMessage('Error deleting fact');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const openEditForm = (fact: CoffeeFact) => {
    setEditingFact(fact);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingFact(null);
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
          <h2 className="text-3xl font-bold coffee-text-gradient">Coffee Facts Management</h2>
          <p className="text-gray-600 mt-1">Share interesting coffee knowledge with your customers</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchFacts}
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
            <span>Add Fact</span>
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

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facts.map((fact, index) => (
          <div key={fact.id} className="card group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{fact.fact}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className={`badge ${
                  fact.is_active ? 'badge-success' : 'badge-error'
                }`}>
                  {fact.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  #{fact.sort_order}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => openEditForm(fact)}
                  className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(fact)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingFact ? 'Edit Fact' : 'Add New Fact'}
                </h3>
              </div>
              <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <FactForm
              fact={editingFact}
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

interface FactFormProps {
  fact: CoffeeFact | null;
  onSave: (data: Partial<CoffeeFact>) => void;
  onCancel: () => void;
  saving: boolean;
}

function FactForm({ fact, onSave, onCancel, saving }: FactFormProps) {
  const [formData, setFormData] = useState({
    fact: fact?.fact || '',
    is_active: fact?.is_active !== false,
    sort_order: fact?.sort_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Coffee Fact *
        </label>
        <textarea
          value={formData.fact}
          onChange={(e) => setFormData({ ...formData, fact: e.target.value })}
          className="input-field"
          rows={4}
          placeholder="Enter an interesting coffee fact that will amaze your customers..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="input-field"
            min="0"
            placeholder="0"
          />
        </div>

        <div className="flex items-center justify-center">
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
              <span>Save Fact</span>
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
