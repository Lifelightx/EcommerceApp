const express = require("express");
const router = express.Router();
const { addReview } = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth"); // your auth middleware

// Add review after delivery
router.post("/:productId", authenticateToken, addReview);

module.exports = router;
