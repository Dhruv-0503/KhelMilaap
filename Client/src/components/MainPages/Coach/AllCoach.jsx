import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "animate.css";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown, FaRupeeSign } from "react-icons/fa";
import axios from '../../../utils/axios';

const AllCoach = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [myCoach, setMyCoach] = useState(false);
  const [hiredCoaches, setHiredCoaches] = useState([]);
  const [notHiredCoaches, setNotHiredCoaches] = useState([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get("/coach/getCoaches", { params: { userId } }); // your backend route
        const allCoach = res.data.coaches || [];

        const hired = allCoach.filter(coach => coach.isHired);
        const notHired = allCoach.filter(coach => !coach.isHired);

        setHiredCoaches(hired);
        setNotHiredCoaches(notHired);
        setCoaches(notHired);

      } catch (err) {
        console.error("Failed to fetch coaches:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showDialog, setShowDialog] = useState(false);

  const handlehireCoach = async (coachId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/coach/hireCoach', { coachId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res) {
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
        }, 2000);
      }

    } catch (err) {
      console.error(err.response?.data?.message || "Failed to hire coach.");
    }
  };


  const sports = ["All", "Football", "Basketball", "Cricket", "Badminton", "Tennis", "Hockey"];

  const filteredCoaches = coaches.filter(
    (coach) =>
      (filter === "All" || coach.sports.includes(filter)) &&
      coach.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <>
    <div className="grid grid-cols-1 p-10 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="p-6 bg-white shadow-xl rounded-3xl flex flex-col items-center text-center border border-gray-200">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mt-4"></div>
        </div>
      ))}
    </div>
  </>;

  return (
    <div className="px-6 py-10 max-w-[90%] mx-auto min-h-screen bg-gray-100 font-roboto">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
        <div className="relative w-full md:w-2/3 bg-white rounded-2xl">
          <IoSearch className="absolute left-3 top-[14px] text-gray-600 text-2xl" />
          <input
            type="text"
            placeholder="Search Coaches..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-1/3" ref={dropdownRef}>
          <button
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm bg-white flex justify-between items-center focus:outline-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {filter} <FaChevronDown className="text-gray-500" />
          </button>
          {dropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute w-full bg-white shadow-lg rounded-xl mt-1 overflow-hidden z-10"
            >
              {sports.map((sport) => (
                <li
                  key={sport}
                  className="p-3 hover:bg-blue-500 hover:text-white cursor-pointer"
                  onClick={() => {
                    setFilter(sport);
                    setDropdownOpen(false);
                  }}
                >
                  {sport}
                </li>
              ))}
            </motion.ul>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          setMyCoach(prev => {
            const newState = !prev;
            if (newState) {
              setCoaches(hiredCoaches);
            } else {
              setCoaches(notHiredCoaches);
            }
            return newState;
          });
        }}
        className="font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer mb-4"
      >
        {myCoach ? "Discover Coaches" : "My Coaches"}
      </button>

      {/* Coach Cards */}
      {!filteredCoaches.status && filteredCoaches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate__animated animate__fadeInUp">
          {filteredCoaches.map((coach) => (
            <motion.div
              key={coach.coachId}
              className="p-6 bg-white shadow-xl rounded-3xl flex flex-col items-center text-center border border-gray-200 hover:shadow-2xl transition-transform transform hover:scale-105 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={`http://localhost:5000/${coach.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                alt={coach.name}
                className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-md mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">{coach.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{coach.description}</p>
              <p className="text-sm font-medium text-gray-700">Experience: {coach.experience} Years</p>
              <p className="text-sm font-medium text-gray-700">
                Sports: {coach.sport.join(', ')}
              </p>
              <div className="flex items-center justify-center text-gray-700 text-sm mt-2">
                <FaRupeeSign className="text-green-500 mr-1" />
                <span>{coach.fees}/month</span>
              </div>
              <button onClick={() => handlehireCoach(coach.coachId)} className="mt-4 px-5 py-2 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-lg">
                {myCoach ? "Start Training" : "Hire Coach"}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-4 animate__animated animate__fadeIn font-semibold">🚨 Coach not found!</p>
      )}

      {showDialog && (
        <div className="bg-green-400 w-max p-3 rounded-xl text-sm absolute top-3 left-1/2 transform -translate-x-1/2 z-10000  font-bold text-white">
          Successfully Hired Coach!!
        </div>
      )}
    </div>
  );
};

export default AllCoach;
