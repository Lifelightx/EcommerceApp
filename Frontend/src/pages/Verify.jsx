import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Package, CreditCard } from 'lucide-react';
import { StoreContext } from '../ContextApi';

const VerifyPayment = () => {
    const { url, token } = useContext(StoreContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [verificationResult, setVerificationResult] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);

    // Get URL parameters
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId && success !== null) {
            verifyPayment();
        } else {
            setError('Missing required parameters');
            setLoading(false);
        }
    }, [orderId, success]);

    const verifyPayment = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${url}/api/orders/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderId,
                    success: success
                })
            });

            const data = await response.json();

            if (data.success) {
                setVerificationResult({
                    success: success === 'true',
                    message: data.message
                });

                // If payment was successful, fetch order details
                if (success === 'true') {
                    await fetchOrderDetails();
                }

                // Auto redirect after 5 seconds
                setTimeout(() => {
                    if (success === 'true') {
                        navigate('/orders'); // Redirect to orders page on success
                    } else {
                        navigate('/cart'); // Redirect to cart on failure
                    }
                }, 5000);

            } else {
                setError(data.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setError('Network error occurred while verifying payment');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async () => {
        try {
            if (!token) return;

            const response = await fetch(`${url}/api/orders/userorders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                 // You might need to adjust this based on your API
            });

            if (response.ok) {
                const data = await response.json();
                // Find the specific order (you might need to adjust this logic)
                const order = data.data?.find(order => order._id === orderId);
                setOrderDetails(order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/orders');
    };

    const handleRetryPayment = () => {
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <Loader className="w-16 h-16 animate-spin mx-auto mb-6 text-purple-600" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Verifying Payment
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Please wait while we confirm your payment...
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                Do not close this page or navigate away
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <XCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Verification Error
                        </h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="space-y-3">
                            <button
                                onClick={handleRetryPayment}
                                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Payment Success
    if (verificationResult?.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full mx-4">
                    <div className="text-center">
                        <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Payment Successful!
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            {verificationResult.message}
                        </p>

                        {/* Order Details Card */}
                        {orderDetails && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                                <div className="flex items-center mb-4">
                                    <Package className="w-5 h-5 mr-2 text-purple-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order ID:</span>
                                        <span className="font-medium">#{orderId.slice(-8)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium">₹{orderDetails.amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-medium flex items-center">
                                            <CreditCard className="w-4 h-4 mr-1" />
                                            Online Payment
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium text-green-600">Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="text-left">
                                    <p className="text-green-800 font-medium text-sm">Order Confirmed!</p>
                                    <p className="text-green-700 text-sm mt-1">
                                        You will receive an email confirmation shortly. Your order will be processed and shipped soon.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleViewOrders}
                                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        {/* Auto Redirect Notice */}
                        <p className="text-xs text-gray-500 mt-4">
                            Redirecting to your orders in 5 seconds...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Payment Failed
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <XCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Payment Cancelled
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        {verificationResult?.message || 'Your payment was cancelled or failed.'}
                    </p>

                    {/* Cancellation Info */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div className="text-left">
                                <p className="text-red-800 font-medium text-sm">Order Cancelled</p>
                                <p className="text-red-700 text-sm mt-1">
                                    Your order has been cancelled and no payment was charged. You can try again or continue shopping.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRetryPayment}
                            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleContinueShopping}
                            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {/* Auto Redirect Notice */}
                    <p className="text-xs text-gray-500 mt-4">
                        Redirecting to cart in 5 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyPayment;