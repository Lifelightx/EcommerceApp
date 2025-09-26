const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order"); // Assuming you have an Order model
const mongoose = require("mongoose");

// Add a review after product delivery
const addReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id; // Assuming you have auth middleware

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    // Check if user has ordered this product and it's delivered
    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      status: "delivered", // adjust according to your order schema
    });

    if (!order) {
      return res.status(403).json({ error: "You can review only delivered products" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    // Update product with new review
    const product = await Product.findById(productId);
    product.reviews.push(review._id);
    product.reviewCount = product.reviews.length;

    // Recalculate average rating
    const allReviews = await Review.find({ product: productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRating / allReviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addReview };
