import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, TruckIcon, ShieldCheckIcon, HeadphonesIcon } from 'lucide-react';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export const HomePage: React.FC = () => {
  const flashSaleProducts = products.slice(0, 4);
  const featuredProducts = products.slice(4, 8);

  const serviceFeatures = [
    {
      icon: TruckIcon,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over ₹999',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
    },
    {
      icon: ShieldCheckIcon,
      title: 'MONEY BACK GUARANTEE',
      description: '30-day return policy for your peace of mind',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="text-blue-200 text-lg font-medium">iPhone 14 Series</div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Up to 10%<br />off Voucher
              </h1>
              <p className="text-xl text-blue-100">
                Discover the latest technology with unbeatable prices and premium quality.
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Shop Now
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="iPhone 14"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-4 h-10 bg-blue-600 rounded-lg mr-4"></div>
            <h2 className="text-blue-600 text-2xl font-semibold">Today's</h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">Flash Sales</h1>
            
            {/* Countdown Timer */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Ends in:</div>
              <div className="flex space-x-4 text-2xl font-bold">
                <div className="text-center">
                  <div className="text-gray-900">15</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
                <div className="text-blue-600">:</div>
                <div className="text-center">
                  <div className="text-gray-900">18</div>
                  <div className="text-xs text-gray-500">Hours</div>
                </div>
                <div className="text-blue-600">:</div>
                <div className="text-center">
                  <div className="text-gray-900">49</div>
                  <div className="text-xs text-gray-500">Min</div>
                </div>
                <div className="text-blue-600">:</div>
                <div className="text-center">
                  <div className="text-gray-900">47</div>
                  <div className="text-xs text-gray-500">Sec</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="w-4 h-10 bg-blue-600 rounded-lg mr-4"></div>
            <h2 className="text-blue-600 text-2xl font-semibold">Categories</h2>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Browse By Category</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.name}`}>
                <Card className="h-32 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-500">
                  <CardContent className="flex flex-col items-center justify-center h-full p-4">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-gray-900 text-center">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium electronics and gadgets
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};