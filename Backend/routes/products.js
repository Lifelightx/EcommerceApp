const express = require("express")
const { authenticateToken, authorize } = require("../middleware/auth")
const upload = require("../middleware/uplaod")
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require("../controllers/productController")

const router = express.Router()

router.get("/",authenticateToken, getProducts)
router.get("/categories", getCategories);
router.get("/:id", getProduct)
router.post("/", authenticateToken, authorize(["seller"]), upload.array("images", 5), createProduct)
router.put("/:id", authenticateToken, authorize(["seller"]), upload.array("images", 5), updateProduct)
router.delete("/:id", authenticateToken, authorize(["seller"]), deleteProduct)

module.exports = router
