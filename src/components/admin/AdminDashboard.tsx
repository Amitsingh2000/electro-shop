import React from 'react';
import { TrendingUpIcon, UsersIcon, PackageIcon, ShoppingCartIcon, DollarSignIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { products } from '../../data/products';
import { orders } from '../../data/orders';

export const AdminDashboard: React.FC = () => {
  // Calculate stats from orders data
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = 450; // Mock data

  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 4)
    .map(order => ({
      id: order.id,
      customer: order.customerName,
      amount: order.total,
      status: order.status,
      date: new Date(order.orderDate).toLocaleDateString()
    }));

  const topProducts = products.slice(0, 5).map(product => ({
    ...product,
    sales: Math.floor(Math.random() * 100) + 20
  }));

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSignIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCartIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+8.2%'
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: PackageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+2.1%'
    },
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: UsersIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+15.3%'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUpIcon className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.id} • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{product.currentPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};