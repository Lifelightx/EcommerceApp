import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Shield, Zap, Users, Star, CheckCircle, Play } from 'lucide-react';

function Home() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Handle email submission
    console.log('Seller signup:', email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Your Products Into 
                  <span className="text-red-500 block">Profit</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of successful sellers on our platform. Start selling today and reach millions of customers worldwide.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">No setup fees</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Fast payouts</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">24/7 support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors group"
                >
                  Start Selling
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-3xl rotate-6 opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Seller Dashboard</h3>
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">₹2.4L</div>
                      <div className="text-sm text-gray-600">Monthly Sales</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">850</div>
                      <div className="text-sm text-gray-600">Orders</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Today's Revenue</span>
                    <span className="font-semibold text-green-600">+₹12,350</span>
                  </div>
                  
                  <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">50K+</div>
              <div className="text-gray-600">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">2M+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">₹500Cr+</div>
              <div className="text-gray-600">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">4.8★</div>
              <div className="text-gray-600">Seller Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span className="text-red-500">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools and support you need to build a thriving online business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <Zap className="w-6 h-6 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Setup</h3>
              <p className="text-gray-600">
                Get your store up and running in minutes. No technical skills required - just upload your products and start selling.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <Shield className="w-6 h-6 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Get paid securely and on time. Multiple payment options with fraud protection and instant settlement.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <Users className="w-6 h-6 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Massive Reach</h3>
              <p className="text-gray-600">
                Access millions of active buyers. Our marketing tools help you reach the right customers at the right time.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <TrendingUp className="w-6 h-6 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track your performance with detailed analytics. Make data-driven decisions to grow your business.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <Star className="w-6 h-6 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Support</h3>
              <p className="text-gray-600">
                Get help when you need it. Our dedicated seller support team is available 24/7 to assist you.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <CheckCircle className="w-6 h-6 text-red-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Management</h3>
              <p className="text-gray-600">
                Manage inventory, orders, and customers from one simple dashboard. Streamline your operations effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success <span className="text-red-500">Stories</span>
            </h2>
            <p className="text-xl text-gray-600">
              See how sellers like you are building successful businesses on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border border-red-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">RS</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Rajesh Sharma</div>
                  <div className="text-sm text-gray-600">Electronics Store</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Within 6 months, I went from zero to ₹5 lakhs in monthly sales. The platform's support and tools made it possible."
              </p>
              <div className="flex items-center text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border border-red-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">PA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Priya Agarwal</div>
                  <div className="text-sm text-gray-600">Fashion Boutique</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The analytics helped me understand my customers better. Now I stock exactly what sells and my profits have doubled!"
              </p>
              <div className="flex items-center text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border border-red-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">AK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Amit Kumar</div>
                  <div className="text-sm text-gray-600">Home Decor</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Started as a side business, now it's my main income. The platform's reach helped me find customers I never could have reached alone."
              </p>
              <div className="flex items-center text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Success Story?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of successful sellers and start building your business today. It's free to get started!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-white text-red-500 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 group">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
            <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center gap-2 group">
              Start Selling Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-red-400">
            <p className="text-red-100">
              Questions? Call our seller support at <span className="font-semibold">1800-123-4567</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;