'use client';

import { useState, useEffect } from 'react';
import { Order, OrderSettings } from '@/lib/models';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  Eye,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  Settings,
  RefreshCw,
  Calendar,
  DollarSign
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  preparing: Coffee,
  ready: AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle
};

export default function OrderManager() {
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<OrderSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState<OrderSettings | null>(null);

  // Filters and search
  const [filters, setFilters] = useState({
    status: '',
    orderType: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    fetchData();
  }, [filters, pagination.currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, settingsRes] = await Promise.all([
        fetch(`/api/orders?status=${filters.status}&orderType=${filters.orderType}&search=${filters.search}&page=${pagination.currentPage}`),
        fetch('/api/order-settings')
      ]);

      const [ordersData, settingsData] = await Promise.all([
        ordersRes.json(),
        settingsRes.json()
      ]);

      setOrders(ordersData.data?.orders || []);
      setPagination(ordersData.data?.pagination || pagination);
      setSettings(settingsData.data || []);
    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: orderId, status })
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        setShowOrderModal(false);
      } else {
        alert(result.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        setShowOrderModal(false);
      } else {
        alert(result.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const handleSaveSetting = async (settingData: any) => {
    try {
      const response = await fetch('/api/order-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingData)
      });

      const result = await response.json();
      if (result.success) {
        await fetchData();
        setShowSettingsModal(false);
        setEditingSetting(null);
      } else {
        alert(result.error || 'Failed to save setting');
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      alert('Failed to save setting');
    }
  };

  const initOrderSystem = async () => {
    try {
      const response = await fetch('/api/init-orders', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        await fetchData();
        alert('Order system initialized successfully!');
      } else {
        alert(result.error || 'Failed to initialize order system');
      }
    } catch (error) {
      console.error('Error initializing order system:', error);
      alert('Failed to initialize order system');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Orders ({pagination.totalCount})</h3>
        <div className="flex space-x-2">
          <button
            onClick={initOrderSystem}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Init System</span>
          </button>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
            <select
              value={filters.orderType}
              onChange={(e) => setFilters({ ...filters, orderType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="pickup">Pickup</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Order number, name, email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', orderType: '', search: '' })}
              className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status];
          return (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-5 w-5" />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{order.orderNumber}</h4>
                    <p className="text-sm text-gray-600">{formatDate(order.orderTime)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-800">{formatCurrency(order.total)}</span>
                  <button
                    onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{order.customerInfo.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{order.customerInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {order.orderType === 'pickup' ? <Clock className="h-4 w-4 text-gray-500" /> : <MapPin className="h-4 w-4 text-gray-500" />}
                  <span className="text-gray-600">
                    {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} • 
                  Est. ready: {order.estimatedReadyTime ? formatDate(order.estimatedReadyTime) : 'N/A'}
                </div>
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id!, 'confirmed')}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id!, 'preparing')}
                      className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700"
                    >
                      Start Prep
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id!, 'ready')}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusUpdate(order._id!, 'completed')}
                      className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                    >
                      Complete
                    </button>
                  )}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelOrder(order._id!)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
            disabled={!pagination.hasPrev}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
            disabled={!pagination.hasNext}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Order Settings</h3>
        <button
          onClick={() => { setEditingSetting(null); setShowSettingsModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Setting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.map((setting) => (
          <div key={setting._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">{setting.setting.replace(/_/g, ' ').toUpperCase()}</h4>
              <button
                onClick={() => { setEditingSetting(setting); setShowSettingsModal(true); }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-3">{setting.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-800">
                {typeof setting.value === 'boolean' ? (setting.value ? 'Yes' : 'No') : setting.value}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                setting.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {setting.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrderModal = () => {
    if (!selectedOrder || !showOrderModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Order Details - {selectedOrder.orderNumber}</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const StatusIcon = statusIcons[selectedOrder.status];
                  return <StatusIcon className="h-6 w-6" />;
                })()}
                <span className={`px-4 py-2 rounded-full text-lg font-medium ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{formatCurrency(selectedOrder.total)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">{selectedOrder.customerInfo.name}</div>
                    <div className="text-sm text-gray-600">Full Name</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">{selectedOrder.customerInfo.email}</div>
                    <div className="text-sm text-gray-600">Email</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-800">{selectedOrder.customerInfo.phone}</div>
                    <div className="text-sm text-gray-600">Phone</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedOrder.orderType === 'pickup' ? <Clock className="h-5 w-5 text-gray-500" /> : <MapPin className="h-5 w-5 text-gray-500" />}
                  <div>
                    <div className="font-medium text-gray-800">
                      {selectedOrder.orderType === 'pickup' ? 'Pickup' : 'Delivery'}
                    </div>
                    <div className="text-sm text-gray-600">Order Type</div>
                  </div>
                </div>
              </div>
              {selectedOrder.customerInfo.address && (
                <div className="mt-4 flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-800">{selectedOrder.customerInfo.address}</div>
                    <div className="text-sm text-gray-600">Delivery Address</div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800">{item.name}</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span>Price: {formatCurrency(item.price)}</span>
                        {item.specialInstructions && (
                          <span className="text-amber-600">Special: {item.specialInstructions}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.deliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 border-t border-gray-300 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrder.specialInstructions && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Special Instructions</h4>
                <p className="text-amber-700">{selectedOrder.specialInstructions}</p>
              </div>
            )}

            {/* Order Times */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-blue-600">Order Time</div>
                <div className="font-semibold text-blue-800">{formatDate(selectedOrder.orderTime)}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-green-600">Estimated Ready</div>
                <div className="font-semibold text-green-800">
                  {selectedOrder.estimatedReadyTime ? formatDate(selectedOrder.estimatedReadyTime) : 'N/A'}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Status</div>
                <div className="font-semibold text-gray-800">
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder._id!, 'confirmed')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Order
                </button>
              )}
              {selectedOrder.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder._id!, 'preparing')}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Start Preparation
                </button>
              )}
              {selectedOrder.status === 'preparing' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder._id!, 'ready')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Ready
                </button>
              )}
              {selectedOrder.status === 'ready' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder._id!, 'completed')}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Complete Order
                </button>
              )}
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder._id!)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsModal = () => {
    if (!showSettingsModal) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const settingData = {
        _id: editingSetting?._id,
        setting: formData.get('setting'),
        value: formData.get('value'),
        description: formData.get('description'),
        is_active: formData.get('is_active') === 'on'
      };
      handleSaveSetting(settingData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editingSetting ? 'Edit' : 'Add'} Order Setting
              </h3>
              <button
                onClick={() => { setShowSettingsModal(false); setEditingSetting(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Setting Key</label>
              <input
                type="text"
                name="setting"
                defaultValue={editingSetting?.setting || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
              <input
                type="text"
                name="value"
                defaultValue={editingSetting?.value || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                defaultValue={editingSetting?.description || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editingSetting?.is_active !== false}
                className="rounded"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => { setShowSettingsModal(false); setEditingSetting(null); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
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
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'orders', label: 'Orders', count: pagination.totalCount },
            { id: 'settings', label: 'Settings', count: settings.length }
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
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'settings' && renderSettings()}

      {/* Modals */}
      {renderOrderModal()}
      {renderSettingsModal()}
    </div>
  );
}
