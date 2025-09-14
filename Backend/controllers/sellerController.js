const Product = require("../models/Product")
const Order = require("../models/Order")

// Get seller dashboard stats
const getDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id

    // Get total products
    const totalProducts = await Product.countDocuments({ seller: sellerId })

    // Get orders containing seller's products
    const orders = await Order.find({
      "items.product": {
        $in: await Product.find({ seller: sellerId }).distinct("_id"),
      },
    }).populate("items.product")

    // Calculate stats
    let totalRevenue = 0
    let totalOrders = 0
    const orderStats = {}

    orders.forEach((order) => {
      const sellerItems = order.items.filter((item) => item.product.seller.toString() === sellerId)

      if (sellerItems.length > 0) {
        totalOrders++
        const orderRevenue = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        totalRevenue += orderRevenue

        // Count orders by status
        orderStats[order.status] = (orderStats[order.status] || 0) + 1
      }
    })

    res.json({
      dashboard: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue.toFixed(2),
        orderStats,
      },
    })
  } catch (error) {
    console.error("Get dashboard error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get seller's products
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const products = await Product.find({ seller: req.user.id })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Product.countDocuments({ seller: req.user.id })

    res.json({
      products,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / Number.parseInt(limit)),
        totalProducts: total,
      },
    })
  } catch (error) {
    console.error("Get seller products error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get seller's orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get seller's product IDs
    const sellerProductIds = await Product.find({ seller: req.user.id }).distinct("_id")

    // Build filter
    const filter = {
      "items.product": { $in: sellerProductIds },
    }

    if (status) {
      filter.status = status
    }

    const orders = await Order.find(filter)
      .populate({
        path: "items.product",
        select: "name price images seller",
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Filter orders to only show items from this seller
    const filteredOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter((item) => item.product.seller.toString() === req.user.id),
    }))

    const total = await Order.countDocuments(filter)

    res.json({
      orders: filteredOrders,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / Number.parseInt(limit)),
        totalOrders: total,
      },
    })
  } catch (error) {
    console.error("Get seller orders error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getDashboard,
  getProducts,
  getOrders,
}
