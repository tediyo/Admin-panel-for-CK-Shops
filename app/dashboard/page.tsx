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
    <div className="min-h-screen professional-gradient">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-amber-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Professional Brown Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 sidebar transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-amber-700/30">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center shadow-lg">
              <Coffee className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white font-serif">Coffee Admin</span>
              <p className="text-xs text-amber-200">Professional Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-amber-700/50 transition-colors"
          >
            <X className="h-5 w-5 text-amber-200" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full sidebar-item group ${isActive ? 'active' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-semibold">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-amber-700/30">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-amber-800/30 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.username}</p>
              <p className="text-xs text-amber-200 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-amber-200 hover:bg-red-600/20 hover:text-red-300 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-80">
        {/* Professional Top bar */}
        <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-amber-200 h-20 flex items-center justify-between px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-3 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-amber-700" />
          </button>

          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold professional-text-gradient font-serif">
                {tabs.find(tab => tab.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-amber-600">Professional coffee shop management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-amber-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  );
}
