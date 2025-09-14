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
}
