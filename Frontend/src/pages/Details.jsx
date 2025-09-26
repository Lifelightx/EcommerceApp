import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw } from 'lucide-react';
import { StoreContext } from '../ContextApi';
import { useNotification } from '../NotificationContext';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url, token } = useContext(StoreContext);
  const { showSuccess, showError, showWarning } = useNotification();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${url}/api/products/${id}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, url]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddToCart = async () => {
    // Check if user has token
    if (!token) {
      showWarning('Please login to add items to cart');
      navigate('/');
      return;
    }

    setAddingToCart(true);

    try {
      const response = await axios.post(
        `${url}/api/cart/add`,
        { productId: id, quantity: quantity },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Show success notification
      if(response.status===200){

        showSuccess(`${product.name} added to cart successfully!`);
      }
      // Optionally reset quantity to 1 after adding
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Handle different error cases with appropriate notifications
      if (error.response?.status === 401) {
        showError('Your session has expired. Please login again.');
        navigate('/');
      } else if (error.response?.status === 400) {
        showError(error.response.data?.message || 'Failed to add item to cart');
      } else if (error.response?.status === 409) {
        showWarning('This item is already in your cart');
      } else {
        showError('Failed to add item to cart. Please try again.');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!token) {
      showWarning('Please login to add items to wishlist');
      return;
    }
    // Add wishlist logic here
    showSuccess('Added to wishlist!');
  };

  const handleShare = () => {
    // Copy product URL to clipboard
    const productUrl = window.location.href;
    navigator.clipboard.writeText(productUrl).then(() => {
      showSuccess('Product link copied to clipboard!');
    }).catch(() => {
      showError('Failed to copy link');
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
          }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Product not found'}</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-purple-400 text-white rounded-md hover:bg-purple-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-8">
      {/* Header with back button */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
              <img
                src={`${url}${product.images[selectedImage]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === index
                        ? 'border-purple-400'
                        : 'border-gray-200'
                      }`}
                  >
                    <img
                      src={`${url}${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-purple-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {renderStars(product.averageRating)}
                </div>
                <span className="text-gray-600">
                  {product.averageRating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock status */}
              <div className="mb-6">
                {product.stock > 5 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                ) : product.stock > 0 ? (
                  <span className="text-purple-600 font-medium">Only {product.stock} left!</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Category and Seller */}
              <div className="mb-6 space-y-2">
                <div>
                  <span className="text-gray-600">Category: </span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">{product.category.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sold by: </span>
                  <span className="font-medium">{product.seller.firstName} {product.seller.lastName}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={addingToCart}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || addingToCart}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white font-medium rounded-md hover:bg-purple-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button 
                  onClick={handleAddToWishlist}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>

                <button 
                  onClick={handleShare}
                  className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-purple-400" />
                <span className="text-gray-700">Free delivery on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                <span className="text-gray-700">Secure payment & buyer protection</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-purple-400" />
                <span className="text-gray-700">7-day easy return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;