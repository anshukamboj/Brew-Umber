const nodemailer = require('nodemailer')


// ======================================================
// GMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})


// ======================================================
// ESCAPE HTML
// ======================================================

const escapeHtml = (text = '') =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')


// ======================================================
// SEND ORDER EMAIL
// ======================================================

const sendOrderEmail = async (order) => {

  const {
    customer,
    items = [],
    subtotal = 0,
    tax = 0,
    delivery = 0,
    total = 0,
    orderType,
    tableNumber,
  } = order


  // ======================================================
  // CONVERT VALUES TO NUMBERS
  // ======================================================

  const safeSubtotal = Number(subtotal) || 0
  const safeTax = Number(tax) || 0
  const safeDelivery = Number(delivery) || 0
  const safeTotal = Number(total) || 0


  // ======================================================
  // COFFEE ITEMS
  // ======================================================

  const itemRows = items
    .map((item) => {

      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 0
      const itemTotal = price * quantity

      return `
        <tr>

          <td
            style="
              padding:8px 0;
              border-bottom:1px solid #eeeeee;
            "
          >
            ${escapeHtml(item.title)} × ${quantity}
          </td>

          <td
            style="
              padding:8px 0;
              text-align:right;
              border-bottom:1px solid #eeeeee;
            "
          >
            ₹${itemTotal.toFixed(2)}
          </td>

        </tr>
      `
    })
    .join('')


  // ======================================================
  // ORDER TYPE
  // ======================================================

  let where = ''

  if (orderType === 'store') {

    where = `At Store`

    if (tableNumber) {
      where += ` (Table No. ${escapeHtml(tableNumber)})`
    }

  } else {

    where = 'At Home'

  }


  // ======================================================
  // DELIVERY TEXT
  // ======================================================

  // This uses the delivery value received from Checkout.
  // It is NOT fixed here.

  const deliveryText = `₹${safeDelivery.toFixed(2)}`


  // ======================================================
  // HTML EMAIL
  // ======================================================

  const html = `

    <div
      style="
        font-family:Arial,sans-serif;
        max-width:550px;
        margin:0 auto;
        padding:20px;
        color:#2c2d31;
      "
    >

      <!-- HEADER -->

      <h2
        style="
          color:#451a03;
          margin-bottom:5px;
        "
      >
        Brew Umber
      </h2>

      <p
        style="
          color:#777;
          margin-top:0;
        "
      >
        Coffee Shop
      </p>


      <!-- GREETING -->

      <p>
        Hi ${escapeHtml(customer?.firstName || 'Customer')},
      </p>

      <p>
        <strong>
          Your order is confirmed, please wait.
        </strong>
      </p>


      <!-- ORDER ITEMS -->

      <h3
        style="
          margin-top:25px;
          color:#451a03;
        "
      >
        Your Order
      </h3>


      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:10px;
        "
      >

        ${itemRows}


        <!-- SUBTOTAL -->

        <tr>

          <td
            style="
              padding:10px 0;
            "
          >
            Subtotal
          </td>

          <td
            style="
              padding:10px 0;
              text-align:right;
            "
          >
            ₹${safeSubtotal.toFixed(2)}
          </td>

        </tr>


        <!-- DELIVERY -->

        <tr>

          <td
            style="
              padding:8px 0;
            "
          >
            Delivery Charges
          </td>

          <td
            style="
              padding:8px 0;
              text-align:right;
            "
          >
            ${deliveryText}
          </td>

        </tr>


        <!-- TAX -->

        <tr>

          <td
            style="
              padding:8px 0;
            "
          >
            Tax
          </td>

          <td
            style="
              padding:8px 0;
              text-align:right;
            "
          >
            ₹${safeTax.toFixed(2)}
          </td>

        </tr>


        <!-- TOTAL -->

        <tr>

          <td
            style="
              padding-top:15px;
              border-top:2px solid #2c2d31;
              font-size:19px;
            "
          >
            <strong>
              Total
            </strong>
          </td>

          <td
            style="
              padding-top:15px;
              border-top:2px solid #2c2d31;
              text-align:right;
              font-size:19px;
              color:#f97316;
            "
          >
            <strong>
              ₹${safeTotal.toFixed(2)}
            </strong>
          </td>

        </tr>

      </table>


      <!-- ORDER TYPE -->

      <div
        style="
          margin-top:25px;
          padding:15px;
          background:#f8f8f8;
          border-radius:8px;
        "
      >

        <p style="margin:0;">

          <strong>
            Order Type:
          </strong>

          ${where}

        </p>

      </div>


      <!-- ORDER ID -->

      <p
        style="
          color:#888;
          font-size:12px;
          margin-top:20px;
        "
      >
        Order ID: ${order._id || 'N/A'}
      </p>


      <!-- FOOTER -->

      <p
        style="
          margin-top:25px;
          color:#777;
          font-size:13px;
        "
      >
        Thank you for ordering from Brew Umber ☕
      </p>

    </div>

  `


  // ======================================================
  // PLAIN TEXT EMAIL
  // ======================================================

  const text =

    `Hi ${customer?.firstName || 'Customer'},\n\n` +

    `Your order is confirmed, please wait.\n\n` +

    `COFFEE ITEMS:\n` +

    items
      .map((item) => {

        const price = Number(item.price) || 0
        const quantity = Number(item.quantity) || 0
        const itemTotal = price * quantity

        return (
          `${item.title} × ${quantity} - ₹` +
          `${itemTotal.toFixed(2)}`
        )

      })
      .join('\n') +

    `\n\n` +

    `Subtotal: ₹${safeSubtotal.toFixed(2)}\n` +

    `Delivery Charges: ₹${safeDelivery.toFixed(2)}\n` +

    `Tax: ₹${safeTax.toFixed(2)}\n` +

    `--------------------------\n` +

    `Total: ₹${safeTotal.toFixed(2)}\n\n` +

    `Order Type: ${where}\n\n` +

    `Order ID: ${order._id || 'N/A'}\n\n` +

    `Thank you for ordering from Brew Umber.`

  const info = await transporter.sendMail({

    from: `"Brew Umber" <${process.env.EMAIL_USER}>`,

    to: customer.email,

    subject: 'Your order is confirmed - Brew Umber',

    text,

    html,

  })
}


module.exports = sendOrderEmail
