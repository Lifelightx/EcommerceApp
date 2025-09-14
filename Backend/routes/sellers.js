const express = require("express")
const { authenticateToken, authorize } = require("../middleware/auth")
const { getDashboard, getProducts, getOrders } = require("../controllers/sellerController")

const router = express.Router()

router.get("/dashboard", authenticateToken, authorize(["seller"]), getDashboard)
router.get("/products", authenticateToken, authorize(["seller"]), getProducts)
router.get("/orders", authenticateToken, authorize(["seller"]), getOrders)

module.exports = router
