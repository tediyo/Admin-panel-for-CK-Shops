'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface HomeContent {
  id: number;
  section: string;
  field: string;
  value: string;
  is_active: boolean;
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
    setSaving(true);
    try {
      const response = await fetch('/api/home-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, field, value, is_active: true }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchContent();
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setMessage('Error updating content');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Home Content Management</h2>
        <button
          onClick={fetchContent}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
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

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                onBlur={() => updateContent('hero', field.key, getContentValue('hero', field.key))}
                placeholder={field.placeholder}
                className="input-field min-h-[100px] resize-none"
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-8 rounded-lg">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-amber-800 border border-amber-200/30">
              <span className="font-medium">{getContentValue('hero', 'welcome_text')}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              {getContentValue('hero', 'main_heading')}
            </h1>
            
            <div className="flex items-center justify-center space-x-4 text-amber-700">
              <span className="text-lg font-semibold">{getContentValue('hero', 'rating')}</span>
              <span className="text-amber-600">•</span>
              <span className="text-amber-600">{getContentValue('hero', 'rating_subtitle')}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200">
                {getContentValue('hero', 'primary_button_text')}
              </button>
              <button className="bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-xl font-semibold transition-all duration-200">
                {getContentValue('hero', 'secondary_button_text')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
