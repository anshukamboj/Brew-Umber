import React from 'react'
import { useNavigate } from 'react-router-dom'

import Beans from '../assets/Beans.jpg';
import coffee from '../assets/coffee.mp4';

const Mpage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden min-h-screen lg:h-screen w-full bg-cover bg-center bg-no-repeat flex lg:items-center justify-center pt-24"
      style={{ backgroundImage: `url(${Beans})` }}>

      <div className="absolute inset-0 bg-white/50"></div>

      <div className='relative z-20 mt-3 bg-white w-11/12 lg:w-10/12 lg:h-full rounded-t-2xl shadow-2xl text-center px-4 flex flex-col'>
        <div>
          <h1 className='text-3xl sm:text-5xl lg:text-6xl text-48px text-amber-950 drop-shadow-md pt-6 sm:pt-9 font-serif'>
           Discover the Art of Brew
          </h1>
        </div>

        <div className='max-w-2xl mx-auto mt-4 mb-auto'>
          <h4 className='text-bold text-base sm:text-xl lg:text-2xl text-center text-amber-950 font-sans'>
           Experience specialty coffee, curated with passion and precision. Taste the difference in every cup.
          </h4>

        </div>
        <div className='flex flex-col items-center flex-1'>
          <button onClick={() => navigate("/menu")} className='bg-amber-950 hover:bg-amber-900 transition-colors text-white rounded-3xl px-8 py-3 w-56 max-w-full mt-4 mb-3 font-semibold shadow-md'>
            Explore Products
          </button>

          <video
  src={coffee}
  controls
  autoPlay
  muted
  loop
  playsInline
 className="mt-auto w-11/12 max-w-3xl h-44 sm:h-60 lg:h-79 object-cover rounded-t-2xl "
>
</video>

        </div>
      </div>

    </div>
  )
}

export default Mpage
