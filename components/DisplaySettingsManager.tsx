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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Display Settings</h2>
        <button
          onClick={fetchSettings}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          'show_clocks',
          'show_highlights',
          'show_history',
          'show_facts',
          'show_hero_animation'
        ].map((settingKey) => {
          const isEnabled = getSettingValue(settingKey);
          const description = getSettingDescription(settingKey);
          
          return (
            <div key={settingKey} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {settingKey.replace('show_', '').replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(settingKey)}
                  className={`ml-4 p-2 rounded-lg transition-colors ${
                    isEnabled 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {isEnabled ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>
              <div className="mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isEnabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Summary</h3>
        <div className="space-y-2">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <span className="font-medium text-gray-900 capitalize">
                  {setting.setting_key.replace('show_', '').replace('_', ' ')}
                </span>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                setting.setting_value === 'true'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
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
