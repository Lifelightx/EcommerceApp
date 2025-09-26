const express = require('express')
const { 
    placeOrder, 
    verifyOrder, 
    userOrders, 
    listOrders, 
    updateOrderStatus, 
    cancelOrder,
    getOrderById 
} = require('../controllers/orderController')
const { authenticateToken } = require('../middleware/auth')
const orderRouter = express.Router()

// Place order (both online and COD)
orderRouter.post('/place', authenticateToken, placeOrder)

// Verify online payment
orderRouter.post('/verify', verifyOrder)

// Get user orders
orderRouter.get('/userorders', authenticateToken, userOrders)

// Get all orders (admin)
orderRouter.get('/list', listOrders)

// Get single order by ID
orderRouter.get('/:orderId', authenticateToken, getOrderById)

// Update order status (admin)
orderRouter.post('/status', updateOrderStatus)

// Cancel order (user)
orderRouter.post('/cancel', authenticateToken, cancelOrder)

module.exports = orderRouter    