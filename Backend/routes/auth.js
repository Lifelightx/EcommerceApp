const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { sendOtp,verifyOtp,register, login, refreshToken, logout, getMe } = require("../controllers/authController")

const router = express.Router()

router.post("/send-otp", sendOtp);     // step 1
router.post("/verify-otp", verifyOtp);
router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.post("/logout", logout)
router.get("/me", authenticateToken, getMe)

module.exports = router
