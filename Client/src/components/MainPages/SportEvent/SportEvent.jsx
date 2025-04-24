import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';

const eventsData = [
  { 
    name: 'Football Tournament', 
    image: '/assets/images/EventFootball.webp', 
    date: 'March 20, 2025', 
    location: 'New Delhi, India', 
    description: 'Experience an action-packed football tournament with top teams competing for glory.' 
  },
  { 
    name: 'Tennis Championship', 
    image: '/assets/images/EventTennis.jpg', 
    date: 'April 5, 2025', 
    location: 'Mumbai, India', 
    description: 'Watch the best tennis players battle it out for the championship title.' 
  },
  { 
    name: 'Cricket Cup', 
    image: '/assets/images/EventCricket.jpg', 
    date: 'May 10, 2025', 
    location: 'Kolkata, India', 
    description: 'Join us for an electrifying cricket tournament featuring top teams from across India.' 
  },
  { 
    name: 'Basketball League', 
    image: '/assets/images/EventBasketball.avif', 
    date: 'June 15, 2025', 
    location: 'Bangalore, India', 
    description: 'Fast-paced basketball action awaits you in this premier league competition.' 
  },
  { 
    name: 'Badminton Open', 
    image: '/assets/images/EventBadminton.webp', 
    date: 'July 25, 2025', 
    location: 'Chennai, India', 
    description: 'The best shuttlers compete in an intense badminton showdown—don’t miss out!' 
  },
  { 
    name: 'Hockey Invitational', 
    image: '/assets/images/EventHockey.avif', 
    date: 'August 12, 2025', 
    location: 'Hyderabad, India', 
    description: 'Witness thrilling hockey matches as teams battle for the prestigious invitational title.' 
  },
];

const SportEvent = () => {
  const [showEvents, setShowEvents] = useState(false);
  const eventSectionRef = useRef(null);

  const handleButtonClick = () => {
    setShowEvents(!showEvents);

    // Scroll down to event section when expanded
    setTimeout(() => {
      if (!showEvents && eventSectionRef.current) {
        eventSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200); // Small delay to ensure visibility
  };

  return (
    <div className="font-roboto relative w-full overflow-hidden py-10">
      <p className="text-4xl text-gray-300 sm:text-5xl font-roboto font-bold text-center mb-6 pb-2">Upcoming Events</p>

      {/* Carousel */}
      <motion.div
        className="flex lg:gap-2 bg-[rgba(0,0,0,0.1)] py-5"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{ width: "max-content", display: "flex" }}
      >
        {[...eventsData, ...eventsData].map((event, index) => (
          <div
            key={index}
            className="w-64 flex-shrink-0 relative rounded-2xl overflow-hidden shadow-lg mx-2 group lg:w-100 lg:h-70"
          >
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full shadow-2xl object-cover transition-all duration-300 ease-in-out group-hover:blur-sm"
            />
            <div className="absolute cursor-pointer inset-0 bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <span className="text-white font-roboto text-xl font-bold">{event.name}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Button to Show Event List */}
      <div className="text-center mt-6">
        <button
          onClick={handleButtonClick}
          className='font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer md:text-2xl md:mt-5'
        >
          {showEvents ? 'Hide Events' : 'See More Events'}
        </button>
      </div>

      {/* Event List with Cards */}
      {showEvents && (
        <div ref={eventSectionRef} className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {eventsData.map((event, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col items-center text-center">
              <img src={event.image} alt={event.name} className="w-full h-40 object-cover rounded-xl mb-3" />
              <h2 className="text-white text-xl font-bold">{event.name}</h2>
              <p className="text-gray-400 mt-1">{event.date}</p>
              <p className="text-gray-400">{event.location}</p>
              <p className="text-gray-300 text-sm mt-2">{event.description}</p>
              <button className="font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-1 px-6 rounded-[10px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer md:text-2xl md:mt-5 mt-2">
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SportEvent;
