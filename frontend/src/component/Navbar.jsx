import { Link } from 'react-router-dom'
import Left from './Left'
import 'remixicon/fonts/remixicon.css'

const Navbar = () => {
  return (
    // 'items-center' vertically centers the logo, nav, and cart on the same line
    <div className='flex items-center justify-between p-2 rounded-b-4xl w-full bg-white mb-2'>
      
      {/* 1. LEFT: Logo Section */}
      <div className='w-1/3 flex justify-start pl-4'>
        <Left/>
      </div>
      
      <nav className='w-1/3 flex justify-center'>
        <ul className='flex flex-row gap-8 font-bold text-xl text-amber-950'>
          <li className='hover:text-amber-900 transition-colors'><Link to="/">Home</Link></li>
          <li className='hover:text-amber-900 transition-colors'><Link to="/about">About</Link></li>
          <li className='hover:text-amber-900 transition-colors'><Link to="/menu">Menu</Link></li>
          <li className='hover:text-amber-900 transition-colors'><Link to="/con">Contact</Link></li>   
        </ul>
      </nav>
      
    </div>
  )
}

export default Navbar