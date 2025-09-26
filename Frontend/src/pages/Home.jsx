"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ChevronRight, Star, ShoppingBag, Users, Zap, Shield, Truck, ArrowRight, Heart, Eye } from "lucide-react"

// Memoized ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(({ product, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden"
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ₹{
            product.badge === "Bestseller"
              ? "bg-amber-500"
              : product.badge === "New"
                ? "bg-green-500"
                : product.badge === "Popular"
                  ? "bg-purple-500"
                  : "bg-red-500"
          }`}
        >
          {product.badge}
        </span>
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100">
        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors duration-200">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center text-8xl">
        {product.image}
        <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <button className="bg-white text-gray-800 px-6 py-3 rounded-full font-semibold flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Ratings */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ₹{
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price & Cart Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{product.price}</span>
            <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-colors duration-200">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
})

ProductCard.displayName = 'ProductCard'

// Memoized CountUpAnimation component
const CountUpAnimation = memo(({ end, duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        const currentCount = Math.floor(progress * end)
        setCount(currentCount)
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count}</span>
})

CountUpAnimation.displayName = 'CountUpAnimation'

const EcommerceHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -100])
  const y2 = useTransform(scrollY, [0, 300], [0, 50])

  // Static data - moved outside component to prevent re-creation
  const heroSlides = [
    {
      title: "Premium Collection 2024",
      subtitle: "Discover the Latest Trends",
      description: "Elevate your style with our curated selection of premium products",
      cta: "Shop Now",
      bg: "from-purple-600 via-purple-600 to-cyan-500",
    },
    {
      title: "Exclusive Summer Sale",
      subtitle: "Up to 70% Off",
      description: "Don't miss out on our biggest sale of the year",
      cta: "Explore Deals",
      bg: "from-purple-500 via-pink-500 to-red-500",
    },
    {
      title: "New Arrivals",
      subtitle: "Fresh Styles Weekly",
      description: "Stay ahead with the latest fashion and lifestyle products",
      cta: "See What's New",
      bg: "from-green-500 via-teal-500 to-purple-500",
    },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: "₹299",
      originalPrice: "₹399",
      rating: 4.8,
      reviews: 324,
      image: "🎧",
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: "₹199",
      originalPrice: "₹249",
      rating: 4.6,
      reviews: 189,
      image: "⌚",
      badge: "New",
    },
    {
      id: 3,
      name: "Designer Backpack",
      price: "₹89",
      originalPrice: "₹129",
      rating: 4.9,
      reviews: 567,
      image: "🎒",
      badge: "Popular",
    },
    {
      id: 4,
      name: "purpletooth Speaker",
      price: "₹79",
      originalPrice: "₹99",
      rating: 4.7,
      reviews: 234,
      image: "🔊",
      badge: "Sale",
    },
  ]

  const categories = [
    { name: "Electronics", icon: "⚡", count: "2.5k+", color: "from-purple-500 to-purple-600" },
    { name: "Fashion", icon: "👕", count: "1.8k+", color: "from-pink-500 to-rose-600" },
    { name: "Home & Garden", icon: "🏡", count: "950+", color: "from-green-500 to-teal-600" },
    { name: "Sports", icon: "⚽", count: "1.2k+", color: "from-purple-500 to-red-600" },
    { name: "Beauty", icon: "💄", count: "680+", color: "from-purple-500 to-pink-600" },
    { name: "Books", icon: "📚", count: "420+", color: "from-indigo-500 to-purple-600" },
  ]

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "15K+", label: "Products", icon: ShoppingBag },
    { number: "99.9%", label: "Uptime", icon: Zap },
    { number: "24/7", label: "Support", icon: Shield },
  ]

  // Memoized slide change handler
  const handleSlideChange = useCallback((index) => {
    setCurrentSlide(index)
  }, [])

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  // Static animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 20, stiffness: 100 },
    },
  }

  const slideVariants = {
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.8, ease: "easeIn" },
    },
  }

  return (
    <div className="min-h-screen bg-gray-300 ">
      {/* Hero Section */}
      <section className="relative h-screen  overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="exit"
            animate="enter"
            exit="exit"
            className="absolute inset-0 bg-gradient-to-br opacity-90"
            style={{
              background: `linear-gradient(to bottom right, ₹{heroSlides[currentSlide].bg.split(" ").join(", ")})`,
            }}
          />
        </AnimatePresence>

        {/* Animated background elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"
        />
        <motion.div style={{ y: y2 }} className="absolute top-60 -right-32 w-64 h-64 bg-white opacity-5 rounded-full" />

        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", damping: 20 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8, type: "spring", damping: 20 }}
                className="text-6xl md:text-8xl font-black mb-6 leading-tight text-gray-600"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-₹{currentSlide}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl font-light mb-4 opacity-90 text-amber-600"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg mb-8 opacity-80 max-w-2xl mx-auto"
            >
              {heroSlides[currentSlide].description}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", damping: 15 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-3"
            >
              {heroSlides[currentSlide].cta}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </motion.div>
        </div>

        {/* Animated slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleSlideChange(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ₹{
                currentSlide === index ? "bg-white scale-125" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-purple-50 opacity-50" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", damping: 15 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mb-4 text-white"
                >
                  <stat.icon className="w-8 h-8" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                  className="text-4xl font-black text-gray-900 mb-2"
                >
                  {stat.number.includes("+") ? (
                    <>
                      <CountUpAnimation end={Number.parseInt(stat.number.replace(/[^\d]/g, ""))} />
                      {stat.number.replace(/[\d]/g, "")}
                    </>
                  ) : (
                    stat.number
                  )}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our vast collection across multiple categories
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", damping: 15 }}
                  viewport={{ once: true }}
                  className={`absolute inset-0 bg-gradient-to-br ₹{category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{category.count} items</p>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 origin-left"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-6">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Handpicked selections from our premium collection</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-purple-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center gap-3"
            >
              View All Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,₹{encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fill="#9C92AC" fillOpacity="0.05"><circle cx="30" cy="30" r="1"/></g></g></svg>')}")`,
              backgroundRepeat: "repeat",
            }}
          />
        </div>

        <div className="container mx-auto px-4 text-black relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-6">Why Choose Us?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Experience the difference with our premium service and quality guarantee
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "Enjoy free shipping on all orders over ₹50. Fast, reliable delivery to your doorstep.",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "Your transactions are protected with bank-level security and SSL encryption.",
              },
              {
                icon: Users,
                title: "24/7 Support",
                description: "Our dedicated support team is here to help you anytime, anywhere.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.2, type: "spring", damping: 15 }}
                  viewport={{ once: true }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                    index === 0
                      ? "bg-gradient-to-r from-purple-500 to-purple-600"
                      : index === 1
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-purple-500 to-red-500"
                  }`}
                >
                  <feature.icon className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-800 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20  relative overflow-hidden">
        <div />
        <div className="container  mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl font-black  text-gray-800 mb-6"
            >
              Stay Updated
            </motion.h2>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
              offers.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto flex"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-l-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EcommerceHomepage