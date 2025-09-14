const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController")

const router = express.Router()

router.get("/", authenticateToken, getCart)
router.post("/add", authenticateToken, addToCart)
router.put("/update/:productId", authenticateToken, updateCartItem)
router.delete("/remove/:productId", authenticateToken, removeFromCart)
router.delete("/clear", authenticateToken, clearCart)

module.exports = router
