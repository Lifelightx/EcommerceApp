import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContext } from '../ContextApi'
import { useContext } from 'react'
import { Package, MapPin, Calendar, CreditCard } from 'lucide-react'

function Orders() {
    const { url, sellerToken } = useContext(StoreContext)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingOrder, setUpdatingOrder] = useState(null)

    const fetchOrders = () => {
        setLoading(true)
        axios.get(`${url}/api/orders/sellerOrders`, {
            headers: {
                Authorization: `Bearer ${sellerToken}`,
            }
        }).then(res => {
            setOrders(res.data.data || [])
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }

    const updateOrderStatus = (orderId) => {
        setUpdatingOrder(orderId)
        axios.put(`${url}/api/orders/status`, 
            { 
                orderId, 
                status: 'Order Processed' 
            },
            {
                headers: {
                    Authorization: `Bearer ${sellerToken}`,
                }
            }
        ).then(res => {
            fetchOrders()
            setUpdatingOrder(null)
        }).catch(err => {
            console.error(err)
            setUpdatingOrder(null)
            alert('Failed to update order status')
        })
    }

    useEffect(() => {
        if (sellerToken) {
            fetchOrders()
        }
    }, [sellerToken, url])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'Order Confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'Order Processed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'Shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'Delivered':
                return 'bg-gray-100 text-gray-800 border-gray-200'
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-2">Manage and process your customer orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600">When customers place orders, they will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(order.date)}
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <Package className="w-4 h-4 mr-2" />
                                                Order Items
                                            </h4>
                                            <div className="space-y-3">
                                                {order.items.map((item) => (
                                                    <div key={item._id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                                                        <img 
                                                            src={`${url}${item.image}`} 
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{item.name}</p>
                                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                Delivery Address
                                            </h4>
                                            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                                                <p className="text-gray-900">{order.address.street}</p>
                                                <p className="text-gray-900">{order.address.address}</p>
                                                <p className="text-gray-600">{order.address.landmark}</p>
                                                <p className="text-gray-900">{order.address.city}, {order.address.state}</p>
                                                <p className="text-gray-900 font-semibold">PIN: {order.address.pincode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center text-sm">
                                                <CreditCard className="w-4 h-4 mr-2 text-gray-600" />
                                                <span className="text-gray-600">Payment:</span>
                                                <span className={`ml-2 font-semibold ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {order.payment ? 'Paid' : 'COD'}
                                                </span>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">
                                                Total: ₹{order.amount}
                                            </div>
                                        </div>

                                        {order.status === 'Order Confirmed' && (
                                            <button
                                                onClick={() => updateOrderStatus(order._id)}
                                                disabled={updatingOrder === order._id}
                                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                                            >
                                                {updatingOrder === order._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Updating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Package className="w-4 h-4" />
                                                        <span>Mark as Processed</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders