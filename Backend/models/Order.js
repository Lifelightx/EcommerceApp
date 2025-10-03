const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    sellerId:{
        type:String,
        require:true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['online', 'cash_on_delivery'],
        default: 'online'
    },
    payment: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        // enum:["Order Placed","Shipped","Delivered","Cancelled"],
        default: "Order Placed"
    },
    date: {
        type: Date,
        default: Date.now
    },
    cancelledAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    }
})

// Update deliveredAt when status changes to "Delivered"
orderSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'Delivered' && !this.deliveredAt) {
        this.deliveredAt = new Date()
    }
    next()
})

// Update deliveredAt when status is updated via findByIdAndUpdate
orderSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate()
    if (update.status === 'Delivered') {
        update.deliveredAt = new Date()
    }
    next()
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
module.exports = orderModel