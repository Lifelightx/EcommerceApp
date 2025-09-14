const jwt = require("jsonwebtoken")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select("_id email role isActive")

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token" })
    }

    req.user = { id: user._id, email: user.email, role: user.role }
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" })
  }
}

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    next()
  }
}

module.exports = { authenticateToken, authorize }
