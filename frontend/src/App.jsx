import React from 'react'
import Mpage from './component/Mpage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Menu from './component/Menu'
import About from './component/About'
import Contact from './component/Contact'
import Npage from './component/Npage'
import Checkout from './component/Checkout';

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative w-full">
        <div className="absolute top-0 left-0 z-50 w-full">
          <Npage />
        </div>
        
        <div className="w-full">
          <Routes> 
            <Route path="/" element={<Mpage />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/con" element={<Contact />} />
    <Route path="/checkout" element={<Checkout />} />


          </Routes> 
        </div>
        
      </div>
    </BrowserRouter>
  )
}

export default App