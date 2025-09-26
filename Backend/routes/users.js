const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { 
     getProfile,
     updateProfile,
     changePassword, 
     addAddress, 
     getAddresses,
     getAddressById, 
     updateAddress,
     deleteAddress,
     } = require("../controllers/userController")

const router = express.Router()

//profile routes
router.get("/profile", authenticateToken, getProfile)
router.put("/profile", authenticateToken, updateProfile)
router.put("/change-password", authenticateToken, changePassword)

//address routes
router.post("/address",authenticateToken, addAddress)
router.get('/addresses', authenticateToken, getAddresses)
router.get('/addresses/:addressId', authenticateToken, getAddressById)
router.put('/addresses/:addressId', authenticateToken, updateAddress)
router.delete('/addresses/:addressId', authenticateToken, deleteAddress)

module.exports = router
