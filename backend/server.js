require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const Order = require('./models/order')
const sendOrderEmail = require('./utils/sendemail')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log('MongoDB error:', error)
  })

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body)

    const savedOrder = await order.save()

console.log('Order saved:', savedOrder._id)

try {
  await sendOrderEmail(savedOrder)
  console.log('Order email sent')
} catch (emailError) {
  console.error('Email failed:', emailError)
}

res.status(201).json({
  success: true,
  message: 'Order confirmed',
  order: savedOrder,
})
  } catch (error) {
    console.error('Order error:', error)

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})



app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get orders',
    })
  }
})
