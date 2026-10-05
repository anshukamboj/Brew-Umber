import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Pic from '../assets/Caffe.png'
import 'remixicon/fonts/remixicon.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!formData.email.trim()) {
      setError('Please enter your email.')
      return
    }
    if (!formData.message.trim()) {
      setError('Please enter your message.')
      return
    }

    setError('')
    setSent(true)
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', phone: '', message: '' })
    setSent(false)
  }
  const info = [
    { icon: 'ri-map-pin-2-line', title: 'Visit Us', text: 'Brew Umber, Haryana' },
    { icon: 'ri-phone-line', title: 'Call Us', text: '+91 0000000000' },
    { icon: 'ri-mail-line', title: 'Email Us', text: 'anukamboj2212@gmail.com' },
    { icon: 'ri-time-line', title: 'Open Hours', text: 'Every day, 8:00 AM - 10:00 PM' },
  ]

  const inputClass =
    'w-full bg-white text-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400'

  return (
    <div className="bg-white min-h-screen w-full flex justify-center pt-28 sm:pt-32 pb-12">
      <div className="bg-[#2c2d31] w-11/12 sm:w-10/12 max-w-6xl text-white rounded-2xl flex flex-col items-start px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-8 sm:pb-12 shadow-xl">
        <div className="flex justify-between items-start gap-4 w-full">
          <div className="flex flex-col flex-1 min-w-0">
            <h1 className="text-3xl sm:text-5xl font-serif font-bold">CONTACT US</h1>
            <h4 className="text-gray-300 mt-3 sm:mt-4 text-base sm:text-lg">
              Have a question or a message for us? Write to us and we will get back to you.
            </h4>
          </div>

          <Link to="/">
            <img className="h-14 sm:h-24 w-auto object-contain" src={Pic} alt="logo" />
          </Link>
        </div>

        <hr className="border-t-2 border-white mt-6 sm:mt-8 w-full" />

        {/* MAIN GRID */}
        <div className="w-full mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* LEFT: INFO */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {info.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 items-center bg-black/20 p-4 rounded-xl"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-orange-400 text-black flex items-center justify-center">
                  <i className={`${item.icon} text-2xl`}></i>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 break-words">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: FORM */}
          <div className="lg:col-span-3 bg-black/20 rounded-xl p-4 sm:p-8">
            {sent ? (
              <div className="bg-green-500/20 border border-green-400 rounded-xl p-6 text-center">
                <i className="ri-checkbox-circle-fill text-green-400 text-5xl"></i>
                <h3 className="text-xl font-bold text-green-300 mt-3">
                  Message sent
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  Thank you, {formData.name}. We will reply to {formData.email}.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-5 bg-white text-black font-bold py-2 px-5 rounded-lg hover:bg-orange-500 hover:text-white transition-colors text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Send a Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-sm text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Write your message"
                    className={`${inputClass} resize-none`}
                  ></textarea>
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/20 border border-red-400 text-red-300 rounded-lg p-4 text-sm">
                    <i className="ri-error-warning-line mr-2"></i>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-6 bg-orange-400 text-black py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact