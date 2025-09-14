const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { getProfile, updateProfile, changePassword } = require("../controllers/userController")

const router = express.Router()

router.get("/profile", authenticateToken, getProfile)
router.put("/profile", authenticateToken, updateProfile)
router.put("/change-password", authenticateToken, changePassword)

module.exports = router
