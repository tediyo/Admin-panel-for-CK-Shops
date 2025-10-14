'use client';

import { useState, useEffect } from 'react';
import { AboutValue, AboutMilestone, AboutFAQ, AboutContent, AboutSectionSettings } from '@/lib/models';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Coffee, 
  Heart, 
  Leaf, 
  Users, 
  Award, 
  MessageCircle,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';

const iconOptions = [
  { name: 'Coffee', icon: Coffee },
  { name: 'Heart', icon: Heart },
  { name: 'Leaf', icon: Leaf },
  { name: 'Users', icon: Users },
  { name: 'Award', icon: Award },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Calendar', icon: Calendar },
  { name: 'FileText', icon: FileText },
  { name: 'Settings', icon: Settings }
];

const colorOptions = [
  { name: 'Amber', value: 'from-amber-500 to-amber-600', bg: 'from-amber-50 to-amber-100' },
  { name: 'Red', value: 'from-red-500 to-pink-600', bg: 'from-red-50 to-pink-100' },
  { name: 'Green', value: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-100' },
  { name: 'Blue', value: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-100' },
  { name: 'Purple', value: 'from-purple-500 to-violet-600', bg: 'from-purple-50 to-violet-100' },
  { name: 'Orange', value: 'from-orange-500 to-red-600', bg: 'from-orange-50 to-red-100' }
];

const faqCategories = ['Delivery', 'Reservations', 'Amenities', 'Policies', 'Catering', 'Hours', 'Dietary', 'Sustainability'];

export default function AboutManager() {
  const [activeTab, setActiveTab] = useState<'values' | 'milestones' | 'faqs' | 'content' | 'settings'>('values');
  const [values, setValues] = useState<AboutValue[]>([]);
  const [milestones, setMilestones] = useState<AboutMilestone[]>([]);
  const [faqs, setFaqs] = useState<AboutFAQ[]>([]);
  const [content, setContent] = useState<AboutContent[]>([]);
  const [sectionSettings, setSectionSettings] = useState<AboutSectionSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [valueForm, setValueForm] = useState<Partial<AboutValue>>({});
  const [milestoneForm, setMilestoneForm] = useState<Partial<AboutMilestone>>({});
  const [faqForm, setFaqForm] = useState<Partial<AboutFAQ>>({});
  const [contentForm, setContentForm] = useState<Partial<AboutContent>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [valuesRes, milestonesRes, faqsRes, contentRes, settingsRes] = await Promise.all([
        fetch('/api/about-values'),
        fetch('/api/about-milestones'),
        fetch('/api/about-faqs'),
        fetch('/api/about-content'),
        fetch('/api/about-section-settings')
      ]);

      const [valuesData, milestonesData, faqsData, contentData, settingsData] = await Promise.all([
        valuesRes.json(),
        milestonesRes.json(),
        faqsRes.json(),
        contentRes.json(),
        settingsRes.json()
      ]);

      setValues(valuesData.data || []);
      setMilestones(milestonesData.data || []);
      setFaqs(faqsData.data || []);
      setContent(contentData.data || []);
      setSectionSettings(settingsData.data || []);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: string, data: any) => {
    try {
      const response = await fetch(`/api/about-${type}`, {
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
      const response = await fetch(`/api/about-${type}?id=${id}`, {
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
    
    switch (type) {
      case 'values':
        setValueForm(item);
        break;
      case 'milestones':
        setMilestoneForm(item);
        break;
      case 'faqs':
        setFaqForm(item);
        break;
      case 'content':
        setContentForm(item);
        break;
    }
  };

  const resetForms = () => {
    setValueForm({});
    setMilestoneForm({});
    setFaqForm({});
    setContentForm({});
  };

  const initSampleData = async () => {
    try {
      const response = await fetch('/api/init-about', { method: 'POST' });
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

  const toggleSectionVisibility = async (section: string, isVisible: boolean) => {
    try {
      const response = await fetch('/api/about-section-settings', {
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

  const renderValues = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Our Values</h3>
        <button
          onClick={() => { setShowForm(true); setValueForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Value</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value) => {
          const IconComponent = iconOptions.find(opt => opt.name === value.icon)?.icon || Coffee;
          return (
            <div key={value._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-4`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{value.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(value, 'values')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete('values', value._id!)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Our Journey</h3>
        <button
          onClick={() => { setShowForm(true); setMilestoneForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {milestone.year}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">{milestone.title}</h4>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(milestone, 'milestones')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete('milestones', milestone._id!)}
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

  const renderFAQs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
        <button
          onClick={() => { setShowForm(true); setFaqForm({}); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const IconComponent = iconOptions.find(opt => opt.name === faq.icon)?.icon || MessageCircle;
          return (
            <div key={faq._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h4>
                  <p className="text-gray-600 mb-2">{faq.answer}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
                    <span className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{faq.helpful} found helpful</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(faq, 'faqs')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete('faqs', faq._id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
                  onClick={() => handleDelete('content', item._id!)}
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

  const renderSettings = () => {
    const sections = [
      { key: 'hero', name: 'Hero Section', description: 'Main banner with title and subtitle' },
      { key: 'story', name: 'Story Section', description: 'Company story and journey' },
      { key: 'mission', name: 'Mission Section', description: 'Company mission statement' },
      { key: 'values', name: 'Values Section', description: 'Company values and principles' },
      { key: 'timeline', name: 'Timeline Section', description: 'Company milestones and history' },
      { key: 'faq', name: 'FAQ Section', description: 'Frequently asked questions' }
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Section Visibility</h3>
          <p className="text-gray-600">Toggle sections on/off for the about page</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const setting = sectionSettings.find(s => s.section === section.key);
            const isVisible = setting?.is_visible ?? true;
            
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
                    {isVisible ? 'Visible on about page' : 'Hidden from about page'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">💡 Section Visibility Tips</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Toggle sections on/off to customize what visitors see</li>
            <li>• Hidden sections won't appear on the about page</li>
            <li>• Changes take effect immediately on the frontend</li>
            <li>• You can always re-enable sections later</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!showForm) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      switch (activeTab) {
        case 'values':
          handleSave('values', valueForm);
          break;
        case 'milestones':
          handleSave('milestones', milestoneForm);
          break;
        case 'faqs':
          handleSave('faqs', faqForm);
          break;
        case 'content':
          handleSave('content', contentForm);
          break;
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
            {activeTab === 'values' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={valueForm.title || ''}
                    onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={valueForm.description || ''}
                    onChange={(e) => setValueForm({ ...valueForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <select
                      value={valueForm.icon || ''}
                      onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Icon</option>
                      {iconOptions.map((option) => (
                        <option key={option.name} value={option.name}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <select
                      value={valueForm.color || ''}
                      onChange={(e) => {
                        const selectedColor = colorOptions.find(c => c.value === e.target.value);
                        setValueForm({ 
                          ...valueForm, 
                          color: e.target.value,
                          bgColor: selectedColor?.bg || ''
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Color</option>
                      {colorOptions.map((option) => (
                        <option key={option.name} value={option.value}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image (Optional)</label>
                  <input
                    type="url"
                    value={valueForm.image || ''}
                    onChange={(e) => setValueForm({ ...valueForm, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </>
            )}

            {activeTab === 'milestones' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="text"
                      value={milestoneForm.year || ''}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={milestoneForm.title || ''}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={milestoneForm.description || ''}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            {activeTab === 'faqs' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                  <input
                    type="text"
                    value={faqForm.question || ''}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                  <textarea
                    value={faqForm.answer || ''}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={faqForm.category || ''}
                      onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {faqCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <select
                      value={faqForm.icon || ''}
                      onChange={(e) => setFaqForm({ ...faqForm, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Icon</option>
                      {iconOptions.map((option) => (
                        <option key={option.name} value={option.name}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={faqForm.tags?.join(', ') || ''}
                    onChange={(e) => setFaqForm({ ...faqForm, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="delivery, shipping, free delivery"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Helpful Count</label>
                  <input
                    type="number"
                    value={faqForm.helpful || 0}
                    onChange={(e) => setFaqForm({ ...faqForm, helpful: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
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
                      <option value="story">Story</option>
                      <option value="mission">Mission</option>
                      <option value="values">Values</option>
                      <option value="faq">FAQ</option>
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
          <p className="text-gray-600">Loading about content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">About Section Management</h2>
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
            { id: 'values', label: 'Values', count: values.length },
            { id: 'milestones', label: 'Milestones', count: milestones.length },
            { id: 'faqs', label: 'FAQs', count: faqs.length },
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
      {activeTab === 'values' && renderValues()}
      {activeTab === 'milestones' && renderMilestones()}
      {activeTab === 'faqs' && renderFAQs()}
      {activeTab === 'content' && renderContent()}
      {activeTab === 'settings' && renderSettings()}

      {/* Form Modal */}
      {renderForm()}
    </div>
  );
}
