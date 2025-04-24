import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 p-4">
            <div className="relative w-full max-w-4xl bg-gray-900 shadow-2xl rounded-2xl overflow-hidden flex">
                {/* Left Side Content */}
                <motion.div 
                    initial={false}
                    animate={{ x: isRegistering ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="w-1/2 p-8 flex flex-col justify-center text-white bg-blue-700 relative z-10"
                >
                    <h2 className="text-3xl font-bold text-center mb-4">
                        {isRegistering ? 'Join Us Today!' : 'Welcome Back!'}
                    </h2>
                    <p className="text-center text-gray-200 mb-6">
                        {isRegistering 
                            ? 'Sign up and be part of our amazing sports community.' 
                            : 'Log in to stay connected with your community.'}
                    </p>
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        onClick={toggleAuthMode} 
                        className="w-full bg-white text-blue-700 font-bold py-3 rounded-lg shadow-md hover:bg-gray-100 transition-all"
                    >
                        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </motion.button>
                </motion.div>

                {/* Right Side: Forms */}
                <motion.div 
                    initial={false}
                    animate={{ x: isRegistering ? '-100%' : '0%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="w-1/2 p-8 bg-gray-900 text-white"
                >
                    <h2 className="text-3xl font-bold text-center mb-6">
                        {isRegistering ? 'Create an Account' : 'Login'}
                    </h2>
                    
                    <form className="space-y-4">
                        {isRegistering && (
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Full Name" 
                                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                            />
                        )}
                        
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email Address" 
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                        />

                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                        />

                        {isRegistering && (
                            <input 
                                type="password" 
                                name="confirmPassword" 
                                placeholder="Confirm Password" 
                                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                            />
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-transform duration-300"
                        >
                            {isRegistering ? 'Register' : 'Login'}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg shadow-md transition-transform duration-300"
                        >
                            <FaGoogle size={20} /> {isRegistering ? 'Register' : 'Login'} with Google
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;