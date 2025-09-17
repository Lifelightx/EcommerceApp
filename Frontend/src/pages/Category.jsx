import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock categories with images - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories([
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Electronics',
          description: 'Latest gadgets, smartphones, laptops, and tech accessories for modern living',
          imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
          productCount: 1248,
          featured: true
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Fashion & Clothing',
          description: 'Trendy apparel, shoes, and accessories for men, women, and children',
          imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
          productCount: 2156,
          featured: true
        },
        {
          _id: '507f1f77bcf86cd799439013',
          name: 'Home & Garden',
          description: 'Transform your space with furniture, décor, and gardening essentials',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          productCount: 892,
          featured: false
        },
        {
          _id: '507f1f77bcf86cd799439014',
          name: 'Books & Education',
          description: 'Expand your knowledge with books, courses, and educational materials',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
          productCount: 567,
          featured: false
        },
        {
          _id: '507f1f77bcf86cd799439015',
          name: 'Sports & Fitness',
          description: 'Equipment, apparel, and gear for all your athletic and fitness needs',
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
          productCount: 734,
          featured: true
        },
        {
          _id: '507f1f77bcf86cd799439016',
          name: 'Beauty & Personal Care',
          description: 'Skincare, makeup, fragrances, and personal wellness products',
          imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
          productCount: 445,
          featured: false
        },
        {
          _id: '507f1f77bcf86cd799439017',
          name: 'Automotive',
          description: 'Car accessories, parts, tools, and everything for vehicle enthusiasts',
          imageUrl: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop',
          productCount: 312,
          featured: false
        },
        {
          _id: '507f1f77bcf86cd799439018',
          name: 'Kids & Baby',
          description: 'Safe, fun, and educational products for children of all ages',
          imageUrl: 'https://images.unsplash.com/photo-1558375408-d0fb37d4e9e5?w=800&h=600&fit=crop',
          productCount: 623,
          featured: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Navigate to shop page with category filter
  const handleCategoryClick = (category) => {
    // Replace with your actual navigation logic
    // For React Router: navigate(`/shop?category=${category._id}`);
    // For Next.js: router.push(`/shop?category=${category._id}`);
    console.log('Navigating to shop with category:', category.name);
    window.location.href = `/shop?category=${category._id}`;
  };

  const featuredCategories = categories.filter(cat => cat.featured);
  const regularCategories = categories.filter(cat => !cat.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 mr-3 text-yellow-300" />
            <h1 className="text-5xl md:text-6xl font-bold">Explore Categories</h1>
            <Sparkles className="w-8 h-8 ml-3 text-yellow-300" />
          </div>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            Discover amazing products across all our carefully curated categories. 
            From the latest tech to timeless fashion, find everything you need in one place.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white bg-opacity-20 rounded-full px-6 py-2 text-lg font-medium">
              {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}+ Products Available
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Categories */}
        {featuredCategories.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Categories</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our most popular categories with the best selection and latest arrivals
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category, index) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                >
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      FEATURED
                    </span>
                  </div>
                  
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold">
                        {category.productCount.toLocaleString()} products
                      </span>
                      <span className="text-gray-400 text-sm">Click to explore</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Categories */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our complete collection of product categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularCategories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category)}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="text-blue-600 font-medium text-sm">
                    {category.productCount.toLocaleString()} products
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Explore our complete product catalog or use our advanced search to find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Browse All Products
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Advanced Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;