const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const path = require("path")
require("dotenv").config()

const connectDB = require("./config/database")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const sellerRoutes = require("./routes/sellers")
const productRoutes = require("./routes/products")
const orderRoutes = require("./routes/orders")
const cartRoutes = require("./routes/cart")

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

// Security middleware
app.use(helmet())
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://yourfrontend.com",
  `${process.env.FRONTEND_URL}`
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you need cookies/auth headers
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/sellers", sellerRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
