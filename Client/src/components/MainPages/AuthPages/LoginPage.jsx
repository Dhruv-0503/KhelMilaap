import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className="flex font-roboto items-center justify-center min-h-screen bg-gradient-to-r from-gray-600 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>
        
        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
          />
          <div className="text-right mt-2">
            <a href="#" className="text-blue-400 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform duration-300 mb-4"
        >
          Login
        </motion.button>

        {/* Google Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform duration-300"
        >
          <FaGoogle className="text-lg" />
          Login with Google
        </motion.button>

        {/* Register Option */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register Now
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
