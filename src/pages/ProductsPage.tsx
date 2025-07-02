import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterIcon, GridIcon, ListIcon } from 'lucide-react';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || '';

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory && !categoryFromUrl || 
                             product.category === selectedCategory || 
                             product.category === categoryFromUrl;
      
      const matchesPrice = product.currentPrice >= priceRange[0] && 
                          product.currentPrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.currentPrice - b.currentPrice;
        case 'price-high':
          return b.currentPrice - a.currentPrice;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, categoryFromUrl, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 300000]);
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : 
             categoryFromUrl ? `${categoryFromUrl} Products` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full"
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Categories */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory && !categoryFromUrl
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.name || categoryFromUrl === category.name
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Clear Filters */}
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <GridIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};