import React, { useState, useEffect, useContext } from 'react';
import { Calendar, MapPin, CreditCard, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { StoreContext } from '../ContextApi';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate()
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/orders/userorders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
        console.log(data)
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token, url]);

  const getStatusColor = (status) => {
    const statusColors = {
      'Order Placed': 'bg-blue-100 text-blue-800',
      'Order Confirmed': 'bg-green-100 text-green-800',
      'Shipped': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Clock className="w-4 h-4" />;
      case 'Order Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Shipped':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <Package className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900">
                        Order Id: {order._id.toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.date)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="text-lg font-bold text-gray-900">₹{order.amount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item._id}
                            onClick={()=>navigate(`/details/${item._id}`)}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={`${url}${item.image}`}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-md bg-white"
                              onError={(e) => {
                                e.target.src = '/api/placeholder/48/48';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 truncate">{item.name}</h5>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span>Qty: {item.quantity}</span>
                                <span>₹{item.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4">
                      {/* Delivery Address */}
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Delivery Address
                        </h4>
                        <div className="text-sm text-purple-900 bg-gray-50 p-3 rounded-lg">
                          <div>{order.address.street}, {order.address.address}</div>
                          {order.address.landmark && <div>Near {order.address.landmark}</div>}
                          <div>{order.address.city}, {order.address.state}</div>
                          <div>PIN: {order.address.pincode}</div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Payment
                        </h4>
                        <div className="text-sm bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Method:</span>
                            <span className="font-medium text-gray-900 capitalize">
                              {order.paymentMethod.replaceAll('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                              {order.payment ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      {(order.deliveredAt || order.cancelledAt) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {order.deliveredAt && (
                              <div>Delivered: {formatDate(order.deliveredAt)}</div>
                            )}
                            {order.cancelledAt && (
                              <div>Cancelled: {formatDate(order.cancelledAt)}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;