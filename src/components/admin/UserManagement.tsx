import React, { useState } from 'react';
import { SearchIcon, EditIcon, TrashIcon, UserPlusIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin?: string;
  avatar?: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@electroshop.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-01',
      lastLogin: '2024-01-20',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15'
    },
    {
      id: '5',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+91 9876543213',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-12',
      lastLogin: '2024-01-18',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleToggleRole = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, role: user.role === 'user' ? 'admin' : 'user' }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">{users.length} users total</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlusIcon className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'user' | 'admin')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <MailIcon className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleRole(user.id)}
                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        } transition-colors`}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};