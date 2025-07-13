import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon, PackageIcon, TruckIcon,
  CheckCircleIcon, XCircleIcon, EyeIcon,
  DownloadIcon, SearchIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types/order';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export const OrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!token) return;
    axios
      .get<Order[]>('/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to load orders:', err));
  }, [token]);

  const filtered = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Order['status']) => {
    const icons: Record<Order['status'], JSX.Element> = {
      delivered: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
      shipped: <TruckIcon className="w-5 h-5 text-blue-600" />,
      processing: <PackageIcon className="w-5 h-5 text-purple-600" />,
      confirmed: <CheckCircleIcon className="w-5 h-5 text-blue-600" />,
      pending: <PackageIcon className="w-5 h-5 text-yellow-600" />,
      cancelled: <XCircleIcon className="w-5 h-5 text-red-600" />
    };
    return icons[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o =>
      ['processing', 'confirmed'].includes(o.status)
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">My Orders</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: stats.total },
            { label: 'Delivered', value: stats.delivered },
            { label: 'Shipped', value: stats.shipped },
            { label: 'Processing', value: stats.processing }
          ].map((item, idx) => (
            <Card key={idx}>
              <CardContent className="text-center py-6">
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search + Filter */}
        <Card>
          <CardContent className="flex flex-col md:flex-row gap-4 py-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">All Statuses</option>
              {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Order Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? filtered.map(order => (
            <Card key={order.id} className="hover:shadow-md transition">
              <CardContent className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-4">
                <div className="flex items-start gap-4 w-full lg:w-auto">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold">{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      Placed: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <div className="flex gap-2 mt-2 lg:mt-0">
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                    <EyeIcon className="w-4 h-4 mr-1" /> Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button size="sm" variant="outline">
                      <DownloadIcon className="w-4 h-4 mr-1" /> Invoice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found.</p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Order {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)}>
                  <XCircleIcon className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                </button>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 bg-gray-50 rounded p-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div>₹{item.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Shipping Address</h3>
                <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                  <p>{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Totals */}
              <div>
                <h3 className="font-semibold mb-1">Order Summary</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2 text-sm">
                  <div className="flex justify-between">Subtotal: <span>₹{selectedOrder.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between">Delivery Fee: <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee.toLocaleString()}`}</span></div>
                  <div className="flex justify-between font-bold text-base">Total: <span>₹{selectedOrder.total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
