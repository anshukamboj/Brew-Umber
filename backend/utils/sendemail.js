const nodemailer = require('nodemailer')

/**
 * Creates and returns a configured Nodemailer transporter.
 * Dynamically evaluates environment variables at call time so any runtime updates
 * or dotenv loads are respected.
 */
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : ''
  // Google App Passwords are 16 characters often generated with spaces (e.g. "abcd efgh ijkl mnop").
  // Removing all whitespace avoids authentication rejections.
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : ''

  if (!emailUser || !emailPass) {
    return null
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Port 465 uses SSL/TLS directly
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // Prevent SMTP connection hangs from blocking order completion
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
}

/**
 * Generates plain-text and HTML representations of the order confirmation email.
 */
const generateEmailTemplates = (order) => {
  const firstName = order?.customer?.firstName || 'Valued Customer'
  const orderId = order?._id ? String(order._id) : 'N/A'
  const total = Number(order?.total || 0).toFixed(2)
  const subtotal = Number(order?.subtotal || 0).toFixed(2)
  const tax = Number(order?.tax || 0).toFixed(2)
  const delivery = Number(order?.delivery || 0).toFixed(2)

  const isStore = order?.orderType === 'store'
  const fulfillmentType = isStore ? 'Store Pickup / Dine-In' : 'Home Delivery'
  const fulfillmentDetail = isStore
    ? `Table Number: ${order?.tableNumber || 'N/A'}`
    : `Delivery Address: ${order?.address?.address || 'N/A'}, ${order?.address?.city || ''} ${order?.address?.pinCode ? '- ' + order.address.pinCode : ''}`.trim()

  const paymentMethod = order?.paymentMethod ? order.paymentMethod.toUpperCase() : 'N/A'
  const paymentStatus = order?.paymentStatus || 'pending'

  const items = Array.isArray(order?.items) ? order.items : []
  const itemsText = items.length > 0
    ? items.map(item => `  • ${item.title || 'Item'} x ${item.quantity || 1} — ₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}`).join('\n')
    : '  • No items listed'

  const itemsHtml = items.length > 0
    ? items.map(item => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #3d3e44; color: #f3f4f6;">
            <strong>${item.title || 'Item'}</strong>
            <div style="font-size: 12px; color: #9ca3af;">Quantity: ${item.quantity || 1}</div>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #3d3e44; text-align: right; color: #fbbf24; font-weight: bold;">
            ₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="2" style="padding: 10px 0; color: #9ca3af;">No items listed</td></tr>'

  // Plain-text format for non-HTML mail clients
  const textContent = `
Hi ${firstName},

Your order with Brew Umber has been confirmed!

========================================
ORDER DETAILS
========================================
Order ID: ${orderId}
Order Type: ${fulfillmentType}
${fulfillmentDetail}
Payment: ${paymentMethod} (${paymentStatus})

ITEMS ORDERED:
${itemsText}

========================================
BILLING BREAKDOWN
========================================
Subtotal:        ₹${subtotal}
Tax (5% GST):    ₹${tax}
Delivery Fee:    ₹${delivery}
----------------------------------------
Total Amount:    ₹${total}
========================================

Thank you for choosing Brew Umber! If you have any questions, feel free to reply to this email.

Warm regards,
The Brew Umber Team
`.trim()

  // Responsive, dark-themed HTML format matching the Brew Umber café aesthetic
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmed - Brew Umber</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e7eb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a1d; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #2c2d31; border-radius: 16px; overflow: hidden; border: 1px solid #3f4047; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3b2219; padding: 28px 24px; text-align: center; border-bottom: 3px solid #fbbf24;">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff; letter-spacing: 1px; font-family: Georgia, serif;">☕ Brew Umber</h1>
              <p style="margin: 6px 0 0; color: #fde68a; font-size: 14px;">Specialty Coffee & Artisanal Roastery</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; color: #ffffff;">Order Confirmed!</h2>
              <p style="margin: 0 0 20px; color: #d1d5db; font-size: 15px; line-height: 1.5;">
                Hi <strong>${firstName}</strong>, thank you for your order! We are preparing your fresh brew with passion and precision.
              </p>

              <!-- Order Info Card -->
              <table role="presentation" width="100%" style="background-color: #232427; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #38393e;">
                <tr>
                  <td style="font-size: 13px; color: #9ca3af; padding: 4px 0;">Order ID:</td>
                  <td style="font-size: 13px; color: #ffffff; font-weight: bold; text-align: right; padding: 4px 0;">#${orderId}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #9ca3af; padding: 4px 0;">Fulfillment:</td>
                  <td style="font-size: 13px; color: #fbbf24; font-weight: bold; text-align: right; padding: 4px 0;">${fulfillmentType}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #9ca3af; padding: 4px 0;">Details:</td>
                  <td style="font-size: 13px; color: #ffffff; text-align: right; padding: 4px 0;">${fulfillmentDetail}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #9ca3af; padding: 4px 0;">Payment:</td>
                  <td style="font-size: 13px; color: #ffffff; text-align: right; padding: 4px 0;">${paymentMethod} <span style="font-size: 11px; color: ${paymentStatus === 'paid' ? '#34d399' : '#fbbf24'};">(${paymentStatus.toUpperCase()})</span></td>
                </tr>
              </table>

              <!-- Items Table -->
              <h3 style="margin: 0 0 12px; font-size: 16px; color: #ffffff; border-bottom: 1px solid #3f4047; padding-bottom: 8px;">Items Ordered</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Financial Breakdown -->
              <table role="presentation" width="100%" style="border-top: 2px dashed #4b4d54; padding-top: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #9ca3af; padding: 3px 0;">Subtotal</td>
                  <td style="font-size: 14px; color: #ffffff; text-align: right; padding: 3px 0;">₹${subtotal}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #9ca3af; padding: 3px 0;">Tax (5% GST)</td>
                  <td style="font-size: 14px; color: #ffffff; text-align: right; padding: 3px 0;">₹${tax}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #9ca3af; padding: 3px 0;">Delivery Fee</td>
                  <td style="font-size: 14px; color: #ffffff; text-align: right; padding: 3px 0;">₹${delivery}</td>
                </tr>
                <tr>
                  <td style="font-size: 18px; color: #ffffff; font-weight: bold; padding: 12px 0 0;">Total Amount</td>
                  <td style="font-size: 18px; color: #fbbf24; font-weight: bold; text-align: right; padding: 12px 0 0;">₹${total}</td>
                </tr>
              </table>

              <div style="background-color: #3b2219; border-radius: 8px; padding: 12px; text-align: center; color: #fde68a; font-size: 13px;">
                ✨ Freshly brewed and crafted with care.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #232427; padding: 20px 24px; text-align: center; border-top: 1px solid #38393e;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">Brew Umber Roastery & Café • Haryana, India</p>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 11px;">This is an automated order confirmation. Please do not hesitate to contact us if you need any assistance.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  return { textContent, htmlContent }
}

/**
 * Sends an order confirmation email to the customer.
 * 
 * @param {Object} order - The saved MongoDB order document
 * @returns {Promise<Object>} Delivery result object
 */
const sendOrderEmail = async (order) => {
  if (!order) {
    throw new Error('Order object is required to send confirmation email.')
  }

  const customerEmail = order.customer && order.customer.email
  if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.trim()) {
    throw new Error(`Customer email is missing or invalid for order ${order._id || 'unknown'}.`)
  }

  const transporter = createTransporter()

  // Gracefully handle unconfigured mail credentials without throwing
  if (!transporter) {
    const warningMsg = '[Brew Umber] Email dispatch skipped: EMAIL_USER or EMAIL_PASS environment variable is not configured.'
    console.warn(warningMsg)
    return {
      success: false,
      skipped: true,
      reason: 'EMAIL_USER or EMAIL_PASS is missing in environment variables',
    }
  }

  const emailUser = process.env.EMAIL_USER.trim()
  const { textContent, htmlContent } = generateEmailTemplates(order)

  const mailOptions = {
    from: `"Brew Umber" <${emailUser}>`,
    to: customerEmail.trim(),
    subject: `Order Confirmed #${order._id ? String(order._id).slice(-6).toUpperCase() : ''} - Brew Umber`,
    text: textContent,
    html: htmlContent,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log(`[Brew Umber] Order confirmation email dispatched to ${customerEmail}. Message ID: ${result.messageId}`)
    return {
      success: true,
      messageId: result.messageId,
      recipient: customerEmail,
    }
  } catch (error) {
    // Provide actionable diagnostic error messages for common SMTP errors
    let enhancedMessage = error.message
    if (error.code === 'EAUTH') {
      enhancedMessage = `Gmail SMTP authentication failed for ${emailUser}. Ensure 2-Step Verification is enabled and a 16-character Google App Password (without spaces) is used in EMAIL_PASS.`
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
      enhancedMessage = `SMTP connection timed out connecting to smtp.gmail.com:465. Network or port may be restricted.`
    }

    const enhancedError = new Error(enhancedMessage)
    enhancedError.originalError = error
    enhancedError.code = error.code
    throw enhancedError
  }
}

/**
 * Verifies the SMTP transporter connection configuration.
 * Useful for health checks and startup diagnostics.
 */
const verifyEmailConfig = async () => {
  const transporter = createTransporter()
  if (!transporter) {
    return {
      configured: false,
      message: 'EMAIL_USER or EMAIL_PASS is not configured.',
    }
  }

  try {
    await transporter.verify()
    return {
      configured: true,
      verified: true,
      message: 'SMTP credentials verified successfully.',
    }
  } catch (error) {
    return {
      configured: true,
      verified: false,
      error: error.message,
    }
  }
}

module.exports = sendOrderEmail
module.exports.sendOrderEmail = sendOrderEmail
module.exports.verifyEmailConfig = verifyEmailConfig
module.exports.createTransporter = createTransporter
