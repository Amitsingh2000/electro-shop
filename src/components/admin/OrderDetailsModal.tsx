import React, { useState } from 'react';
import { XIcon, PackageIcon, TruckIcon, MapPinIcon, CreditCardIcon, PhoneIcon, MailIcon, EditIcon, SaveIcon } from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onPaymentStatusUpdate: (orderId: string, newPaymentStatus: PaymentStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onStatusUpdate,
  onPaymentStatusUpdate
}) => {
  const [isEditingTracking, setIsEditingTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(order.notes || '');

  const handleSaveTracking = () => {
    // In real app, this would update the order via API
    setIsEditingTracking(false);
  };

  const handleSaveNotes = () => {
    // In real app, this would update the order via API
    setIsEditingNotes(false);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Order Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Current Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => onStatusUpdate(order.id, e.target.value as OrderStatus)}
                      className={`w-full px-3 py-2 rounded-lg font-medium ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Order Date</label>
                    <p className="text-sm text-gray-900">{new Date(order.orderDate).toLocaleString()}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Estimated Delivery</label>
                      <p className="text-sm text-gray-900">{new Date(order.estimatedDelivery).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Payment Status</label>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => onPaymentStatusUpdate(order.id, e.target.value as PaymentStatus)}
                      className={`w-full px-3 py-2 rounded-lg font-medium ${getPaymentStatusColor(order.paymentStatus)} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                    <div className="flex items-center space-x-2">
                      <CreditCardIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900 capitalize">{order.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Total Amount</label>
                    <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <p className="text-sm text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <MailIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900">{order.customerEmail}</span>
                  </div>
                </div>
                {order.customerPhone && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone</label>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">{order.customerPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-900 space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <span>{order.shippingAddress.phone}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <PackageIcon className="w-5 h-5 mr-2" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="text-gray-900">
                    {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <TruckIcon className="w-5 h-5 mr-2" />
                    Tracking Information
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingTracking(!isEditingTracking)}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                </div>
                {isEditingTracking ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveTracking}>
                        <SaveIcon className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingTracking(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-900">
                    {trackingNumber || 'No tracking number assigned'}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Order Notes</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditingNotes(!isEditingNotes)}
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                </div>
                {isEditingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add order notes..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveNotes}>
                        <SaveIcon className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-900">
                    {notes || 'No notes added'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};