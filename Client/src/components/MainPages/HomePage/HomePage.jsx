import 'animate.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { HeroParallax } from '../../ui/HomePageUI/HeroParallax';
import SparklesText from '../../ui/HomePageUI/SparklesText';
import StepwiseScrollCards from '../../ui/HomePageUI/StepwiseScrollCards';
import { AnimatedTestimonials } from '../../ui/HomePageUI/AnimatedTestimonials';
import { FeaturesSectionDemo } from '../../ui/HomePageUI/FeaturesSectionDemo';
import SportsCarousel from '../../ui/HomePageUI/SportsCarousel';

const HomePage = () => {
  
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/login");
  };

  const handleClick = (name) => {
    if (name === 'getComm') {
      navigate('/community');
    }
    else if (name === 'getEvent') {
      navigate('/events');
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() =>{
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  },[])


  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  })

  return (
    
    <div className='home-main flex flex-col justify-center items-center w-full'>

      <div className="w-full h-[300px] md:h-[500px] lg:h-screen flex bg-[url('/assets/images/mainPageBG.jpg')] bg-cover bg-center flex-col justify-start items-start relative overflow-hidden">
        <span className='font-moon font-bold text-4xl drop-shadow-md animate-bounce absolute top-15 left-7 opacity-70 md:top-30 md:left-15 md:text-5xl lg:top-35 lg:left-25 lg:text-7xl'>Start Your Journey With</span>
        <span className='font-roboto text-4xl absolute top-22 left-7 font-bold opacity-85 md:top-40 md:left-15 md:text-[40px] lg:top-49 lg:left-25 lg:text-5xl'>KhelMilaap</span>
        <span className='font-roboto text-[12px] absolute top-32 left-7 md:top-50 md:left-15 md:text-[20px] lg:top-61 lg:left-25 lg:text-[25px]'>Discover, Connect & Play.</span>
        <button onClick={handleNavigate} className='font-roboto absolute top-40 left-7 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer md:top-62 md:left-15 md:text-2xl lg:top-77 lg:left-25 lg:text-4xl'>Get Started</button>
        <span className='w-full h-[30px] bg-black absolute top-69 opacity-60 md:h-[36px] md:top-116 lg:top-134 lg:hidden'></span>
      </div>

      {/* Section 1 */}
      <section>
        <div className='hidden lg:block'>
          <HeroParallax />
        </div>

        <div className=' lg:hidden'>
          <div className=" relative  overflow-hidden md:h-100">
            <div
              className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-40"
              style={{
                backgroundImage:
                  "url('/assets/images/Event1.jpg')",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
            <div className="relative z-10 text-white py-8 px-4">
              <SparklesText
                text="Stay Active with Our Events"
                className="font-roboto text-[40px] sm:text-5xl md:text-5xl mb-6 animate__animated animate__fadeInUp animate__delay-1s"
                colors={{ first: "#9E7AFF", second: "#FE8BBB" }}
              />

              <p className="sm:text-[17px] md:text-[18px] mb-6 animate__animated animate__fadeIn animate__delay-1.5s">
                Stay connected and never miss an exciting event! At KhelMilaap, we bring the sports community together through a variety of competitions, training sessions, and fun-filled activities.
              </p>
              <p className='sm:text-[17px] md:text-[18px] mb-6 animate__animated animate__fadeIn animate__delay-1.5s'>
                From thrilling tournaments to skill-building workshops, KhelMilaap is your go-to platform for all things sports.
              </p>
              <button onClick={() => handleClick('getEvent')} className='font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl md:text-2xl cursor-pointer animate__animated animate__fadeIn animate__delay-1.5s'>Explore Events</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className='mb-2 '>
        <div className='md:hidden w-full'>
          <StepwiseScrollCards />
        </div>
      </section>

      {/* Section 3 */}
      <section className='z-0'>
        <div className='hidden md:block md:mt-5 lg:mt-5 lg:mb-5 lg:shadow-2xl'>
          <FeaturesSectionDemo />
        </div>  
      </section>

      {/* Section 4*/}
      <section>        
      <div className='hidden md:block md:w-182 lg:w-330 md:overflow-x-hidden'>
         <SportsCarousel/>
        </div>
      </section>

      {/* Section 4*/}
      <section className='z-0 w-full'>        
      <div className='hidden md:block bg-[rgba(0,0,0,0.1)] md:shadow-2xl md:my-2'>
          <AnimatedTestimonials />
        </div>
      </section>
    </div>
  )
}

export default HomePage