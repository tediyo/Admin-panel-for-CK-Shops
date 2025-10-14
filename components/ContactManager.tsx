'use client';

import { useState, useEffect } from 'react';
import { Branch, ContactContent, ContactSectionSettings } from '@/lib/models';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Star,
  Wifi,
  Car,
  Coffee,
  BookOpen,
  Users,
  CheckCircle
} from 'lucide-react';

const amenityOptions = [
  { name: 'WiFi', icon: Wifi, color: 'bg-blue-500' },
  { name: 'Parking', icon: Car, color: 'bg-green-500' },
  { name: 'Outdoor Seating', icon: Coffee, color: 'bg-amber-500' },
  { name: 'Study Space', icon: BookOpen, color: 'bg-purple-500' },
  { name: 'Air Conditioning', icon: CheckCircle, color: 'bg-cyan-500' },
  { name: 'Quick Service', icon: Clock, color: 'bg-orange-500' },
  { name: 'Takeaway', icon: Coffee, color: 'bg-red-500' },
  { name: 'Student Discounts', icon: Users, color: 'bg-indigo-500' },
  { name: 'Quiet Environment', icon: CheckCircle, color: 'bg-gray-500' }
];

export default function ContactManager() {
  const [activeTab, setActiveTab] = useState<'branches' | 'content' | 'settings'>('branches');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [content, setContent] = useState<ContactContent[]>([]);
  const [sectionSettings, setSectionSettings] = useState<ContactSectionSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [branchForm, setBranchForm] = useState<Partial<Branch>>({});
  const [contentForm, setContentForm] = useState<Partial<ContactContent>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [branchesRes, contentRes, settingsRes] = await Promise.all([
        fetch('/api/branches'),
        fetch('/api/contact-content'),
        fetch('/api/contact-section-settings')
      ]);

      const [branchesData, contentData, settingsData] = await Promise.all([
        branchesRes.json(),
        contentRes.json(),
        settingsRes.json()
      ]);

      setBranches(branchesData.data || []);
      setContent(contentData.data || []);
      setSectionSettings(settingsData.data || []);
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: string, data: any) => {
    try {
      const response = await fetch(`/api/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        setShowForm(false);
        setEditingItem(null);
        resetForms();
      } else {
        alert(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/${type}?id=${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
      } else {
        alert(result.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem(item._id);
    setShowForm(true);
    
    if (type === 'branches') {
      setBranchForm(item);
    } else {
      setContentForm(item);
    }
  };

  const resetForms = () => {
    setBranchForm({});
    setContentForm({});
  };

  const toggleSectionVisibility = async (section: string, isVisible: boolean) => {
    try {
      const response = await fetch('/api/contact-section-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [{
            section,
            is_visible: isVisible,
            sort_order: sectionSettings.find(s => s.section === section)?.sort_order || 0
          }]
        })
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
      } else {
        alert(result.error || 'Failed to update section visibility');
      }
    } catch (error) {
      console.error('Error updating section visibility:', error);
      alert('Failed to update section visibility');
    }
  };

  const initSampleData = async () => {
    try {
      const response = await fetch('/api/init-contact', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        await fetchData();
        alert('Sample data initialized successfully!');
      } else {
        alert(result.error || 'Failed to initialize sample data');
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
      alert('Failed to initialize sample data');
    }
  };

  const renderBranches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Branch Locations</h3>
        <button
          onClick={() => { setShowForm(true); setBranchForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{branch.name}</h4>
                  {branch.is_main_branch && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Star className="h-3 w-3 mr-1" />
                      Main Branch
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(branch, 'branches')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete('branches', branch._id!)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600 text-sm">{branch.address}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600 text-sm">{branch.phone}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600 text-sm">{branch.email}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600 text-sm">{branch.hours}</p>
              </div>

              {branch.amenities && branch.amenities.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {branch.amenities.map((amenity, index) => {
                      const amenityOption = amenityOptions.find(opt => opt.name === amenity);
                      return (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${amenityOption?.color || 'bg-gray-500'}`}
                        >
                          {amenityOption?.icon && <amenityOption.icon className="h-3 w-3 mr-1" />}
                          {amenity}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {branch.description && (
                <p className="text-gray-600 text-sm mt-3">{branch.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Page Content</h3>
        <button
          onClick={() => { setShowForm(true); setContentForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{item.section} - {item.field}</h4>
                <p className="text-gray-600 mt-1">{item.value}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item, 'content')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete('contact-content', item._id!)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Section Visibility</h3>
        <p className="text-gray-600">Toggle sections on/off for the contact page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'hero', name: 'Hero Section', description: 'Main banner with title and subtitle' },
          { key: 'branches', name: 'Branches Section', description: 'Branch locations and information' },
          { key: 'form', name: 'Contact Form Section', description: 'Contact form and messaging' },
          { key: 'map', name: 'Map Section', description: 'Interactive map with branch locations' }
        ].map((section) => {
          const setting = sectionSettings.find(s => s.section === section.key);
          const isVisible = setting?.is_visible ?? true; // Default to true if not set

          return (
            <div key={section.key} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{section.name}</h4>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => toggleSectionVisibility(section.key, !isVisible)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isVisible ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isVisible ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isVisible ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className={`text-sm font-medium ${isVisible ? 'text-green-600' : 'text-gray-500'}`}>
                  {isVisible ? 'Visible on contact page' : 'Hidden from contact page'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Toggle sections on/off to customize the contact page layout</li>
          <li>• Changes take effect immediately on the frontend</li>
          <li>• Hidden sections won't appear on the contact page</li>
          <li>• You can always re-enable sections later</li>
        </ul>
      </div>
    </div>
  );

  const renderForm = () => {
    if (!showForm) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (activeTab === 'branches') {
        handleSave('branches', branchForm);
      } else {
        handleSave('contact-content', contentForm);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingItem(null); resetForms(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {activeTab === 'branches' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                  <input
                    type="text"
                    value={branchForm.name || ''}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    value={branchForm.address || ''}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={branchForm.phone || ''}
                      onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={branchForm.email || ''}
                      onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours *</label>
                  <input
                    type="text"
                    value={branchForm.hours || ''}
                    onChange={(e) => setBranchForm({ ...branchForm, hours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-11PM"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={branchForm.coordinates?.lat || ''}
                      onChange={(e) => setBranchForm({ 
                        ...branchForm, 
                        coordinates: { 
                          ...branchForm.coordinates, 
                          lat: parseFloat(e.target.value) || 0 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={branchForm.coordinates?.lng || ''}
                      onChange={(e) => setBranchForm({ 
                        ...branchForm, 
                        coordinates: { 
                          ...branchForm.coordinates, 
                          lng: parseFloat(e.target.value) || 0 
                        } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={branchForm.image || ''}
                    onChange={(e) => setBranchForm({ ...branchForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={branchForm.description || ''}
                    onChange={(e) => setBranchForm({ ...branchForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {amenityOptions.map((amenity) => (
                      <label key={amenity.name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={branchForm.amenities?.includes(amenity.name) || false}
                          onChange={(e) => {
                            const currentAmenities = branchForm.amenities || [];
                            if (e.target.checked) {
                              setBranchForm({
                                ...branchForm,
                                amenities: [...currentAmenities, amenity.name]
                              });
                            } else {
                              setBranchForm({
                                ...branchForm,
                                amenities: currentAmenities.filter(a => a !== amenity.name)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={branchForm.is_main_branch || false}
                      onChange={(e) => setBranchForm({ ...branchForm, is_main_branch: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Main Branch</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={branchForm.is_active !== false}
                      onChange={(e) => setBranchForm({ ...branchForm, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </>
            )}

            {activeTab === 'content' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                    <select
                      value={contentForm.section || ''}
                      onChange={(e) => setContentForm({ ...contentForm, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Section</option>
                      <option value="hero">Hero</option>
                      <option value="branches">Branches</option>
                      <option value="form">Form</option>
                      <option value="map">Map</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
                    <input
                      type="text"
                      value={contentForm.field || ''}
                      onChange={(e) => setContentForm({ ...contentForm, field: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="title, subtitle, description, etc."
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                  <textarea
                    value={contentForm.value || ''}
                    onChange={(e) => setContentForm({ ...contentForm, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingItem(null); resetForms(); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contact Section Management</h2>
        <button
          onClick={initSampleData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Init Sample Data
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'branches', label: 'Branches', count: branches.length },
            { id: 'content', label: 'Content', count: content.length },
            { id: 'settings', label: 'Visibility', count: sectionSettings.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'branches' && renderBranches()}
      {activeTab === 'content' && renderContent()}
      {activeTab === 'settings' && renderSettings()}

      {/* Form Modal */}
      {renderForm()}
    </div>
  );
}
