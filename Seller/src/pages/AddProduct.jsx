import React, { useState,useEffect } from 'react';
import { Upload, X, Plus, AlertCircle, Package, DollarSign, FileText, Tag, Hash } from 'lucide-react';
import axios from "axios";
import { StoreContext } from '../ContextApi';
import { useContext } from 'react';
function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {url, sellerToken} = useContext(StoreContext)
  // Sample categories - replace with actual data from your backend
  const [categories, setCategories] = useState([])
   useEffect(() => {
    axios
      .get(`${url}/api/products/categories`, {
        headers: { Authorization: `Bearer ${sellerToken}` },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories:", err));
  }, [url, sellerToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Maximum 5 images allowed'
      }));
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear image error
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(sellerToken)
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock", formData.stock);

    images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    // Actual API call with axios
    const response = await axios.post(
      `${url}/api/products`,   // Ensure you replace `url` with your backend API base URL
      formDataToSend,
      {
        headers: {
          "Authorization": `Bearer ${sellerToken}`,
          "Content-Type": "multipart/form-data"
        },
      }
    );

    if (response.status === 201 || response.status === 200) {
      alert("Product created successfully!");
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
    });
    setImages([]);
    setImagePreviews([]);

  } catch (error) {
    console.error("Error creating product:", error.response?.data || error.message);
    alert(error.response?.data?.error || "Error creating product. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
          <p className="text-gray-600">Fill in the details below to add your product to the marketplace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4 mr-2 text-red-500" />
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-red-500'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-red-500" />
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.price 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-red-500'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2 text-red-500" />
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.category 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-red-500'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                      
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Hash className="w-4 h-4 mr-2 text-red-500" />
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.stock 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-red-500'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Description & Images */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-red-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-red-500'
                  }`}
                  placeholder="Describe your product..."
                />
                {errors.description && (
                  <p className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Upload className="w-4 h-4 mr-2 text-red-500" />
                  Product Images (Max 5)
                </label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-red-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 5}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer ${images.length >= 5 ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <Plus className="w-12 h-12 mx-auto mb-3 text-red-400" />
                    <p className="text-red-600 font-medium">
                      {images.length >= 5 ? 'Maximum images reached' : 'Click to upload images'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG up to 10MB each
                    </p>
                  </label>
                </div>

                {errors.images && (
                  <p className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.images}
                  </p>
                )}

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={preview.id} className="relative group">
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-red-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Product...
                </span>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;