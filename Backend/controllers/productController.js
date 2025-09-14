const Product = require("../models/Product")
const Category = require("../models/Category")

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query

    // Build filter object
    const filter = {}

    if (category) {
      filter.category = category
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get products with pagination
    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("seller", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / Number.parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: Number.parseInt(page) > 1,
      },
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name email")
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "name",
        },
      })

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json({ product })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "Name, description, price, and category are required" })
    }

    // Validate category exists
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category" })
    }

    // Handle image upload
    let images = []
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`)
    }

    const product = new Product({
      name,
      description,
      price: Number.parseFloat(price),
      category,
      stock: Number.parseInt(stock) || 0,
      images,
      seller: req.user.id,
    })

    await product.save()

    // Populate the response
    await product.populate("category", "name")
    await product.populate("seller", "name email")

    res.status(201).json({
      message: "Product created successfully",
      product,
    })
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this product" })
    }

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid category" })
      }
    }

    // Handle new image uploads
    let images = product.images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`)
      images = [...images, ...newImages]
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number.parseFloat(price) }),
        ...(category && { category }),
        ...(stock !== undefined && { stock: Number.parseInt(stock) }),
        images,
      },
      { new: true },
    )
      .populate("category", "name")
      .populate("seller", "name email")

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this product" })
    }

    await Product.findByIdAndDelete(req.params.id)

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

// categoryController.js

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
}
