import { motion } from 'framer-motion';
import React, { useRef } from 'react';

const sportsData = [
  { name: 'Football', image: '/assets/images/sport3.jpg' },
  { name: 'Tennis', image: '/assets/images/sport2.jpg' },
  { name: 'Cricket', image: '/assets/images/sport1.jpg' },
  { name: 'Basketball', image: '/assets/images/sport4.jpg' },
  { name: 'Badminton', image: '/assets/images/sport5.jpg' },
  { name: 'Hockey', image: '/assets/images/sport6.jpg' },
];

const SportsCarousel = () => {
  const carouselRef = useRef(null);

  return (
    <div className="relative w-full overflow-hidden py-10">
      <p className="text-5xl text-gray-300 font-roboto font-bold text-center mb-6 pb-2">Explore Our Popular Sports</p>
      <motion.div
        className="flex"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        style={{ width: "max-content", display: "flex" }}
      >
        {[...sportsData, ...sportsData].map((sport, index) => (
          <div
            key={index}
            className="w-64 flex-shrink-0 relative rounded-2xl overflow-hidden shadow-lg mx-2 group"
          >
            <img
              src={sport.image}
              alt={sport.name}
              className="w-full h-40 shadow-2xl object-cover transition-all duration-300 ease-in-out group-hover:blur-sm"
            />
            <div className="absolute cursor-pointer inset-0 bg-[rgba(0,0,0,0.1)] bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-white font-roboto text-xl font-bold">{sport.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SportsCarousel;
