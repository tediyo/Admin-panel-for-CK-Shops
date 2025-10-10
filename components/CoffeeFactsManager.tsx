'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';

interface CoffeeFact {
  id: number;
  fact: string;
  is_active: boolean;
  sort_order: number;
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
        body: JSON.stringify(editingFact ? { ...factData, id: editingFact.id } : factData),
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fact?')) return;

    try {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Coffee Facts Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchFacts}
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
            <span>Add Fact</span>
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

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact) => (
          <div key={fact.id} className="card">
            <div className="flex items-start justify-between">
              <p className="text-gray-700 flex-1">{fact.fact}</p>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => openEditForm(fact)}
                  className="p-2 text-gray-400 hover:text-primary-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(fact.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                fact.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {fact.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-gray-500">Order: {fact.sort_order}</span>
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
                {editingFact ? 'Edit Fact' : 'Add New Fact'}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fact *
        </label>
        <textarea
          value={formData.fact}
          onChange={(e) => setFormData({ ...formData, fact: e.target.value })}
          className="input-field"
          rows={4}
          placeholder="Enter an interesting coffee fact..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="input-field"
            min="0"
          />
        </div>

        <div className="flex items-center justify-center">
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
