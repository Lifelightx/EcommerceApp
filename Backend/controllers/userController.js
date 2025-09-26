const bcrypt = require("bcrypt")
const User = require("../models/User")

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      })

      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
      { new: true },
    ).select("-password")

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


// Add a new address
const addAddress = async (req, res) => {
  try {
    const { street, landmark, address, city, state, pincode, isDefault } = req.body

    // Validate required fields
    if (!street || !address || !city || !state || !pincode) {
      return res.status(400).json({ 
        error: "Street, address, city, state, and pincode are required" 
      })
    }

    // Find the user
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      user.address.forEach(addr => {
        addr.isDefault = false
      })
    }

    // If this is the first address, make it default
    const makeDefault = isDefault || user.address.length === 0

    // Create new address object
    const newAddress = {
      street,
      landmark: landmark || "",
      address,
      city,
      state,
      pincode,
      isDefault: makeDefault
    }

    // Add the new address
    user.address.push(newAddress)
    await user.save()

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress
    })
  } catch (error) {
    console.error("Add address error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get all addresses for a user
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("address")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      message: "Addresses retrieved successfully",
      addresses: user.address
    })
  } catch (error) {
    console.error("Get addresses error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get a specific address
const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.user.id).select("address")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const address = user.address.id(addressId)
    if (!address) {
      return res.status(404).json({ error: "Address not found" })
    }

    res.json({
      message: "Address retrieved successfully",
      address
    })
  } catch (error) {
    console.error("Get address error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update an address
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params
    const { street, landmark, address, city, state, pincode, isDefault } = req.body

    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const addressToUpdate = user.address.id(addressId)
    if (!addressToUpdate) {
      return res.status(404).json({ error: "Address not found" })
    }

    // If setting this address as default, remove default from others
    if (isDefault && !addressToUpdate.isDefault) {
      user.address.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false
        }
      })
    }

    // Update the address fields
    if (street !== undefined) addressToUpdate.street = street
    if (landmark !== undefined) addressToUpdate.landmark = landmark
    if (address !== undefined) addressToUpdate.address = address
    if (city !== undefined) addressToUpdate.city = city
    if (state !== undefined) addressToUpdate.state = state
    if (pincode !== undefined) addressToUpdate.pincode = pincode
    if (isDefault !== undefined) addressToUpdate.isDefault = isDefault

    await user.save()

    res.json({
      message: "Address updated successfully",
      address: addressToUpdate
    })
  } catch (error) {
    console.error("Update address error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params

    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const addressToDelete = user.address.id(addressId)
    if (!addressToDelete) {
      return res.status(404).json({ error: "Address not found" })
    }

    const wasDefault = addressToDelete.isDefault

    // Remove the address
    user.address.pull(addressId)

    // If the deleted address was default and there are other addresses,
    // make the first one default
    if (wasDefault && user.address.length > 0) {
      user.address[0].isDefault = true
    }

    await user.save()

    res.json({
      message: "Address deleted successfully"
    })
  } catch (error) {
    console.error("Delete address error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" })
    }

    // Get user with password
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    user.password = hashedNewPassword
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  addAddress,
  getAddressById,
  getAddresses,
  deleteAddress,
  updateAddress
}
