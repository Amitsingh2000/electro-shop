import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { products as initialProducts } from '../../data/products';
import { Product } from '../../types/product';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ProductForm } from './ProductForm';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...products.map(p => p.id)) + 1,
    };
    setProducts([...products, newProduct]);
    setShowForm(false);
  };

  const handleEditProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
      ));
      setEditingProduct(null);
      setShowForm(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        onCancel={closeForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">{products.length} products total</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.currentPrice.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditForm(product)}
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or add a new product</p>
        </div>
      )}
    </div>
  );
};