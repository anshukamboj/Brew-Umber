import { useState } from 'react'
import { Link } from 'react-router-dom'
import Left from './Left'
import 'remixicon/fonts/remixicon.css'

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className='w-full bg-white rounded-b-4xl mb-2'>
      {/* Desktop (lg+): identical to the original navbar */}
      <div className='flex items-center justify-between p-2 w-full'>

        {/* 1. LEFT: Logo Section */}
        <div className='lg:w-1/3 flex justify-start pl-2 sm:pl-4'>
          <Left/>
        </div>

        <nav className='hidden lg:flex lg:w-1/3 justify-center'>
          <ul className='flex flex-row gap-8 font-bold text-xl text-amber-950'>
            <li className='hover:text-amber-900 transition-colors'><Link to="/">Home</Link></li>
            <li className='hover:text-amber-900 transition-colors'><Link to="/about">About</Link></li>
            <li className='hover:text-amber-900 transition-colors'><Link to="/menu">Menu</Link></li>
            <li className='hover:text-amber-900 transition-colors'><Link to="/con">Contact</Link></li>
          </ul>
        </nav>

        {/* Mobile / tablet only: hamburger button */}
        <button
          type='button'
          onClick={() => setOpen((o) => !o)}
          aria-label='Toggle menu'
          aria-expanded={open}
          className='lg:hidden p-2 mr-1 text-3xl text-amber-950'
        >
          <i className={open ? 'ri-close-line' : 'ri-menu-line'}></i>
        </button>
      </div>

      {/* Mobile / tablet dropdown */}
      {open && (
        <nav className='lg:hidden border-t border-amber-950/10 px-4 pb-4'>
          <ul className='flex flex-col font-bold text-lg text-amber-950'>
            {[['/', 'Home'], ['/about', 'About'], ['/menu', 'Menu'], ['/con', 'Contact']].map(([to, label]) => (
              <li key={to} className='border-b border-amber-950/10 last:border-b-0'>
                <Link to={to} onClick={() => setOpen(false)} className='block py-3'>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Navbar
