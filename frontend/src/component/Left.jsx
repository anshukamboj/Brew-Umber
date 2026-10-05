import React from 'react'
import Pic from '../assets/Caffe.png'

const Left = () => {
  return (
    <div className='flex flex-row items-center gap-2 sm:gap-3'>
      <img className='h-11 w-11 sm:h-16 sm:w-16 object-contain' src={Pic} alt="pic" />
      <h1 className='text-lg sm:text-2xl font-bold text-amber-950'>Brew Umber</h1>
    </div>
  )
}

export default Left
