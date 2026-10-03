const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    customer: {
      firstName: {
        type: String,
        required: true,
      },

      lastName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    orderType: {
      type: String,
      enum: ['store', 'home'],
      required: true,
    },

    address: {
      address: String,
      city: String,
      pinCode: String,
    },

    tableNumber: {
      type: String,
      default: null,
    },

    items: [
      {
        title: String,
        price: Number,
        quantity: Number
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    delivery: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'cash'],
      required: true,
    },

    paymentStatus: {
      type: String,
      default: 'pending',
    },

    orderStatus: {
      type: String,
      default: 'placed',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Order', orderSchema)
