import React, { useState, useEffect, useContext } from 'react';
import { CreditCard, MapPin, Package, Plus, Edit2, Trash2, Loader } from 'lucide-react';
import { StoreContext } from '../ContextApi';

function Checkout() {
  const { token, url } = useContext(StoreContext);
  
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Address form state
  const [newAddress, setNewAddress] = useState({
    street: '',
    landmark: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const [orderTotals, setOrderTotals] = useState({
    platformFee: 0,
    total: 0,
    subTotal: 0
  });

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUserProfile(),
        fetchCartItems()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile including addresses
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${url}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.user.address || []);
        
        // Set default address as selected
        const defaultAddress = data.user.address?.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        } else if (data.user.address?.length > 0) {
          setSelectedAddress(data.user.address[0]._id);
        }
      } else {
        console.error('Error fetching user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${url}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cart?.items || []);
        console.log(data.cart)
        setOrderTotals({
          platformFee: data.cart?.platfromfee || 30,
          total: Number(data.cart?.total) || 0,
          subTotal: data.cart?.subTotal || 0
        });
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Add new address
  const handleAddressSubmit = async () => {
    if (!newAddress.street || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setAddressLoading(true);
      
      if (editingAddress) {
        // Update existing address
        const response = await fetch(`${url}/api/users/addresses/${editingAddress}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAddress)
        });

        if (response.ok) {
          // Re-fetch all addresses to get the updated state
          await fetchUserProfile();
          resetAddressForm();
          alert('Address updated successfully');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Error updating address');
        }
      } else {
        // Add new address
        const response = await fetch(`${url}/api/users/address`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAddress)
        });

        if (response.ok) {
          // Re-fetch all addresses to get the updated state
          await fetchUserProfile();
          resetAddressForm();
          alert('Address added successfully');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Error adding address');
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address. Please try again.');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress({
      street: address.street || '',
      landmark: address.landmark || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      isDefault: address.isDefault || false
    });
    setEditingAddress(address._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (addresses.length <= 1) {
      alert('You must have at least one address');
      return;
    }

    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setAddressLoading(true);
      const response = await fetch(`${url}/api/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Re-fetch all addresses to get the updated state
        await fetchUserProfile();
        alert('Address deleted successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error deleting address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Error deleting address. Please try again.');
    } finally {
      setAddressLoading(false);
    }
  };

  const resetAddressForm = () => {
    setNewAddress({
      street: '',
      landmark: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);

      // Find selected address details
      const selectedAddressData = addresses.find(addr => addr._id === selectedAddress);
      
      if (!selectedAddressData) {
        alert('Selected address not found');
        return;
      }

      // Prepare items in the format your backend expects
      const orderItems = cartItems.map(item => ({
        name: item.product.name,
        price: item.product.price,
        seller:item.product.seller,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
        _id: item.product._id
      }));

      const orderData = {
        items: orderItems,
        amount: orderTotals.total,
        address: {
          street: selectedAddressData.street,
          address: selectedAddressData.address,
          landmark: selectedAddressData.landmark || '',
          city: selectedAddressData.city,
          state: selectedAddressData.state,
          pincode: selectedAddressData.pincode
        },
        paymentMethod: paymentMethod === 'cod' ? 'cash_on_delivery' : 'online'
      };
      console.log(orderData.amount)
      const response = await fetch(`${url}/api/orders/place`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        if (paymentMethod === 'online') {
          // Redirect to Stripe checkout
          if (data.session_url) {
            window.location.href = data.session_url;
          } else {
            alert('Error creating payment session');
          }
        } else {
          // COD order confirmed
          alert('Order confirmed! You will pay cash on delivery.');
          // Redirect to orders page or success page
          window.location.href = '/orders';
        }
      } else {
        alert(data.message || 'Error creating order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600">Add some items to your cart before checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Address Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  disabled={addressLoading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:bg-gray-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </button>
              </div>

              {/* Address Form */}
              {showAddressForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street *"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Full Address *"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City *"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="PIN Code *"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                        className="mr-2"
                      />
                      Set as default address
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddressSubmit}
                        disabled={addressLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center"
                      >
                        {addressLoading && <Loader className="w-4 h-4 animate-spin mr-2" />}
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        onClick={resetAddressForm}
                        disabled={addressLoading}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Loading State */}
              {addressLoading && (
                <div className="text-center py-4">
                  <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">Updating addresses...</p>
                </div>
              )}

              {/* Saved Addresses */}
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddress === address._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <input
                              type="radio"
                              checked={selectedAddress === address._id}
                              onChange={() => setSelectedAddress(address._id)}
                              className="mr-3"
                            />
                            <h4 className="font-medium text-gray-900">{address.street}</h4>
                            {address.isDefault && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="ml-6 text-gray-600">
                            <p>{address.address}</p>
                            {address.landmark && <p>Near: {address.landmark}</p>}
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            disabled={addressLoading}
                            className="text-purple-600 hover:text-purple-800 disabled:text-gray-400"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {addresses.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(address._id);
                              }}
                              disabled={addressLoading}
                              className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Your First Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Online Payment</h4>
                    <p className="text-gray-600 text-sm">Pay securely with card, UPI, or wallet</p>
                  </div>
                  <span className="text-purple-600 text-sm font-medium">Secure</span>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Cash on Delivery</h4>
                    <p className="text-gray-600 text-sm">Pay when your order is delivered</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">Available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={`${url}${item.product?.images?.[0]}`}
                      alt={item.product?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {item.product?.name || 'Product'}
                      </h4>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      ₹{((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(orderTotals.subTotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span>₹{(orderTotals.platformFee ||0)}</span>
                </div>
                
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{(orderTotals.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                onClick={handleConfirmOrder}
                disabled={!selectedAddress || submitting || cartItems.length === 0 || addressLoading}
                className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  paymentMethod === 'online' ? 'Proceed to Payment' : 'Confirm Order'
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center">
                  <span className="mr-1">🔒</span>
                  Secure checkout powered by SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;