const Cart = require("../models/Cart")
const Product = require("../models/Product")

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "name price images stock",
      populate: {
        path: "seller",
        select: "name",
      },
    })

    if (!cart) {
      return res.json({ cart: { items: [], total: 0 } })
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)

    res.json({
      cart: {
        items: cart.items,
        total: total.toFixed(2),
      },
    })
  } catch (error) {
    console.error("Get cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" })
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" })
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + Number.parseInt(quantity)

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Insufficient stock" })
      }

      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity: Number.parseInt(quantity),
      })
    }

    await cart.save()

    // Populate and return updated cart
    await cart.populate({
      path: "items.product",
      select: "name price images stock",
      populate: {
        path: "seller",
        select: "name",
      },
    })

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)

    res.json({
      message: "Item added to cart",
      cart: {
        items: cart.items,
        total: total.toFixed(2),
      },
    })
  } catch (error) {
    console.error("Add to cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" })
    }

    // Check product stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" })
    }

    // Update cart
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId)

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" })
    }

    cart.items[itemIndex].quantity = Number.parseInt(quantity)
    await cart.save()

    // Populate and return updated cart
    await cart.populate({
      path: "items.product",
      select: "name price images stock",
      populate: {
        path: "seller",
        select: "name",
      },
    })

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)

    res.json({
      message: "Cart updated",
      cart: {
        items: cart.items,
        total: total.toFixed(2),
      },
    })
  } catch (error) {
    console.error("Update cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" })
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId)

    await cart.save()

    // Populate and return updated cart
    await cart.populate({
      path: "items.product",
      select: "name price images stock",
      populate: {
        path: "seller",
        select: "name",
      },
    })

    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity
    }, 0)

    res.json({
      message: "Item removed from cart",
      cart: {
        items: cart.items,
        total: total.toFixed(2),
      },
    })
  } catch (error) {
    console.error("Remove from cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Clear cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { new: true })

    res.json({
      message: "Cart cleared",
      cart: { items: [], total: 0 },
    })
  } catch (error) {
    console.error("Clear cart error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}
