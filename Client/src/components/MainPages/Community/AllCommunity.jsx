import { useState } from "react";
import { motion } from "framer-motion";
import "animate.css";
import { FaUsers } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";

const communities = [
  {
    id: 1,
    name: "Football Fanatics",
    avatar: "/assets/images/comm1.png",
    members: 1200,
    description: "A passionate group of football lovers!",
    sport: "Football",
  },
  {
    id: 2,
    name: "Basketball Legends",
    avatar: "/assets/images/comm3.png",
    members: 850,
    description: "For those who live and breathe basketball.",
    sport: "Basketball",
  },
  {
    id: 3,
    name: "Cricket Warriors",
    avatar: "/assets/images/comm2.png",
    members: 1350,
    description: "Cricket enthusiasts unite!",
    sport: "Cricket",
  },
];

const Community = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sports = ["All", "Football", "Basketball", "Cricket","Badminton","Tennis","Hockey"];

  const filteredCommunities = communities.filter(
    (community) =>
      (filter === "All" || community.sport === filter) &&
      community.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-10 max-w-[90%] mx-auto min-h-screen bg-gray-100 font-roboto shadow-2xl">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
        <div className="relative w-full md:w-2/3 bg-white rounded-2xl">
          <IoSearch className="absolute left-3 top-[14px] text-gray-600 text-2xl" />
          <input
            type="text"
            placeholder="Search Communities..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-1/3">
          <button
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm bg-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Community Cards */}
      {filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate__animated animate__fadeInUp">
          {filteredCommunities.map((community) => (
            <motion.div
              key={community.id}
              className="p-6 bg-white shadow-xl rounded-3xl flex flex-col items-center text-center border border-gray-200 hover:shadow-2xl transition-transform transform hover:scale-105 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={community.avatar}
                alt={community.name}
                className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-md mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">{community.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{community.description}</p>
              <div className="flex items-center justify-center text-gray-700 text-sm">
                <FaUsers className="text-blue-500 mr-1" />
                <span>{community.members} members</span>
              </div>
              <button className="mt-4 px-5 py-2 bg-blue-500 hover:cursor-pointer text-white rounded-full hover:bg-blue-600 transition-all shadow-lg">
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-4 animate__animated animate__fadeIn font-semibold">🚨 Community not found!</p>
      )}
    </div>
  );
};

export default Community;
