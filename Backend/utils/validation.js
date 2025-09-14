const Joi = require("joi")

// Common validation schemas
const schemas = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  id: Joi.number().integer().positive().required(),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
}

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((detail) => detail.message),
      })
    }
    req.validatedData = value
    next()
  }
}

module.exports = { schemas, validate }
