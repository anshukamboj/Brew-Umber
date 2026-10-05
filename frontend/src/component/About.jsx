import React, { useEffect, useState } from 'react'
import N from '../rest.json'

const About = () => {
const [aboutData,setaboutData]=useState(N)


  return (
  <div className="w-full min-h-screen bg-white">
      
      <section 
        className="relative pt-28 pb-16 sm:py-24 flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutData.heroSection.heroBackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white sm:mt-9 font-serif drop-shadow-md">
            {aboutData.heroSection.headline}
          </h1>
          <p className="text-base sm:text-lg text-gray-200 font-medium">
            {aboutData.heroSection.subHeadline}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-amber-950 mb-6 font-serif">
            {aboutData.ourStorySection.heading}
          </h2>
          {aboutData.ourStorySection.paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="w-full md:w-1/2">
          <img 
            src={aboutData.ourStorySection.storySideImage} 
            alt="Our Story" 
            className="rounded-lg shadow-lg object-cover h-64 w-full"
          />
        </div>
      </section>

      <section className="flex flex-wrap justify-center gap-8 sm:gap-12 py-10 sm:py-12 bg-amber-950 text-white px-4">
        {aboutData.statsSection.map((stat) => (
          <div key={stat.id} className="text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">{stat.number}</div>
            <div className="text-sm uppercase tracking-wider font-semibold">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="py-10 sm:py-16 px-4 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-amber-950 mb-10 font-serif">
          {aboutData.valuesSection.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {aboutData.valuesSection.values.map((val) => (
            <div key={val.id} className="p-6 border border-gray-100 rounded-xl shadow-sm bg-gray-50 sm:last:col-span-2 md:last:col-span-1">
              <div className="text-4xl mb-4">{val.icon}</div>
              <h3 className="text-xl font-bold text-amber-950 mb-3">{val.title}</h3>
              <p className="text-gray-600">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default About
