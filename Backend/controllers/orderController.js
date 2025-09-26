const { verify } = require('jsonwebtoken')
const orderModel = require('../models/Order')
const userModel = require('../models/User')
const cartModel = require('../models/Cart')
const productModel = require("../models/Product")
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Place order (supports both online and COD)
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL

  try {
    const { items, amount, address, paymentMethod = 'online' } = req.body
    const userId = req.user.id;
    console.log(amount)
    // Validate required fields
    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    // Validate payment method
    if (!['online', 'cash_on_delivery'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' })
    }

    // Create new order
    const newOrder = new orderModel({
      userId: userId,
      items: items,
      amount: amount,
      address: address,
      paymentMethod: paymentMethod,
      payment: paymentMethod === 'cash_on_delivery' ? false : true, // COD orders are considered "paid"
      status: paymentMethod === 'cash_on_delivery' ? 'Order Confirmed' : 'Order Placed'
    })

    await newOrder.save()

    for (const item of items) {
      await productModel.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity }
      });
      // console.log(item.quantity, item)
    }

    // Clear user's cart
    await cartModel.findOneAndUpdate(
      { user: userId },       // find by user field
      { $set: { items: [] } } // clear items array
    )


    // Handle payment method
    if (paymentMethod === 'online') {
      // Create Stripe session for online payment
      const line_items = items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity
      }))

      // Add delivery charges
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Delivery Charges'
          },
          unit_amount: 25 * 100,
        },
        quantity: 1
      })

      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        metadata: {
          orderId: newOrder._id.toString()
        }
      })

      res.json({
        success: true,
        session_url: session.url,
        orderId: newOrder._id,
        paymentMethod: 'online'
      })
    } else {
      // Cash on delivery - order is immediately confirmed
      res.json({
        success: true,
        message: 'Order placed successfully! You will pay cash on delivery.',
        orderId: newOrder._id,
        paymentMethod: 'cash_on_delivery',
        order: newOrder
      })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}

// Verify online payment order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body

  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: 'Order Confirmed'
      })
      res.json({ success: true, message: 'Payment successful! Order confirmed.' })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: 'Payment cancelled. Order has been removed.' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error processing payment verification' })
  }
}

// Get user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id }).sort({ date: -1 })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error fetching orders' })
  }
}

// Get all orders for admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error fetching orders' })
  }
}

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body

    // Validate status
    const validStatuses = ['Order Placed', 'Order Confirmed', 'Out for delivery', 'Delivered', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    await orderModel.findByIdAndUpdate(orderId, { status: status })
    res.json({ success: true, message: 'Status updated successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error updating status' })
  }
}

// Cancel order (user can cancel if not yet delivered)
const cancelOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body

    const order = await orderModel.findById(orderId)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Check if user owns this order
    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' })
    }

    // Check if order can be cancelled (not delivered)
    if (order.status === 'Delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel delivered order' })
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' })
    }

    // Update order status to cancelled
    await orderModel.findByIdAndUpdate(orderId, {
      status: 'Cancelled',
      cancelledAt: new Date()
    })

    res.json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error cancelling order' })
  }
}

// Get single order details
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    const { userId } = req.body

    const order = await orderModel.findById(orderId)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // Check if user owns this order (for regular users)
    if (userId && order.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' })
    }

    res.json({ success: true, data: order })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error fetching order details' })
  }
}

module.exports = {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById
}