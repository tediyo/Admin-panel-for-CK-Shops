'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';

interface DisplaySetting {
  id: number;
  setting_key: string;
  setting_value: string;
  description: string;
}

export default function DisplaySettingsManager() {
  const [settings, setSettings] = useState<DisplaySetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/display-settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, value: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/display-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          setting_key: settingKey, 
          setting_value: value,
          description: settings.find(s => s.setting_key === settingKey)?.description || ''
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Setting updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchSettings();
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage('Error updating setting');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (settingKey: string) => {
    const currentSetting = settings.find(s => s.setting_key === settingKey);
    const newValue = currentSetting?.setting_value === 'true' ? 'false' : 'true';
    updateSetting(settingKey, newValue);
  };

  const getSettingValue = (settingKey: string) => {
    const setting = settings.find(s => s.setting_key === settingKey);
    return setting ? setting.setting_value === 'true' : false;
  };

  const getSettingDescription = (settingKey: string) => {
    const setting = settings.find(s => s.setting_key === settingKey);
    return setting ? setting.description : '';
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
          <h2 className="text-3xl font-bold coffee-text-gradient">Display Settings</h2>
          <p className="text-gray-600 mt-1">Control what features are visible to your customers</p>
        </div>
        <button
          onClick={fetchSettings}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { key: 'show_clocks', name: 'World Clocks', description: 'Display different time zones for global customers', icon: Clock },
          { key: 'show_highlights', name: 'Highlight Cards', description: 'Show featured products and special offers', icon: Star },
          { key: 'show_history', name: 'Coffee History', description: 'Display coffee timeline and historical facts', icon: History },
          { key: 'show_facts', name: 'Coffee Facts', description: 'Show interesting coffee trivia and information', icon: Lightbulb },
          { key: 'show_hero_animation', name: 'Hero Animation', description: 'Enable animated effects on the main banner', icon: Settings }
        ].map((setting, index) => {
          const isEnabled = getSettingValue(setting.key);
          const Icon = setting.icon;
          
          return (
            <div key={setting.key} className="card group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${
                    isEnabled 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {setting.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting(setting.key)}
                  className={`toggle-switch ${isEnabled ? 'enabled' : 'disabled'}`}
                >
                  <span className="toggle-switch-thumb" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`badge ${
                  isEnabled ? 'badge-success' : 'badge-error'
                }`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className="text-xs text-gray-500">
                  {isEnabled ? 'Visible to customers' : 'Hidden from customers'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-elevated">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Settings Summary</h3>
            <p className="text-sm text-gray-600">Overview of all display settings</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  setting.setting_value === 'true' ? 'bg-emerald-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <span className="font-semibold text-gray-900 capitalize">
                    {setting.setting_key.replace('show_', '').replace('_', ' ')}
                  </span>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
              </div>
              <span className={`badge ${
                setting.setting_value === 'true' ? 'badge-success' : 'badge-error'
              }`}>
                {setting.setting_value === 'true' ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
