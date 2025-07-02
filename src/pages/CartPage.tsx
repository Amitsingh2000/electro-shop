import React from 'react';
import { Link } from 'react-router-dom';
import { MinusIcon, PlusIcon, TrashIcon, ArrowLeftIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const CartPage: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deliveryFee = total > 999 ? 0 : 99;
  const finalTotal = total + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
          </div>
          {items.length > 0 && (
            <Button
              onClick={clearCart}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{item.currentPrice.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">Qty:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹{(item.currentPrice * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">₹{total.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                  
                  {total <= 999 && (
                    <p className="text-sm text-blue-600">
                      Add ₹{(1000 - total).toLocaleString()} more for free delivery!
                    </p>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full py-3" size="lg">
                    Save for Later
                  </Button>
                </div>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};