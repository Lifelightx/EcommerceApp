import { useState, useEffect, useRef, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom";
const MotionLink = motion(Link);
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Package,
  Settings,
  LogOut,
  ChevronDown,
  Heart,
  Bell
} from "lucide-react"
import axios from "axios";
import { StoreContext } from "../ContextApi";
import { useNotification } from "../NotificationContext";

const ProfessionalNavbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [signupStep, setSignupStep] = useState(1) // 1 = email, 2 = otp, 3 = details
  const [signupEmail, setSignupEmail] = useState("")
  const [otp, setOtp] = useState("")
  const { showSuccess, showError, showWarning } = useNotification();
  const navigate = useNavigate();
  const { url, token, setToken, setUser } = useContext(StoreContext);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  const [signupFormData, setSignupFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3)
  const [notificationCount, setNotificationCount] = useState(2)
  const [isScrolled, setIsScrolled] = useState(false)

  const userMenuRef = useRef(null)
  const modalRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowAuthModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
   // Save token and user to localStorage when they change
  
  const handleAuth = () => {
    // Handle login
    if (authMode === 'login') {
      // Simulate authentication
      axios.post(`${url}/api/auth/login`, loginData)
        .then(res => {
          if (res.status === 200){
            setUser(res.data.user)
            setToken(res.data.token)
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            navigate("/shop")
          setShowAuthModal(false)
          setAuthMode('login')
          }
          
          
        }).catch((err) => {
          console.log(err)
          if(err.response.status === 401)
            showError(err.response.data.error)
          if(err.response.status === 400){
            showError(err.response.data.error)
          }
        })

    }
  }

  // Step 1: Send OTP
  const handleSendOtp = () => {
    if (!signupEmail) return alert("Please enter email");
    // call backend API here to send OTP
    axios.post(`${url}/api/auth/send-otp`, { email: signupEmail })
      .then(res => {
        if (res.status === 200) {
          setSignupStep(2);
        }
      })
      .catch(err => console.log(err))

  };

  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (!otp) return alert("Please enter OTP");
    // call backend API to verify OTP
    axios.post(`${url}/api/auth/verify-otp`, { email: signupEmail, otp: otp })
      .then(res => {
        console.log(res)
        setSignupStep(3);
      })
      .catch(err => console.log(err))
    console.log("Verifying OTP", otp);

  };

  // Step 3: Final signup
  const handleSignup = () => {
    if (signupFormData.password.length < 8)
      return alert("Password must be at least 8 characters");
    if (signupFormData.password !== signupFormData.confirmPassword)
      return alert("Passwords do not match");

    const payload = {
      firstName: signupFormData.fname,
      lastName: signupFormData.lname,
      email: signupEmail,
      password: signupFormData.password,
      phone: signupFormData.phone,
      // optional, backend defaults to "customer"
    };

    // console.log("Sending signup payload:", payload);

    axios.post(`${url}/api/auth/register`, payload)
      .then(res => {
        if (res.status === 201) {
          // console.log("User registered:", res.data);
          // setIsLoggedIn(true);
          setShowAuthModal(false);
          setUser(res.data.user)
          setToken(res.data.token)
          navigate("/shop")
          // Reset form
          setSignupStep(1);
          setSignupEmail("");
          setOtp("");
          setSignupFormData({
            fname: "",
            lname: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
        }
      })
      .catch(err => {
        if (err.response) {
          console.error("Backend error:", err.response.data);
          alert(err.response.data.error || "Signup failed");
        } else {
          console.error("Error:", err.message);
        }
      });
  };

  const handleLogout = () => {
    // setIsLoggedIn(false)
     setToken("");
     navigate("/")
    setUser(null);

  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Close menu
  setShowUserMenu(false);
    // Reset signup form when logging out
    setSignupStep(1)
    setSignupEmail("")
    setOtp("")
    setSignupFormData({
      fname: "",
      lname: "",
      phone: "",
      password: "",
      confirmPassword: "",
    })
  }

  const navLinks = [
    { name: 'Home', href: '' },
    { name: 'Shop', href: 'shop' },
    { name: 'Categories', href: 'categories' },
    { name: 'Deals', href: 'deals' },
    { name: 'About', href: 'about' },
    { name: 'Contact', href: 'contact' }
  ]

  const userMenuItems = [
    { icon: Package, label: 'Orders', action: () => navigate("/orders") },
    { icon: Settings, label: 'Profile', action: () => navigate("/profile") },
    { icon: LogOut, label: 'Logout', action: handleLogout }
  ]

  return (
    <>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white/90 backdrop-blur-sm'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">
                ApStore
              </span>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <MotionLink
                  key={link.name}
                  to={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
                >
                  {link.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-600 group-hover:w-full transition-all duration-200"
                  />
                </MotionLink>
              ))}
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64"
            >
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-500"
              />
            </motion.div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {!token ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="hidden md:flex items-center space-x-3"
                >
                  <motion.button
                    onClick={() => {
                      setAuthMode('login')
                      setShowAuthModal(true)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-700 hover:text-purple-600 font-medium px-4 py-2 rounded-full transition-colors duration-200"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign Up
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="hidden md:flex items-center space-x-4"
                >
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {notificationCount}
                      </motion.span>
                    )}
                  </motion.button>

                  {/* Wishlist */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                  >
                    <Heart className="w-5 h-5" />
                  </motion.button>

                  {/* Cart */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={()=>navigate('/cart')}
                    className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </motion.button>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <motion.button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-2 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </motion.button>

                    {/* User Dropdown Menu */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                        >
                          {userMenuItems.map((item, index) => (
                            <motion.button
                              key={item.label}
                              onClick={item.action}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: '#f3f4f6' }}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:text-purple-600 transition-colors duration-200"
                            >
                              <item.icon className="w-4 h-4" />
                              <span className="font-medium">{item.label}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-gray-200 mt-2 pt-4 pb-4"
              >
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="block py-2 px-4 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                {!token ? (
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        setAuthMode('login')
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full py-2 px-4 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-all duration-200 text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('signup')
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-600 text-white rounded-lg font-medium"
                    >
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      <Heart className="w-5 h-5 text-gray-600" />
                      <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    {userMenuItems.map((item, index) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center space-x-3 py-2 px-4 text-left text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(6px)"
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {authMode === 'login' ? 'Welcome Back!' :
                    signupStep === 1 ? 'Create Account' :
                      signupStep === 2 ? 'Verify Your Email' :
                        'Complete Your Profile'}
                </h2>
                <p className="text-gray-600">
                  {authMode === 'login'
                    ? 'Sign in to your account to continue'
                    : signupStep === 1
                      ? 'Enter your email to get started'
                      : signupStep === 2
                        ? `We've sent a verification code to ${signupEmail}`
                        : 'Complete your profile to finish registration'}
                </p>
              </div>

              {/* Login Form */}
              {authMode === 'login' && (
                <div className="space-y-4">
                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="email"
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />

                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    type="password"
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAuth}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Sign In
                  </motion.button>
                </div>
              )}

              {/* Signup Form - Step 1: Email */}
              {authMode === 'signup' && signupStep === 1 && (
                <div className="space-y-4">
                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendOtp}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-purple-700 transition-all duration-200"
                  >
                    Get Verification Code
                  </motion.button>
                </div>
              )}

              {/* Signup Form - Step 2: OTP */}
              {authMode === 'signup' && signupStep === 2 && (
                <div className="space-y-4">
                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSignupStep(1)}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleVerifyOtp}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition-all duration-200"
                    >
                      Verify Code
                    </motion.button>
                  </div>

                  <div className="text-center">
                    <button className="text-sm text-purple-600 hover:text-purple-600 transition-colors duration-200">
                      Didn't receive the code? Resend
                    </button>
                  </div>
                </div>
              )}

              {/* Signup Form - Step 3: Details */}
              {authMode === 'signup' && signupStep === 3 && (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="text"
                      placeholder="First Name"
                      value={signupFormData.fname}
                      onChange={(e) => setSignupFormData({ ...signupFormData, fname: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                    <motion.input
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      type="text"
                      placeholder="Last Name"
                      value={signupFormData.lname}
                      onChange={(e) => setSignupFormData({ ...signupFormData, lname: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    type="tel"
                    placeholder="Phone Number"
                    value={signupFormData.phone}
                    onChange={(e) => setSignupFormData({ ...signupFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  />

                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={signupFormData.password}
                    onChange={(e) => setSignupFormData({ ...signupFormData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  />

                  <motion.input
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    type="password"
                    placeholder="Confirm Password"
                    value={signupFormData.confirmPassword}
                    onChange={(e) => setSignupFormData({ ...signupFormData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  />

                  <div className="flex space-x-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSignupStep(2)}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSignup}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Create Account
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {authMode === 'login' ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setAuthMode('signup')}
                        className="text-purple-600 hover:text-purple-600 font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setAuthMode('login')}
                        className="text-purple-600 hover:text-purple-600 font-medium"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProfessionalNavbar
