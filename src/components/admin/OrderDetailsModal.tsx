import React, { useState } from 'react';
import {
  XIcon, PackageIcon, TruckIcon, MapPinIcon,
  CreditCardIcon, PhoneIcon, MailIcon, EditIcon, SaveIcon
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '../../types/order';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import axios from 'axios';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
  onPaymentStatusUpdate: (orderId: string, newStatus: PaymentStatus) => void;
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
  const [loading, setLoading] = useState(false);

  const updateOrder = async (updateFields: Partial<Order>) => {
    try {
      setLoading(true);
      await axios.put(`/api/orders/${order.id}`, updateFields);
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTracking = async () => {
    await updateOrder({ trackingNumber });
    setIsEditingTracking(false);
  };

  const handleSaveNotes = async () => {
    await updateOrder({ notes });
    setIsEditingNotes(false);
  };

  // ...getStatusColor, getPaymentStatusColor unchanged

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* TRACKING */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <TruckIcon className="w-5 h-5 mr-2" />
                  Tracking Information
                </h3>
                <Button size="sm" variant="outline" onClick={() => setIsEditingTracking(!isEditingTracking)}>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveTracking} disabled={loading}>
                      <SaveIcon className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingTracking(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-900">{trackingNumber || 'No tracking number assigned'}</p>
              )}
            </CardContent>
          </Card>

          {/* NOTES */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Order Notes</h3>
                <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(!isEditingNotes)}>
                  <EditIcon className="w-4 h-4" />
                </Button>
              </div>
              {isEditingNotes ? (
                <div className="space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveNotes} disabled={loading}>
                      <SaveIcon className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-900">{notes || 'No notes added'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
