const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendOrderEmail = async (order) => {
  const mail = {
    from: process.env.EMAIL_USER,
    to: order.customer.email,
    subject: 'Order Confirmed - Brew Umber',
    text: `
Hi ${order.customer.firstName},

Your order has been confirmed.

Order ID: ${order._id}

Total: ₹${order.total}

Thank you for ordering from Brew Umber.
    `,
  }

  const result = await transporter.sendMail(mail)

  console.log('Email sent successfully:', result.messageId)

  return result
}

module.exports = sendOrderEmail