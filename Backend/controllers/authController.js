const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Otp = require("../models/Otp")
const sendEmail = require("../utils/sendMail")
const VerifiedEmail = require("../models/verifiedEmail")
// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" })
}

// Register user
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role = "customer" } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "First name, last name, email, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Create user (password will be hashed automatically by pre("save"))
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refreshToken in DB (optional, if you want persistent refresh tokens)
    user.refreshToken = refreshToken;
    await user.save();

    // Return user data without password
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Return user data without password
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }

    res.json({
      message: "Login successful",
      user: userData,
      token,
      refreshToken,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" })
    }

    // Generate new tokens
    const newToken = generateToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({ error: "Invalid refresh token" })
  }
}

// Logout user
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    res.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get me error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

//otp 
const sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  try {
    // check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // store OTP temporarily in DB or Redis
    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // send email
    await sendEmail(email,otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await Otp.findOne({ email, otp });

    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // delete OTP after use (one-time)
    await Otp.deleteOne({ email, otp });

    // mark this email as verified (could use Redis or a temp collection)
    await VerifiedEmail.create({ email });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  register,
  login,
  refreshToken,
  logout,
  getMe,
}
