import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { ShoppingCart, Trash2 } from "lucide-react"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <ShoppingCart size={48} className="mb-3" />
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart size={28} />
        My Cart
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b pb-4 last:border-none last:pb-0"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              {item.product.images?.[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
              )}
              <div>
                <h2 className="font-semibold">{item.product.name}</h2>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × ₹{item.product.price}
                </p>
              </div>
            </div>

            {/* Price + Delete */}
            <div className="flex items-center gap-4">
              <p className="font-bold text-lg text-gray-800">
                ₹{item.product.price * item.quantity}
              </p>
              <button className="p-2 rounded-full hover:bg-red-100 text-red-600 transition">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {/* Cart Summary */}
        <div className="flex justify-between items-center pt-4 border-t">
          <h2 className="font-semibold text-lg">Total</h2>
          <p className="font-bold text-xl text-gray-900">
            ₹
            {cartItems.reduce(
              (acc, item) => acc + item.product.price * item.quantity,
              0
            )}
          </p>
        </div>

        <button className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage
