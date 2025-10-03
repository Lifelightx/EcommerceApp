const mongoose = require('mongoose')
const orderModel = require('../models/Order')
const cartModel = require('../models/Cart')
const productModel = require("../models/Product")
const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ======================
// PLACE ORDER
// ======================
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;

  try {
    const { items, amount, address, paymentMethod = 'online' } = req.body;
    const userId = req.user.id;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!['online', 'cash_on_delivery'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    const createdOrders = [];

    // ✅ Create an order for EACH item
    for (const item of items) {
      // console.log(item)
      const newOrder = new orderModel({
        userId,
        sellerId: item.seller?._id?.toString() || item.seller.toString(),
        items: [
          {
            image: item.image,   // product reference
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }
        ],
        amount: item.price * item.quantity,
        address,
        paymentMethod,
        payment: false,
        status: paymentMethod === 'cash_on_delivery' ? 'Order Confirmed' : 'Pending Payment'
      });

      await newOrder.save();
      createdOrders.push(newOrder);
    }

    // ✅ Handle payment method
    if (paymentMethod === 'online') {
      // Stripe line_items from each order
      const line_items = createdOrders.map(order => {
        const it = order.items[0];
        return {
          price_data: {
            currency: 'inr',
            product_data: { name: it.name },
            unit_amount: it.price * 100,
          },
          quantity: it.quantity,
        }
      });

      // Delivery charges
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: { name: 'Delivery Charges' },
          unit_amount: 25 * 100,
        },
        quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${frontend_url}/verify?success=true&orderIds=${createdOrders.map(o => o._id).join(',')}`,
        cancel_url: `${frontend_url}/verify?success=false&orderIds=${createdOrders.map(o => o._id).join(',')}`,
        metadata: { 
          orderIds: createdOrders.map(o => o._id.toString()).join(','),
          userId: userId.toString()
        }
      });

      return res.json({
        success: true,
        session_url: session.url,
        orderIds: createdOrders.map(o => o._id),
        paymentMethod: 'online'
      });

    } else {
      // ✅ COD: immediately deduct stock and clear cart
      for (const item of items) {
        await productModel.findByIdAndUpdate(item._id, {
          $inc: { stock: -item.quantity }
        });
      }

      await cartModel.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

      return res.json({
        success: true,
        message: 'Orders placed successfully! You will pay cash on delivery.',
        orderIds: createdOrders.map(o => o._id),
        paymentMethod: 'cash_on_delivery',
        orders: createdOrders
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// ======================
// VERIFY PAYMENT (for multiple orders)
// ======================
const verifyOrder = async (req, res) => {
  const { orderIds, success } = req.body;
  // console.log(orderIds) // multiple orderIds comma-separated

  try {
    if (success === "true") {
      for (const orderId of orderIds) {
        const order = await orderModel.findById(orderId);
        if (!order) continue;

        // Deduct stock
        for (const item of order.items) {
          await productModel.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
          });
        }

        // Update order status
        await orderModel.findByIdAndUpdate(orderId, {
          payment: true,
          status: 'Order Confirmed'
        });
      }

      // Empty cart
      const firstOrder = await orderModel.findById(orderIds[0]);
      if (firstOrder) {
        await cartModel.findOneAndUpdate(
          { user: firstOrder.userId },
          { $set: { items: [] } }
        );
      }

      return res.json({ success: true, message: 'Payment successful! Orders confirmed.' });

    } else {
      // Cancel all orders if payment failed
      for (const orderId of orderIds) {
        await orderModel.findByIdAndDelete(orderId);
      }
      return res.json({ success: false, message: 'Payment cancelled. Orders removed.' });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error processing payment verification' });
  }
};



// ======================
// OTHER FUNCTIONS (unchanged)
// ======================
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id }).sort({ date: -1 })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error fetching orders' })
  }
}

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error fetching orders' })
  }
}

const listSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id; 
    const orders = await orderModel.find({ sellerId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching seller orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  // console.log(req.body)
  try {
    const { orderId, status } = req.body
    const validStatuses = ['Order Placed', 'Order Confirmed','Order Processed', 'Out for delivery', 'Delivered', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: 'Status updated successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error updating status' })
  }
}

const cancelOrder = async (req, res) => {
  try {
    const { orderId, userId } = req.body
    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    if (order.status === 'Delivered') return res.status(400).json({ success: false, message: 'Cannot cancel delivered order' })
    if (order.status === 'Cancelled') return res.status(400).json({ success: false, message: 'Already cancelled' })
    await orderModel.findByIdAndUpdate(orderId, { status: 'Cancelled', cancelledAt: new Date() })
    res.json({ success: true, message: 'Order cancelled successfully' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Error cancelling order' })
  }
}

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    const { userId } = req.body
    const order = await orderModel.findById(orderId)
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    if (userId && order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
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
  getOrderById,
  listSellerOrders
}
