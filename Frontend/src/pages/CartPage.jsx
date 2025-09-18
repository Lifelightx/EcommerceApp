import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { ShoppingCart, Trash2, ArrowLeft, Package, Heart } from "lucide-react"
import { StoreContext } from "../ContextApi"

function CartPage() {
  const [cartItems, setCartItems] = useState([]) // array only
  const [loading, setLoading] = useState(true)
  const { url, token } = useContext(StoreContext)

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${url}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Fetched cart:", res.data.cart.items)
      setCartItems(res.data.cart.items || [])
    } catch (err) {
      console.error("Error fetching cart:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={48} className="text-orange-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-12 py-10 from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 ">
        {/* Header */}
        <div className="mb-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-1 transition-colors">
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={32} className="text-orange-600" />
                  
                </div>
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative group">
                      {item.product.images?.[0] && (
                        <img
                          src={`${url}${item.product.images[0]}`}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200"
                        />
                      )}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <Package size={12} className="text-orange-600" />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                          {item.product.name}
                        </h3>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors group">
                          <Heart size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">Qty:</span>
                            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Price:</span>
                            <span className="text-gray-800 font-semibold ml-1">₹{item.product.price}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500 line-through">
                              ₹{Math.round(item.product.price * item.quantity * 1.2)}
                            </p>
                            <p className="font-bold text-xl text-gray-800">
                              ₹{item.product.price * item.quantity}
                            </p>
                          </div>
                          <button className="p-2 rounded-full hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200 hover:scale-110">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={24} className="text-orange-600" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="text-green-600">-₹{Math.round(totalAmount * 0.1)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-xl text-orange-600">₹{Math.round(totalAmount * 0.9)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                  Proceed to Checkout
                </button>
                <button className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-xl font-semibold transition-all duration-200">
                  Continue Shopping
                </button>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">🎉 Great choice!</span> You're saving ₹{Math.round(totalAmount * 0.1)} on this order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage