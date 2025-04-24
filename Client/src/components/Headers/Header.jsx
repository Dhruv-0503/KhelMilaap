import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiUser } from "react-icons/fi";
import { GiAmericanFootballPlayer } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import { motion } from 'framer-motion';
import InteractiveHoverButton from '../ui/HomePageUI/InteractiveHoveButton';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false
  const dropdownRef = useRef(null);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if the user is logged in (on component mount)
  useEffect(() => {
    // Check for a valid token in localStorage to determine if the user is logged in
    const userAuthToken = localStorage.getItem('token'); // Assuming 'token' is the key you set during login
    if (userAuthToken) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  // Function to close the menu when a link is clicked
  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  const isLoginPage = location.pathname === "/login"; // Check if on the login page

  return (
    <>
      <nav className="bg-gray-100 sticky top-0 w-full overflow-x-hidden z-500 shadow-lg font-roboto px-4 py-3 flex justify-between items-center gap-8 text-black transition-all duration-500 hover:border-indigo-500">
        <Link to='/' className="text-3xl hover:text-gray-600 cursor-pointer font-rowdies tracking-wide flex-1">KHELMILAAP</Link>

        {/* Hide links if on the login page */}
        {!isLoginPage && (
          <div className="hidden md:flex gap-6 text-[20px]">
            {!isLoggedIn && !isActive('/') && (
              <Link to="/" className="relative group overflow-hidden" onClick={handleMenuItemClick}>
                Home
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
            {!isActive('/community') && <Link to="/community" className="relative group overflow-hidden" onClick={handleMenuItemClick}>
              Community
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>}
            {!isActive('/event') && <Link to="/events" className="relative group overflow-hidden" onClick={handleMenuItemClick}>
              Events
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>}
            {!isActive('/coach') && <Link to="/coach" className="relative group overflow-hidden" onClick={handleMenuItemClick}>
              Coaches
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>}
          </div>
        )}

        {!isLoginPage && (
          isLoggedIn ? (
            <Link to='/profile'>
              <img
                src="/assets/images/testinomial1.jpg"// Replace with user profile image URL
                alt="Profile"
                className="hidden md:block w-10 h-10 rounded-full border-2 border-indigo-500 cursor-pointer"
              />
            </Link>
          ) : (
            <InteractiveHoverButton className='hidden lg:block md:block'>
              <Link to='/login' onClick={handleMenuItemClick}>Login</Link>
            </InteractiveHoverButton>
          )
        )}

        {/* Menu Icon */}
        <div className="nav-menu md:hidden">
          <button onClick={toggleMenu} className="text-3xl cursor-pointer">
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
              <FiMenu className={`${isOpen ? 'text-white' : ''}`} />
            </motion.div>
          </button>
        </div>
      </nav>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-md z-10">
        </motion.div>
      )}

      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut", bounce: 0.3 }}
          className="fixed top-16 right-4 w-56 bg-white/50 backdrop-blur-lg shadow-xl rounded-xl z-20 overflow-hidden"
        >
          <ul className="flex flex-col gap-4 p-4 text-center font-bold text-[18px]">
            {!isLoggedIn && (
              <Link to='/' onClick={handleMenuItemClick}>
                <li className="cursor-pointer hover:bg-indigo-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                  <p className='flex justify-start items-center gap-2 w-full h-full'>
                    <FiHome /> Home
                  </p>
                </li>
              </Link>
            )}
            <Link to='/community' onClick={handleMenuItemClick}>
              <li className="cursor-pointer hover:bg-indigo-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                <p className='flex justify-start items-center gap-2 w-full h-full'>
                  <FaUsers /> Community
                </p>
              </li>
            </Link>
            <Link to='/events' onClick={handleMenuItemClick}>
              <li className="cursor-pointer hover:bg-indigo-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                <p className='flex justify-start items-center gap-2 w-full h-full'>
                  <MdEvent /> Events
                </p>
              </li>
            </Link>
            <Link to='/coach' onClick={handleMenuItemClick}>
              <li className="cursor-pointer hover:bg-indigo-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                <p className='flex justify-start items-center gap-2 w-full h-full'>
                  <GiAmericanFootballPlayer /> Coaches
                </p>
              </li>
            </Link>
            {isLoggedIn ? (
              <Link to='/profile' onClick={handleMenuItemClick}>
                <li className="cursor-pointer hover:bg-indigo-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                  <p className='flex justify-start items-center gap-2 w-full h-full'>
                    <FiUser /> Profile
                  </p>
                </li>
              </Link>
            ) : (
              <Link to='/login' onClick={handleMenuItemClick}>
                <li className="cursor-pointer hover:bg-indigo-500 hover:text-white p-3 rounded-xl transition-all duration-300 flex items-center gap-2">
                  <p className='flex justify-start items-center gap-2 w-full h-full'>
                    <FiUser /> Login
                  </p>
                </li>
              </Link>
            )}
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default Header;
