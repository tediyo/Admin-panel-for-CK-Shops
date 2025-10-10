'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Coffee, 
  Home, 
  Settings, 
  Star, 
  Clock, 
  History, 
  Lightbulb,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import HomeContentManager from '@/components/HomeContentManager';
import DisplaySettingsManager from '@/components/DisplaySettingsManager';
import HighlightCardsManager from '@/components/HighlightCardsManager';
import CoffeeHistoryManager from '@/components/CoffeeHistoryManager';
import CoffeeFactsManager from '@/components/CoffeeFactsManager';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home-content');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/');
      return;
    }

    // Decode token to get user info (in a real app, verify the token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        id: payload.userId,
        username: payload.username,
        email: payload.email || '',
        role: payload.role
      });
    } catch (error) {
      localStorage.removeItem('admin_token');
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/');
  };

  const tabs = [
    { id: 'home-content', name: 'Home Content', icon: Home },
    { id: 'display-settings', name: 'Display Settings', icon: Settings },
    { id: 'highlight-cards', name: 'Highlight Cards', icon: Star },
    { id: 'coffee-history', name: 'Coffee History', icon: History },
    { id: 'coffee-facts', name: 'Coffee Facts', icon: Lightbulb },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home-content':
        return <HomeContentManager />;
      case 'display-settings':
        return <DisplaySettingsManager />;
      case 'highlight-cards':
        return <HighlightCardsManager />;
      case 'coffee-history':
        return <CoffeeHistoryManager />;
      case 'coffee-facts':
        return <CoffeeFactsManager />;
      default:
        return <HomeContentManager />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {tabs.find(tab => tab.id === activeTab)?.name || 'Dashboard'}
            </h1>
          </div>
        </div>

        {/* Content */}
        <main className="p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}
