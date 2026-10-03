const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const Order = require('./models/order')
const sendOrderEmail = require('./utils/sendemail')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body)

    const savedOrder = await order.save()

    sendOrderEmail(savedOrder)
  .then(() => console.log('Confirmation email sent to', savedOrder.customer.email))
  .catch((err) => console.error('Email error:', err.message))

    res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      order: savedOrder,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to save order',
    })
  }
})

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch orders',
    })
  }
})

