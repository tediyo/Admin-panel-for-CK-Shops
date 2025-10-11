'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, Home, Eye } from 'lucide-react';

interface HomeContent {
  _id?: string;
  id?: number; // For backward compatibility
  section: string;
  field: string;
  value: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export default function HomeContentManager() {
  const [content, setContent] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/home-content');
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, field: string, value: string) => {
    try {
      const response = await fetch('/api/home-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, field, value, is_active: true }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update content');
      }
      return data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const saveAllContent = async () => {
    setSaving(true);
    try {
      // Save all hero section content
      const savePromises = heroFields.map(field => {
        const value = getContentValue('hero', field.key);
        if (value) {
          return updateContent('hero', field.key, value);
        }
        return Promise.resolve();
      });
      
      await Promise.all(savePromises);
      
      // Refresh content after all saves are complete
      await fetchContent();
      
      setMessage('All content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getContentValue = (section: string, field: string) => {
    const item = content.find(c => c.section === section && c.field === field);
    return item ? item.value : '';
  };

  const heroFields = [
    { key: 'welcome_text', label: 'Welcome Text', placeholder: 'Served with Love' },
    { key: 'main_heading', label: 'Main Heading', placeholder: 'Experience the perfect blend...' },
    { key: 'rating', label: 'Rating', placeholder: '4.9/5 from 500+ customers' },
    { key: 'rating_subtitle', label: 'Rating Subtitle', placeholder: 'Loved by many' },
    { key: 'primary_button_text', label: 'Primary Button Text', placeholder: 'Order Now' },
    { key: 'secondary_button_text', label: 'Secondary Button Text', placeholder: 'View Menu' },
  ];

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
          <h2 className="text-3xl font-bold coffee-text-gradient">Home Content Management</h2>
          <p className="text-gray-600 mt-1">Customize your coffee shop's homepage content</p>
        </div>
        <button
          onClick={fetchContent}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Refresh</span>
        </button>
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

      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Hero Section</h3>
              <p className="text-sm text-gray-600">Configure your main landing area</p>
            </div>
          </div>
          <button
            onClick={saveAllContent}
            disabled={saving}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save All</span>
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {heroFields.map((field, index) => (
            <div key={field.key} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {field.label}
              </label>
              <textarea
                value={getContentValue('hero', field.key)}
                onChange={(e) => {
                  const newContent = content.map(c => 
                    c.section === 'hero' && c.field === field.key 
                      ? { ...c, value: e.target.value }
                      : c
                  );
                  setContent(newContent);
                }}
                placeholder={field.placeholder}
                className="input-field min-h-[120px] resize-none"
                rows={4}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card-elevated">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
            <p className="text-sm text-gray-600">See how your content will appear to customers</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-12 rounded-2xl shadow-coffee-lg">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/30 backdrop-blur-sm rounded-full px-8 py-4 text-amber-800 border border-amber-200/40 shadow-lg">
              <span className="font-semibold text-lg">{getContentValue('hero', 'welcome_text') || 'Served with Love'}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              {getContentValue('hero', 'main_heading') || 'Experience the perfect blend...'}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-amber-700">
              <span className="text-xl font-bold">{getContentValue('hero', 'rating') || '4.9/5'}</span>
              <span className="text-amber-600 text-2xl">•</span>
              <span className="text-amber-600 text-lg">{getContentValue('hero', 'rating_subtitle') || 'Loved by many'}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {getContentValue('hero', 'primary_button_text') || 'Order Now'}
              </button>
              <button className="bg-white/80 backdrop-blur-sm border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                {getContentValue('hero', 'secondary_button_text') || 'View Menu'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
