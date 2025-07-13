import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Order } from '../types/order';


export const OrdersPage: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="p-8">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h1 className="text-2xl font-bold mb-2">No orders found</h1>
        <p>You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                  Details
                </Button>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Status: <strong className="capitalize">{order.status}</strong></span>
                <span>Payment: <strong className="capitalize">{order.paymentStatus}</strong></span>
                <span>Total: ₹{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inline Order Details Modal */}
      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Order ID:</strong>
                  <div>{selectedOrder.id}</div>
                </div>
                <div>
                  <strong>Date:</strong>
                  <div>{new Date(selectedOrder.orderDate).toLocaleString()}</div>
                </div>
                <div>
                  <strong>Customer:</strong>
                  <div>
                    {selectedOrder.customerName}<br />
                    {selectedOrder.customerEmail}<br />
                    {selectedOrder.customerPhone || '—'}
                  </div>
                </div>
                <div>
                  <strong>Shipping Address:</strong>
                  <div>
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}<br />
                    {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </div>
                </div>

                <div>
                  <strong>Status:</strong> <div className="capitalize">{selectedOrder.status}</div>
                </div>
                <div>
                  <strong>Payment:</strong>
                  <div>
                    {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod.toUpperCase()})
                  </div>
                </div>
                {selectedOrder.trackingNumber && (
                  <div>
                    <strong>Tracking Number:</strong>
                    <div>{selectedOrder.trackingNumber}</div>
                  </div>
                )}
                {selectedOrder.estimatedDelivery && (
                  <div>
                    <strong>Estimated Delivery:</strong>
                    <div>{selectedOrder.estimatedDelivery}</div>
                  </div>
                )}
              </div>

              <div>
                <strong>Items:</strong>
                <ul className="list-disc ml-6 space-y-1 mt-2">
                  {selectedOrder.items.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity} – ₹{(item.price * item.quantity).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>
                    {selectedOrder.deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${selectedOrder.deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="pt-4">
                  <strong>Notes:</strong>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              <div className="pt-4 text-right">
                <Button onClick={() => setSelectedOrder(null)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
