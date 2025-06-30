import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "animate.css";
import { FaUsers } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import axios from '../../../utils/axios';

const Community = () => {
  const [communities, setCommunities] = useState([]); // Ensure it's an array
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true); // To show loading state
  const [error, setError] = useState(""); // To handle errors
  const [modalOpen, setModalOpen] = useState(false); // To control modal visibility
  const [newCommunityData, setNewCommunityData] = useState({
    name: "",
    description: "",
    sport: "Football",
    avatar: null,
  });

  const sports = ["All", "Football", "Basketball", "Cricket", "Badminton", "Tennis", "Hockey"];
  const dropdownRef = useRef(null);
  const [myComm, setMyComm] = useState(false);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [discoverCommunities, setDiscoverCommunities] = useState([]);

  // Fetch communities from the backend on component mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get("/community/getcomm", { params: { userId } });
        const allCommunities = response.data.communities || [];

        const joined = allCommunities.filter(comm => comm.isJoin);
        const notJoined = allCommunities.filter(comm => !comm.isJoin);
        setJoinedCommunities(joined);
        setDiscoverCommunities(notJoined);
        setCommunities(notJoined);

      } catch (error) {
        setError("Failed to load communities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);


  const filteredCommunities = (communities || []).filter(
    (community) =>
      (filter === "All" || community.sport === filter) &&
      community.name.toLowerCase().includes(search.toLowerCase())
  );

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

  // Handle Create Community button (Open Modal)
  const handleCreateCommunity = () => {
    setModalOpen(true); // Open modal
  };

  const handleSubmitCommunity = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data for the request
      const formData = new FormData();
      formData.append("name", newCommunityData.name);
      formData.append("description", newCommunityData.description);
      formData.append("sport", newCommunityData.sport);

      // If avatar is provided, append it to the form data
      if (newCommunityData.avatar) {
        formData.append("avatar", newCommunityData.avatar);
      }

      // Get the token from local storage or wherever it's stored
      const token = localStorage.getItem("token"); // or sessionStorage or state

      const response = await axios.post("/community/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`, // Add token for authorization
        },
      });

      // Handle success response
      setCommunities((prevCommunities) => [
        ...prevCommunities,
        response.data.community,
      ]); // Add new community to the list
      setModalOpen(false); // Close the modal
      setNewCommunityData({ name: "", description: "", avatar: null }); // Reset form
    } catch (error) {
      setError("Failed to create community. Please try again.");
    }
  };

  const [showDialog, setShowDialog] = useState(false);

  const handleJoinComm = async (communityId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/community/join", { communityId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
        <div className="relative w-full md:w-1/3" ref={dropdownRef}>
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
      {/* Create Button - Under Search/Filter and Left-Aligned if communities exist */}
      {filteredCommunities.length > 0 && (
        <div className="mt-4 flex justify-start gap-5">
          <button
            onClick={handleCreateCommunity}
            className="font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer mb-4"
          >
            Create Community
          </button>
          <button
            onClick={() => {
              setMyComm(prev => {
                const newState = !prev;
                if (newState) {
                  setCommunities(joinedCommunities);   // Now showing "Discover Community"
                } else {
                  setCommunities(discoverCommunities); // Now showing "My Community"
                }
                return newState;
              });
            }}
            className="font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer mb-4"
          >
            {myComm ? "Discover Community" : "My Community"}
          </button>

        </div>
      )}

      {/* Display Error or No Communities */}
      {error && <p className="text-center text-red-500 font-semibold">!! {error} !!</p>}
      {filteredCommunities.length === 0 && !loading && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-[100px]"><FaUsers /></p>
          <p className="font-roboto">No communities found. Be the first to create one!</p>
        </div>
      )}

      {/* Community Cards */}
      {filteredCommunities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate__animated animate__fadeInUp">
          {filteredCommunities.map((community) => (
            <motion.div
              key={community._id} // Ensure this is unique for each community
              className="p-6 bg-white shadow-xl rounded-3xl flex flex-col items-center text-center border border-gray-200 hover:shadow-2xl transition-transform transform hover:scale-105 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={`http://localhost:5000/${community.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                alt={community.name}
                className="w-20 h-20 rounded-full border-4 border-blue-500 shadow-md mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">{community.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{community.description}</p>
              <div className="flex items-center justify-center text-gray-700 text-sm">
                <FaUsers className="text-blue-500 mr-1" />
                <span>{community.membersCount} members</span>
              </div>
              <button onClick={() => handleJoinComm(community._id)} className="mt-4 px-5 py-2 bg-blue-500 hover:cursor-pointer text-white rounded-full hover:bg-blue-600 transition-all shadow-lg">
                {myComm ? "View Community" : "Join"}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {showDialog && (
        <div className="bg-green-400 w-max p-3 rounded-xl text-sm absolute top-3 left-1/2 transform -translate-x-1/2 z-10000  font-bold text-white">
          Successfully joined the community!
        </div>
      )}

      {/* Create Community Button for Empty State */}
      {filteredCommunities.length === 0 && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={handleCreateCommunity}
            className='font-roboto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-[15px] shadow-md hover:scale-105 transition-transform duration-300 hover:shadow-xl cursor-pointer'
          >
            Create Community
          </button>
        </div>
      )}


      {/* Modal for Creating Community */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96 mt-20">
            <h2 className="text-xl font-semibold text-center mb-4">Create a New Community</h2>
            <form onSubmit={handleSubmitCommunity}>
              <div className="mb-4">
                <div className="flex items-center justify-center mb-5">
                  <img
                    src={newCommunityData.avatar ? URL.createObjectURL(newCommunityData.avatar) : "/assets/images/comm1.png"} // Show the avatar if selected, otherwise default
                    alt="avatar"
                    className="w-15 h-15 rounded-full object-cover border border-gray-300"
                  />
                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-600">Change Profile Photo</label>
                    <input onChange={(e) => setNewCommunityData({ ...newCommunityData, avatar: e.target.files[0] })} type="file" accept="image/*" className="mt-1 text-sm border-1 p-1 rounded cursor-pointer w-[230px]" />
                  </div>
                </div>
                <label htmlFor="communityName" className="block text-sm font-medium text-gray-600">Community Name</label>
                <input
                  type="text"
                  id="communityName"
                  value={newCommunityData.name}
                  onChange={(e) => setNewCommunityData({ ...newCommunityData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="communityDescription" className="block text-sm font-medium text-gray-600">Description</label>
                <textarea
                  id="communityDescription"
                  value={newCommunityData.description}
                  onChange={(e) => setNewCommunityData({ ...newCommunityData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="communitySport" className="block text-sm font-medium text-gray-600">Sport</label>
                <select
                  id="communitySport"
                  value={newCommunityData.sport}
                  onChange={(e) => setNewCommunityData({ ...newCommunityData, sport: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none"
                >
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-xl shadow-md hover:bg-blue-600"
                >
                  Add Community
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-xl shadow-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
