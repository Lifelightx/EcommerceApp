const Order = require("../models/Order")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const mongoose = require("mongoose")

// Create order
const createOrder = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { shippingAddress, paymentMethod = "cash_on_delivery" } = req.body

    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" })
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product").session(session)

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction()
      return res.status(400).json({ error: "Cart is empty" })
    }

    // Validate stock and calculate total
    let total = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session)

      if (!product) {
        await session.abortTransaction()
        return res.status(400).json({ error: `Product ${item.product.name} not found` })
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction()
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        })
      }

      // Reduce stock
      product.stock -= item.quantity
      await product.save({ session })

      // Add to order items
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      })

      total += product.price * item.quantity
    }

    // Create order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod,
    })

    await order.save({ session })

    // Clear cart
    cart.items = []
    await cart.save({ session })

    await session.commitTransaction()

    // Populate order for response
    await order.populate([
      {
        path: "items.product",
        select: "name price images",
      },
      {
        path: "user",
        select: "name email",
      },
    ])

    res.status(201).json({
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    await session.abortTransaction()
    console.error("Create order error:", error)
    res.status(500).json({ error: "Internal server error" })
  } finally {
    session.endSession()
  }
}

// Get user's orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: "items.product",
        select: "name price images",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Order.countDocuments({ user: req.user.id })

    res.json({
      orders,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / Number.parseInt(limit)),
        totalOrders: total,
      },
    })
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "items.product",
        select: "name price images",
        populate: {
          path: "seller",
          select: "name email",
        },
      })
      .populate("user", "name email")

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Check if user owns the order or is a seller of any item
    const isOwner = order.user._id.toString() === req.user.id
    const isSeller = order.items.some((item) => item.product.seller._id.toString() === req.user.id)

    if (!isOwner && !isSeller) {
      return res.status(403).json({ error: "Not authorized to view this order" })
    }

    res.json({ order })
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update order status (sellers only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const order = await Order.findById(req.params.id).populate("items.product")

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Check if user is seller of any item in the order
    const isSeller = order.items.some((item) => item.product.seller.toString() === req.user.id)

    if (!isSeller) {
      return res.status(403).json({ error: "Not authorized to update this order" })
    }

    order.status = status
    await order.save()

    res.json({
      message: "Order status updated successfully",
      order,
    })
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
}
