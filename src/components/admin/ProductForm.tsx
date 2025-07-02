import React, { useState } from 'react';
import { ArrowLeftIcon } from 'lucide-react';
import { Product } from '../../types/product';
import { categories } from '../../data/products';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    image: product?.image || '',
    currentPrice: product?.currentPrice || 0,
    originalPrice: product?.originalPrice || 0,
    discount: product?.discount || '',
    rating: product?.rating || 5,
    reviews: product?.reviews || 0,
    description: product?.description || '',
    category: product?.category || categories[0].name,
    inStock: product?.inStock ?? true,
    features: product?.features?.join('\n') || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.image.trim()) newErrors.image = 'Product image URL is required';
    if (formData.currentPrice <= 0) newErrors.currentPrice = 'Current price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Product description is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      image: formData.image.trim(),
      currentPrice: formData.currentPrice,
      originalPrice: formData.originalPrice || undefined,
      discount: formData.discount || undefined,
      rating: formData.rating,
      reviews: formData.reviews,
      description: formData.description.trim(),
      category: formData.category,
      inStock: formData.inStock,
      features: formData.features.trim() ? formData.features.split('\n').map(f => f.trim()).filter(f => f) : undefined,
    };

    onSubmit(productData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <p className="text-gray-600">
            {product ? 'Update product information' : 'Fill in the details to add a new product'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Price */}
              <div>
                <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Price (₹) *
                </label>
                <input
                  type="number"
                  id="currentPrice"
                  name="currentPrice"
                  value={formData.currentPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.currentPrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.currentPrice && <p className="mt-1 text-sm text-red-600">{errors.currentPrice}</p>}
              </div>

              {/* Original Price */}
              <div>
                <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Discount */}
              <div>
                <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <input
                  type="text"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., -20%"
                />
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5) *
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.rating ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
              </div>

              {/* Reviews Count */}
              <div>
                <label htmlFor="reviews" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Reviews
                </label>
                <input
                  type="number"
                  id="reviews"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* In Stock */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                  In Stock
                </label>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.image ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Features */}
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                Features (one per line)
              </label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {product ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};