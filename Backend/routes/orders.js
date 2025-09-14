const express = require("express")
const { authenticateToken, authorize } = require("../middleware/auth")
const { createOrder, getOrders, getOrder, updateOrderStatus } = require("../controllers/orderController")

const router = express.Router()

router.post("/", authenticateToken, createOrder)
router.get("/", authenticateToken, getOrders)
router.get("/:id", authenticateToken, getOrder)
router.put("/:id/status", authenticateToken, authorize(["seller"]), updateOrderStatus)

module.exports = router
