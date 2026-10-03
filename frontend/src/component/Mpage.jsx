import React from 'react'
import { useNavigate } from 'react-router-dom'

import Beans from '../assets/Beans.jpg';
import coffee from '../assets/coffee.mp4';

const Mpage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center pt-24"
      style={{ backgroundImage: `url(${Beans})` }}>

      <div className="absolute inset-0 bg-white/50"></div>

      <div className='relative z-20 mt-3 bg-white w-10/12 h-full rounded-t-2xl shadow-2xl text-center'>
        <div>
          <h1 className='text-6xl text-48px text-amber-950 drop-shadow-md pt-9 font-serif'>
           Discover the Art of Brew
          </h1>
        </div>

        <div className='max-w-2xl mx-auto mt-4 mb-auto'>
          <h4 className='text-bold text-2xl text-center text-amber-950 font-sans'>
           Experience specialty coffee, curated with passion and precision. Taste the difference in every cup.
          </h4>

        </div>
        <div className='flex flex-col items-center'>
          <button onClick={() => navigate("/menu")} className='bg-amber-950 hover:bg-amber-900 transition-colors text-white rounded-3xl px-8 py-3 w-56 mt-4 font-semibold shadow-md'>
            Explore Products
          </button>

          <video
  src={coffee}
  controls
  autoPlay
  muted
  loop
 className="mt-3 w-11/12 max-w-3xl h-79 object-cover rounded-t-2xl "
>
</video>

        </div>
        

      </div>

    </div>
  )
}

export default Mpage

