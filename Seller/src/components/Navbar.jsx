import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  User,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  BarChart3,
  ShoppingBag,
  Plus,
  FileText,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react";
import axios from "axios";
import { StoreContext } from "../ContextApi"; // adjust path

const MotionLink = motion(Link);

const Navbar = () => {
  const { url, sellerToken, setsellerToken, user, setUser } = useContext(StoreContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [signupStep, setSignupStep] = useState(1);
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupFormData, setSignupFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const userMenuRef = useRef(null);
  const modalRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
      if (modalRef.current && !modalRef.current.contains(event.target)) setShowAuthModal(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Login handler
  const handleAuth = () => {
    if (authMode === 'login') {
      axios.post(`${url}/api/auth/login`, loginData)
        .then(res => {
          if (res.status === 200) {
            console.log(res.data)
            setUser(res.data.user);
            setsellerToken(res.data.token);
            setShowAuthModal(false);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("sellerToken", res.data.token);
            setShowAuthModal(false);
            console.log("sellerToken: ",sellerToken)
            navigate('/dashboard')
          }
        })
        .catch(err => console.log(err));
    }
  };

  // Signup Step 1: Send OTP
  const handleSendOtp = () => {
    if (!signupEmail) return alert("Please enter email");
    axios.post(`${url}/api/auth/send-otp`, { email: signupEmail })
      .then(res => res.status === 200 && setSignupStep(2))
      .catch((err) => console.log(err) );
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    axios.post(`${url}/api/auth/verify-otp`, { email: signupEmail, otp })
      .then(res => res.status === 200 && setSignupStep(3))
      .catch(() => alert("Invalid OTP."));
  };

  // Step 3: Complete Signup
  const handleSignup = () => {
    if (signupFormData.password.length < 8) return alert("Password must be at least 8 characters");
    if (signupFormData.password !== signupFormData.confirmPassword) return alert("Passwords do not match");

    const payload = {
      firstName: signupFormData.fname,
      lastName: signupFormData.lname,
      email: signupEmail,
      password: signupFormData.password,
      phone: signupFormData.phone,
      role: "seller"
    };

    axios.post(`${url}/api/auth/register`, payload)
      .then(res => {
        if (res.status === 201) {
          setShowAuthModal(false);
          setUser(res.data.user);
          setsellerToken(res.data.token);
          navigate('/dashboard')
          setSignupStep(1);
          setSignupEmail("");
          setOtp("");
          setSignupFormData({ fname: "", lname: "", phone: "", password: "", confirmPassword: "" });
        }
      })
      .catch(err => alert(err.response?.data?.error || "Signup failed"));
  };

  const handleLogout = () => {
    setsellerToken("");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  // Navbar links and user menu
  const sellerNavLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Customers', href: '/customers', icon: Users }
  ];

  const sellerUserMenuItems = [
    { icon: Plus, label: 'Add Product', action: () => navigate("/add-product") },
    { icon: FileText, label: 'Reports', action: () => navigate("/reports") },
    { icon: DollarSign, label: 'Payouts', action: () => navigate("/payouts") },
    { icon: Settings, label: 'Store Settings', action: () => navigate("/store-settings") },
    { icon: User, label: 'Profile', action: () => navigate("/profile") },
    { icon: LogOut, label: 'Logout', action: handleLogout }
  ];


  return (
    <>
      {/* --- Navbar --- */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 py-2 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">SellerHub</span>
          </motion.div>

          {/* Desktop Links */}
          {sellerToken && (
            <div className="hidden md:flex items-center space-x-6">
              {sellerNavLinks.map((link, i) => (
                <MotionLink
                  key={link.name}
                  to={link.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 font-medium px-3 py-2 rounded-lg hover:bg-orange-50 relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  <motion.div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-200" />
                </MotionLink>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {!sellerToken ? (
              <div className="hidden md:flex items-center space-x-3">
                <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="px-4 py-2 text-gray-700 rounded-full hover:text-orange-500 transition">Login</button>
                <button onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }} className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium">Start Selling</button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <button onClick={() => navigate("/add-product")} className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-full text-white font-medium">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                    <User className="w-4 h-4 text-black" />
                    <ChevronDown className={`w-4 h-4 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                        {sellerUserMenuItems.map((item, i) => (
                          <button key={item.label} onClick={() => { item.action(); setShowUserMenu(false); }} className="w-full flex items-center cursor-pointer space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition">
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* --- Auth Modal --- */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}>
            <motion.div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {authMode === 'login' ? 'Welcome Back!' :
                    signupStep === 1 ? 'Start Your Selling Journey' :
                      signupStep === 2 ? 'Verify Your Email' :
                        'Complete Your Store Profile'}
                </h2>
              </div>

              {/* Login Form */}
              {authMode === 'login' && (
                <div className="space-y-4">
                  <input type="email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} placeholder="Email" className="w-full px-4 py-3 border rounded-xl" />
                  <input type="password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} placeholder="Password" className="w-full px-4 py-3 border rounded-xl" />
                  <button onClick={handleAuth} disabled={!loginData.email || !loginData.password} className="w-full bg-orange-500 text-white py-3 rounded-xl">Sign In</button>
                </div>
              )}

              {/* Signup Step 1: Email */}
              {authMode === 'signup' && signupStep === 1 && (
                <div className="space-y-4">
                  <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border rounded-xl" />
                  <button onClick={handleSendOtp} disabled={!signupEmail} className="w-full bg-orange-500 text-white py-3 rounded-xl">Get Verification Code</button>
                </div>
              )}

              {/* Signup Step 2: OTP */}
              {authMode === 'signup' && signupStep === 2 && (
                <div className="space-y-4">
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} className="w-full px-4 py-3 border rounded-xl text-center text-lg tracking-widest" />
                  <div className="flex space-x-3">
                    <button onClick={() => setSignupStep(1)} className="flex-1 py-3 border rounded-xl">Back</button>
                    <button onClick={handleVerifyOtp} className="flex-1 py-3 bg-orange-500 text-white rounded-xl">Verify OTP</button>
                  </div>
                  <button onClick={handleSendOtp} className="w-full py-2 text-sm text-orange-500 hover:underline mt-2">Resend Code</button>
                </div>
              )}

              {/* Signup Step 3: Complete Details */}
              {authMode === 'signup' && signupStep === 3 && (
                <div className="space-y-4">
                  <input type="text" value={signupFormData.fname} onChange={e => setSignupFormData({ ...signupFormData, fname: e.target.value })} placeholder="First Name" className="w-full px-4 py-3 border rounded-xl" />
                  <input type="text" value={signupFormData.lname} onChange={e => setSignupFormData({ ...signupFormData, lname: e.target.value })} placeholder="Last Name" className="w-full px-4 py-3 border rounded-xl" />
                  <input type="text" value={signupFormData.phone} onChange={e => setSignupFormData({ ...signupFormData, phone: e.target.value })} placeholder="Phone" className="w-full px-4 py-3 border rounded-xl" />
                  <input type="password" value={signupFormData.password} onChange={e => setSignupFormData({ ...signupFormData, password: e.target.value })} placeholder="Password" className="w-full px-4 py-3 border rounded-xl" />
                  <input type="password" value={signupFormData.confirmPassword} onChange={e => setSignupFormData({ ...signupFormData, confirmPassword: e.target.value })} placeholder="Confirm Password" className="w-full px-4 py-3 border rounded-xl" />
                  <button onClick={handleSignup} className="w-full bg-orange-500 text-white py-3 rounded-xl">Complete Signup</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
