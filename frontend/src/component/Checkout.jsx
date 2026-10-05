import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import 'remixicon/fonts/remixicon.css'

// Put your own UPI QR image at public/upi-qr.png (or change this path)
const UPI_QR_IMAGE = '/qr.jpeg'

const Checkout = () => {
  const { cart: liveCart, clearCart } = useCart()

  const [placedCart, setPlacedCart] = useState(null)
  const cart = placedCart ?? liveCart

  const [orderType, setOrderType] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('')
  const [tableNumber, setTableNumber] = useState('')

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pinCode: '',
  })

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  
  const [upiPaid, setUpiPaid] = useState(false)
  const [qrFailed, setQrFailed] = useState(false)

  const [error, setError] = useState('')
  const DELIVERY_CHARGE = 30
  const handlePlaceOrder = () => {
    if (!validateCustomerDetails()) {
      return
    }

    setShowPayment(true)
    setError('')
  }
  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  )
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
      Number(item.quantity || 0),
    0
  )
  const tax = subtotal * 0.05
  const delivery =
    orderType === 'home' && subtotal > 0
      ? DELIVERY_CHARGE
      : 0
  const total =
    subtotal +
    tax +
    delivery
  const handleCustomerChange = (e) => {
    const { name, value } = e.target

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  const handlePaymentChange = (e) => {
    const { name, value } = e.target

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }
  const handleOrderType = (type) => {
    setOrderType(type)
    setShowPayment(false)
    setOrderPlaced(false)
    setTableNumber('')
    setPlacedCart(null)
    setError('')
  }
  const validateCustomerDetails = () => {

    if (!orderType) {
      setError(
        'Please select At Store or At Home.'
      )
      return false
    }

    if (!customer.firstName.trim()) {
      setError(
        'Please enter your first name.'
      )
      return false
    }

    if (!customer.lastName.trim()) {
      setError(
        'Please enter your last name.'
      )
      return false
    }

    if (!customer.email.trim()) {
      setError(
        'Please enter your email.'
      )
      return false
    }

    if (!customer.phone.trim()) {
      setError(
        'Please enter your phone number.'
      )
      return false
    }

    if (orderType === 'home') {

      if (!customer.address.trim()) {
        setError(
          'Please enter your delivery address.'
        )
        return false
      }

      if (!customer.city.trim()) {
        setError(
          'Please enter your city.'
        )
        return false
      }

      if (!customer.pinCode.trim()) {
        setError(
          'Please enter your PIN code.'
        )
        return false
      }
    }

    return true
  }

  const handlePaymentSubmit = async () => {

    if (
      orderType === 'store' &&
      !tableNumber.trim()
    ) {
      setError(
        'Please enter your table number.'
      )
      return
    }
    if (!paymentMethod) {
      setError(
        'Please select a payment method.'
      )
      return
    }
    if (paymentMethod === 'card') {

      if (
        !paymentDetails.cardNumber.trim() ||
        !paymentDetails.expiry.trim() ||
        !paymentDetails.cvv.trim()
      ) {
        setError(
          'Please enter all card details.'
        )
        return
      }
    }
    if (paymentMethod === 'upi' && !upiPaid) {
      setError(
        'Please scan the QR code, complete the payment, and tick the confirmation box.'
      )
      return
    }

    try {

      setError('')

      const orderData = {

        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
        },

        orderType,

        address:
          orderType === 'home'
            ? {
              address: customer.address,
              city: customer.city,
              pinCode: customer.pinCode,
            }
            : null,

        tableNumber:
          orderType === 'store'
            ? tableNumber
            : null,

        items: cart.map((item) => ({
          title: item.title,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image,
        })),
        subtotal: Number(subtotal),
        tax: Number(tax),
        delivery: Number(delivery),
        total: Number(total),
        paymentMethod,
        paymentStatus:
          paymentMethod === 'cash'
            ? 'pending'
            : 'paid',


        orderStatus: 'placed',
      }


      console.log(
        'ORDER DATA BEING SENT:',
        orderData
      )

      const response = await fetch(
        'https://brew-umber.onrender.com/',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(orderData),
        }
      )


      const data = await response.json()


      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to place order'
        )
      }


      console.log(
        'Order saved:',
        data.order
      )


      setPlacedCart(cart)
      clearCart()
      setOrderPlaced(true)

    } catch (error) {

      console.error(
        'ORDER ERROR:',
        error
      )

      setError(
        error.message ||
        'Something went wrong while placing your order.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">

      <div className="w-11/12 max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-10">

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-amber-950 font-semibold hover:text-orange-500 transition"
          >

            <i className="ri-arrow-left-line"></i>
            Back to Menu
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-950 mt-6">
            CHECKOUT
          </h1>
          <p className="text-gray-500 mt-2">
            Complete your order and enjoy your perfect cup.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#2c2d31] rounded-2xl p-4 sm:p-8 text-white shadow-xl mb-6 sm:mb-8">

              <h2 className="text-2xl font-serif font-bold mb-2">
                Where would you like your order?
              </h2>
              <p className="text-gray-400 mb-6">
                Choose how you want to receive your order.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                  type="button"
                  onClick={() =>
                    handleOrderType('store')
                  }
                  className={`text-left p-4 sm:p-6 rounded-xl border-2 transition ${orderType === 'store'
                    ? 'border-orange-400 bg-orange-400 text-black'
                    : 'border-gray-600 bg-[#38393e] hover:border-orange-400'
                    }`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${orderType === 'store'
                        ? 'bg-black text-orange-400'
                        : 'bg-orange-400 text-black'
                        }`}
                    >

                      <i className="ri-store-2-line text-2xl"></i>

                    </div>


                    <div>

                      <h3 className="text-xl font-bold">
                        At Store
                      </h3>

                      <p
                        className={`text-sm mt-1 ${orderType === 'store'
                          ? 'text-black/70'
                          : 'text-gray-400'
                          }`}
                      >
                        Pick up your order at the store
                      </p>

                    </div>

                  </div>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleOrderType('home')
                  }
                  className={`text-left p-4 sm:p-6 rounded-xl border-2 transition ${orderType === 'home'
                    ? 'border-orange-400 bg-orange-400 text-black'
                    : 'border-gray-600 bg-[#38393e] hover:border-orange-400'
                    }`}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${orderType === 'home'
                        ? 'bg-black text-orange-400'
                        : 'bg-orange-400 text-black'
                        }`}
                    >

                      <i className="ri-home-4-line text-2xl"></i>
                    </div>
                    <div>

                      <h3 className="text-xl font-bold">
                        At Home
                      </h3>

                      <p
                        className={`text-sm mt-1 ${orderType === 'home'
                          ? 'text-black/70'
                          : 'text-gray-400'
                          }`}
                      >
                        Get your order delivered to your home
                      </p>

                    </div>

                  </div>

                </button>

              </div>

            </div>

            <div className="bg-[#2c2d31] rounded-2xl p-4 sm:p-8 text-white shadow-xl">

              <h2 className="text-2xl font-serif font-bold mb-6">
                Customer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    First Name *
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={customer.firstName}
                    onChange={handleCustomerChange}
                    placeholder="Your first name"
                    className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>

                  <label className="block text-sm text-gray-300 mb-2">
                    Last Name *
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={customer.lastName}
                    onChange={handleCustomerChange}
                    placeholder="Your last name"
                    className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>
              <div className="mt-5">

                <label className="block text-sm text-gray-300 mb-2">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  placeholder="you@example.com"
                  className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="mt-5">

                <label className="block text-sm text-gray-300 mb-2">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                />

              </div>
              {orderType === 'home' && (
                <>

                  <h2 className="text-2xl font-serif font-bold mt-10 mb-6">
                    Delivery Address
                  </h2>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Address *
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={customer.address}
                      onChange={handleCustomerChange}
                      placeholder="House no., street, area"
                      className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        City *
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={customer.city}
                        onChange={handleCustomerChange}
                        placeholder="City"
                        className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        PIN Code *
                      </label>

                      <input
                        type="text"
                        name="pinCode"
                        value={customer.pinCode}
                        onChange={handleCustomerChange}
                        placeholder="PIN Code"
                        className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                      />

                    </div>

                  </div>

                </>
              )}
              {orderType === 'store' && (

                <div className="mt-10 bg-orange-400/10 border border-orange-400/40 rounded-xl p-5">

                  <div className="flex items-start gap-3">

                    <i className="ri-store-2-line text-orange-400 text-2xl"></i>

                    <div>

                      <h3 className="font-bold text-orange-400">
                        Store Pickup
                      </h3>

                      <p className="text-gray-300 text-sm mt-1">
                        Your order will be prepared and ready
                        for pickup at the store.
                      </p>

                    </div>

                  </div>

                </div>
              )}
              {!showPayment && !orderPlaced && (

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full mt-10 bg-orange-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition"
                >

                  <i className="ri-lock-line mr-2"></i>
                  Place Order
                </button>
              )}
              {error && !showPayment && (

                <div className="mt-4 bg-red-500/20 border border-red-400 text-red-300 rounded-lg p-4 text-sm">

                  <i className="ri-error-warning-line mr-2"></i>
                  {error}
                </div>
              )}
              {showPayment && !orderPlaced && (

                <div
                  id="payment-section"
                  className="mt-10 pt-8 border-t border-gray-600"
                >

                  <h2 className="text-2xl font-serif font-bold mb-2">
                    Payment Details
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Select your payment method to complete your order.
                  </p>
                  {orderType === 'store' && (

                    <div className="mb-6 bg-[#38393e] rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <i className="ri-table-line text-orange-400 text-2xl"></i>
                        <div className="flex-1">

                          <h3 className="font-bold text-lg">
                            Table Number
                          </h3>

                          <p className="text-gray-400 text-sm mt-1 mb-3">
                            Enter your table number so we can bring your order to you.
                          </p>


                          <label className="block text-sm text-gray-300 mb-2">
                            Table No. *
                          </label>


                          <input
                            type="text"
                            inputMode="numeric"
                            value={tableNumber}
                            onChange={(e) => {
                              setTableNumber(
                                e.target.value
                              )
                              setError('')
                            }}
                            placeholder="e.g. 5"
                            maxLength="3"
                            className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                          />

                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('card')
                        setError('')
                      }}
                      className={`w-full flex items-center gap-3 text-left rounded-lg p-4 transition ${paymentMethod === 'card'
                        ? 'bg-orange-400 text-black'
                        : 'bg-white text-black hover:bg-orange-50'
                        }`}
                    >

                      <i className="ri-bank-card-line text-xl"></i>

                      <span className="font-semibold">
                        Credit / Debit Card
                      </span>


                      {paymentMethod === 'card' && (
                        <i className="ri-checkbox-circle-fill ml-auto text-xl"></i>
                      )}

                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('upi')
                        setError('')
                      }}
                      className={`w-full flex items-center gap-3 text-left rounded-lg p-4 transition ${paymentMethod === 'upi'
                        ? 'bg-orange-400 text-black'
                        : 'bg-white text-black hover:bg-orange-50'
                        }`}
                    >

                      <i className="ri-smartphone-line text-xl"></i>

                      <span className="font-semibold">
                        UPI
                      </span>


                      {paymentMethod === 'upi' && (
                        <i className="ri-checkbox-circle-fill ml-auto text-xl"></i>
                      )}

                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('cash')
                        setError('')
                      }}
                      className={`w-full flex items-center gap-3 text-left rounded-lg p-4 transition ${paymentMethod === 'cash'
                        ? 'bg-orange-400 text-black'
                        : 'bg-white text-black hover:bg-orange-50'
                        }`}
                    >
                      <i className="ri-money-rupee-circle-line text-xl"></i>
                      <span className="font-semibold">
                        Cash on Delivery
                      </span>
                      {paymentMethod === 'cash' && (
                        <i className="ri-checkbox-circle-fill ml-auto text-xl"></i>
                      )}
                    </button>
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-6 bg-[#38393e] rounded-xl p-5">
                      <h3 className="font-bold text-lg mb-4">
                        Card Details
                      </h3>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Card Number *
                        </label>

                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>

                          <label className="block text-sm text-gray-300 mb-2">
                            Expiry *
                          </label>

                          <input
                            type="text"
                            name="expiry"
                            value={paymentDetails.expiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            CVV *
                          </label>
                          <input
                            type="password"
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handlePaymentChange}
                            placeholder="123"
                            maxLength="4"
                            className="w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'upi' && (
                    <div className="mt-6 bg-[#38393e] rounded-xl p-4 sm:p-5">
                      <h3 className="font-bold text-lg mb-4">
                        Pay with UPI
                      </h3>

                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white p-3 rounded-xl w-full max-w-64 aspect-square flex items-center justify-center">
                          {qrFailed ? (
                            <div className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm p-3">
                              <i className="ri-qr-code-line text-5xl"></i>
                              <p className="mt-2">
                                Add your QR image at <code>public/upi-qr.png</code>
                              </p>
                            </div>
                          ) : (
                            <img
                              src={UPI_QR_IMAGE}
                              alt="UPI payment QR code"
                              onError={() => setQrFailed(true)}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>

                        <p className="mt-4 text-sm text-gray-400">Amount to pay</p>
                        <p className="text-orange-400 font-bold text-2xl">
                          ₹{total.toFixed(2)}
                        </p>

                        <ol className="mt-4 w-full text-left text-sm text-gray-300 list-decimal list-inside space-y-1">
                          <li>Open any UPI app (Google Pay, PhonePe, Paytm, BHIM).</li>
                          <li>Scan the QR code above.</li>
                          <li>Enter ₹{total.toFixed(2)} and complete the payment.</li>
                          <li>Come back here and confirm below.</li>
                        </ol>

                        <label className="mt-5 w-full flex items-start gap-3 text-left text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={upiPaid}
                            onChange={(e) => {
                              setUpiPaid(e.target.checked)
                              setError('')
                            }}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-orange-400"
                          />
                          <span>
                            I have scanned the QR code and completed the payment of ₹{total.toFixed(2)}.
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'cash' && (
                    <div className="mt-6 bg-[#38393e] rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <i className="ri-money-rupee-circle-line text-orange-400 text-2xl"></i>
                        <div>
                          <h3 className="font-bold text-lg">
                            Cash on Delivery
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Pay ₹{total.toFixed(2)} in cash when
                            your order is delivered.
                          </p>

                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 bg-red-500/20 border border-red-400 text-red-300 rounded-lg p-4 text-sm">
                      <i className="ri-error-warning-line mr-2"></i>
                      {error}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={!paymentMethod}
                    className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition ${paymentMethod
                      ? 'bg-orange-400 text-black hover:bg-orange-500 cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                  >

                    <i className="ri-check-line mr-2"></i>
                    Confirm Payment
                  </button>
                </div>
              )}
              {orderPlaced && (
                <div className="mt-10 bg-green-500/20 border border-green-400 rounded-xl p-6 text-center">
                  <i className="ri-checkbox-circle-fill text-green-400 text-5xl"></i>
                  <h3 className="text-xl font-bold text-green-300 mt-3">
                    Your order will be placed
                  </h3>

                  <p className="text-gray-300 text-sm mt-2">
                    Thank you for your order.
                  </p>

                  {orderType === 'store' && (

                    <p className="text-gray-300 text-sm mt-1">
                      Table No. {tableNumber}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="bg-[#2c2d31] rounded-2xl p-4 sm:p-6 text-white shadow-xl lg:sticky lg:top-24">

              <h2 className="text-2xl font-serif font-bold border-b border-gray-600 pb-4">
                Your Order
              </h2>

              {cart.length === 0 ? (

                <div className="text-center py-12">

                  <i className="ri-shopping-bag-3-line text-6xl text-gray-500"></i>

                  <p className="text-gray-400 mt-4">
                    Your cart is empty.
                  </p>
                  <Link
                    to="/menu"
                    className="inline-block mt-5 bg-orange-400 text-black font-bold px-5 py-3 rounded-lg hover:bg-orange-500 transition"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (

                <>

                  {orderType && (

                    <div className="mt-5 bg-[#38393e] rounded-xl p-4">

                      <div className="flex items-center gap-3">

                        <i
                          className={`${orderType === 'store'
                            ? 'ri-store-2-line'
                            : 'ri-home-4-line'
                            } text-orange-400 text-xl`}
                        ></i>
                        <div>
                          <p className="text-xs text-gray-400">
                            Order Type
                          </p>
                          <p className="font-bold">
                            {orderType === 'store'
                              ? 'At Store'
                              : 'At Home'}
                          </p>
                        </div>
                      </div>
                      {orderType === 'store' &&
                        tableNumber && (

                          <p className="text-sm text-orange-400 font-semibold mt-3">
                            Table No. {tableNumber}
                          </p>
                        )}
                    </div>
                  )}
                  <div className="mt-5 space-y-4 max-h-80 overflow-y-auto">

                    {cart.map((item) => (
                      <div
                        key={item.title}
                        className="flex gap-3 border-b border-gray-700 pb-4"
                      >
                        <img
                          src={
                            item.image ||
                            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={item.title}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=200'
                          }}
                        />
                        <div className="flex-1 min-w-0">

                          <h3 className="font-bold break-words">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-orange-400 font-bold shrink-0">
                          ₹
                          {(
                            Number(item.price) *
                            Number(item.quantity)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-600 mt-5 pt-5 space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>
                        Items
                      </span>
                      <span>
                        {totalItems}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>
                        Subtotal
                      </span>

                      <span>
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>
                        {orderType === 'store'
                          ? 'Store Pickup'
                          : 'Delivery'}
                      </span>
                      <span>

                        {orderType === 'store'
                          ? '₹0.00'
                          : `₹${delivery.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">

                      <span>
                        Tax
                      </span>

                      <span>
                        ₹{tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-gray-600 pt-4 flex justify-between text-xl font-bold">

                      <span>
                        Total
                      </span>
                      <span className="text-orange-400">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {!showPayment && !orderPlaced && (

                    <p className="text-center text-xs text-gray-500 mt-5">
                      Fill in your details to continue.
                    </p>
                  )}
                  {showPayment && !orderPlaced && (
                    <div className="mt-5 text-center">
                      <p className="text-orange-400 text-sm font-semibold">
                        Payment details required
                      </p>
                    </div>
                  )}
                  {orderPlaced && (
                    <div className="mt-5 text-center text-green-400">
                      <i className="ri-checkbox-circle-fill text-2xl"></i>
                      <p className="font-semibold mt-1">
                        Order ready
                      </p>
                    </div>
                  )}
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Your payment information is secure.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
