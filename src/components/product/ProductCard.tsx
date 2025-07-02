import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className={`group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link to={`/product/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {product.discount && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              {product.discount}
            </Badge>
          )}
          
          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
            <HeartIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          {/* Quick Add to Cart */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <ShoppingCartIcon className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.currentPrice.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex text-sm">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          
          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="text-xs text-gray-500 capitalize">{product.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};