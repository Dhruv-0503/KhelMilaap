import React, { useState } from 'react';
import axios from '../../../utils/axios';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';


const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Player' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegistering) {
                if (form.password !== form.confirmPassword) {
                    return setError('Passwords do not match');
                }
                await axios.post('/users/register', {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                });
                setIsRegistering(false);
            } else {
                const res = await axios.post('/users/login', {
                    email: form.email,
                    password: form.password,
                });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('profileId', res.data.profileId);

                // Fetch profile and store in localStorage before navigating
                const profileRes = await axios.get(`/users/profile/${res.data.userId}`);
                localStorage.setItem('profile', JSON.stringify(profileRes.data));
                localStorage.setItem('avatar', profileRes.data.avatar);

                navigate('/profile');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const googleAuthCode = response.code; // Ensure this is the authorization code
                if (!googleAuthCode) {
                    setError('Google authorization code is missing.');
                    return;
                }
    
                const res = await axios.post('/users/google-auth', {
                    code: googleAuthCode,
                });
    
                // Store token and user info
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('profileId', res.data.profileId);
                localStorage.setItem('name', res.data.name);
                localStorage.setItem('email', res.data.email);
    
                navigate('/profile');
            } catch (error) {
                console.error('Google Auth error:', error);
                setError('Google Authentication Failed');
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            setError('Google Login was unsuccessful');
        },
        flow: 'auth-code',
        scope: 'openid email profile', // Ensure required info is returned
    });


    return (
        <div className="font-roboto min-h-screen flex items-center justify-center bg-cover bg-center p-4" style={{ backgroundImage: `url('/assets/images/AuthPageBG.jpg')` }}>
            {/* Large screen layout */}
            <div className="hidden md:flex relative w-full max-w-4xl bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Side Content */}
                <motion.div
                    initial={false}
                    animate={{ x: isRegistering ? '100%' : '0%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="w-1/2 p-8 flex flex-col justify-center relative bg-cover bg-center"
                    style={{ backgroundImage: `url(${isRegistering ? 'https://img.freepik.com/free-photo/watercolor-light-steel-blue-wallpaper-image_53876-94665.jpg' : 'https://img.freepik.com/free-vector/business-background-vector-blue-abstract-style_53876-126697.jpg'})`, opacity: 0.9 }}
                >
                    <h2 className="text-3xl text-gray-900 font-bold text-center mb-4 mt-10">
                        {isRegistering ? 'Join Our Community!' : 'Welcome Back!'}
                    </h2>
                    <p className="text-center text-gray-800 text-[17px] mb-6">
                        {isRegistering
                            ? 'Sign up now and start your journey with us.'
                            : 'Log in to stay connected with your community.'}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleAuthMode}
                        className="w-full bg-gray-900 cursor-pointer text-gray-300 font-bold py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all"
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
                    style={{ opacity: 0.9 }}
                >
                    <h2 className="text-3xl font-bold text-center mb-6">
                        {isRegistering ? 'Create an Account' : 'Login'}
                    </h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {isRegistering && (
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700  outline-none" />
                        )}
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700  outline-none" />
                        {isRegistering && (
                            <>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none"
                                >
                                    <option value="Player">Player</option>
                                    <option value="Coach">Coach</option>
                                </select>
                            </>
                        )}
                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700  outline-none" />
                        {isRegistering && (
                            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700  outline-none" />
                        )}
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg shadow-md">{isRegistering ? 'Register' : 'Login'}
                        </motion.button>
                        {!isRegistering && (
                            <motion.button
                                type="button"
                                onClick={() => googleLogin()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
                            >
                                <FaGoogle size={20} /> Login with Google
                            </motion.button>
                        )}
                    </form>
                </motion.div>
            </div>

            {/* Small screen layout */}
            <div className="md:hidden w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg text-white" style={{ opacity: 0.95 }}>
                <h2 className="text-3xl font-bold text-center mb-6">{isRegistering ? 'Create an Account' : 'Login'}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isRegistering && (
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" />
                    )}
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" />
                    {isRegistering && (
                        <>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none"
                            >
                                <option value="Player">Player</option>
                                <option value="Coach">Coach</option>
                            </select>
                        </>
                    )}
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" />
                    {isRegistering && (
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" />
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg">{isRegistering ? 'Register' : 'Login'}</motion.button>
                    <motion.button
                        type="button"
                        onClick={() => googleLogin()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
                    >
                        <FaGoogle size={20} /> {isRegistering ? 'Register' : 'Login'} with Google
                    </motion.button>
                </form>
                <p className="text-center text-gray-400 mt-4 cursor-pointer" onClick={toggleAuthMode}>{isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}</p>
            </div>
        </div>
    );
};

export default AuthPage;
