import { LuMessageCircleMore } from "react-icons/lu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserFriends, FaCalendarCheck, FaFistRaised } from "react-icons/fa";
import { useState, useEffect } from "react";

// Skeleton Loading Components
const SkeletonProfile = () => (
  <div className='animate-pulse bg-white shadow-lg rounded-xl p-4 flex items-start sm:items-center justify-between gap-4 border border-gray-200'>
    <div className='flex items-center gap-4'>
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 animate-pulse"></div>
      <div>
        <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-2"></div>
        <div className='flex gap-4 mt-2'>
          <div className='text-gray-600 text-sm flex flex-col items-center'>
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className='text-gray-600 text-sm flex flex-col items-center'>
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="h-10 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
  </div>
);

const SkeletonStats = () => (
  <div className="animate-pulse my-6 sm:my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-200 shadow-md">
        <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        <div>
          <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

const SkeletonPosts = () => (
  <div className="animate-pulse mb-8 lg:mb-0">
    <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
          <div className="w-full h-48 sm:h-64 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonEvents = () => (
  <div className="animate-pulse bg-white rounded-xl p-4 border border-gray-200 shadow-md">
    <div className="h-8 w-40 bg-gray-300 rounded animate-pulse mb-4"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
          <div>
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-1"></div>
            <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonCommunities = () => (
  <div className="animate-pulse mb-8">
    <div className="h-8 w-40 bg-gray-300 rounded animate-pulse mb-4"></div>
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center justify-center gap-2 shadow-md bg-white p-4 rounded-lg border border-gray-200 h-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonCoaches = () => (
  <div className="animate-pulse mt-8">
    <div className="h-8 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center justify-center gap-2 shadow-md bg-white p-4 rounded-lg border border-gray-200 h-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = () => {
      const profileString = localStorage.getItem('profile');
      const profileData = profileString ? JSON.parse(profileString) : null;
      
      if (profileData) {
        // Simulate 1 second loading time for better UX
        setTimeout(() => {
          setProfile(profileData);
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className='font-roboto bg-blue text-gray-800 min-h-screen p-4 sm:p-6'>
        <div className='container mx-auto'>
          <SkeletonProfile />
          <SkeletonStats />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SkeletonPosts />
            </div>
            <div className="lg:col-span-1">
              <SkeletonEvents />
            </div>
          </div>
          <div className="mt-8">
            <SkeletonCommunities />
            <SkeletonCoaches />
          </div>
        </div>
      </div>
    );
  }

  // Dummy data for new sections
  const stats = {
    eventsJoined: 18,
    matchesPlayed: 7,
  };

  const uniqueFriendIds = new Set([
    ...(profile?.followers || []).map(f => f.userId),
    ...(profile?.following || []).map(f => f.userId)
  ]);

  const upcomingEvents = [
    { id: 1, name: "Community Cricket Match", date: "2024-08-15", sport: "Cricket" },
    { id: 2, name: "Local Football Tournament", date: "2024-08-20", sport: "Football" },
    { id: 3, name: "Badminton Open Day", date: "2024-09-01", sport: "Badminton" },
  ];

  return (
    <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className='font-roboto bg-blue text-gray-800 min-h-screen p-4 sm:p-6'>
      <motion.div className='container mx-auto'>
        {/* Profile Header */}
        <motion.div 
          className='bg-white shadow-lg rounded-xl p-4 flex items-start sm:items-center justify-between gap-4 border border-gray-200'
        >
          <div className='flex items-center gap-4'>
            <img
              src={`http://localhost:5000/${profile.avatar.replace(/\\/g, '/').replace('public/', '')}`}
              alt="Profile"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-indigo-500 object-cover"
            />
            <div>
              <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>{profile.name}</h1>
              <div className='flex gap-4 mt-2'>
                <div className='text-gray-600 text-sm flex flex-col items-center'>
                  <p className="font-semibold">Followers</p>
                  <span>{profile.followers.length}</span>
                </div>
                <div className='text-gray-600 text-sm flex flex-col items-center'>
                  <p className="font-semibold">Following</p>
                  <span>{profile.following.length}</span>
                </div>
              </div>
            </div>
          </div>
          <Link to='/message' className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-300 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg">
            <LuMessageCircleMore className="text-2xl sm:text-3xl" />
            <span className="hidden sm:inline">Messages</span>
          </Link>
        </motion.div>

        {/* Stats Snapshot */}
        <motion.div className="my-6 sm:my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-800">
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-200 shadow-md">
                <FaCalendarCheck className="text-4xl text-green-500" />
                <div>
                    <p className="text-2xl font-bold">{stats.eventsJoined}</p>
                    <p className="text-gray-800">Events Joined</p>
                </div>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-200 shadow-md">
                <FaUserFriends className="text-4xl text-purple-500" />
                <div>
                    <p className="text-2xl font-bold">{uniqueFriendIds.size}</p>
                    <p className="text-gray-800">Friends</p>
                </div>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-xl p-4 flex items-center gap-4 border border-gray-200 shadow-md">
                <FaFistRaised className="text-4xl text-red-500" />
                <div>
                    <p className="text-2xl font-bold">{stats.matchesPlayed}</p>
                    <p className="text-gray-800">Matches Played</p>
                </div>
            </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2">
                {/* Posts Section */}
                <div className="mb-8 lg:mb-0">
                    <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-100">Your Moments</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {profile.images && profile.images.length > 0 ? (
                        profile.images.map((url, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            className="bg-white p-2 rounded-xl shadow-md cursor-pointer border border-gray-200"
                          >
                            <img
                              src={`http://localhost:5000${url}`}
                              alt={`Post ${index + 1}`}
                              className="w-full h-48 sm:h-64 object-cover rounded-lg"
                            />
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 col-span-full flex flex-col justify-center items-center gap-4 py-8 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-xl lg:text-2xl">Share your moments!</p>
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition">
                            Upload Post
                          </button>
                        </div>
                      )}
                    </div>
                </div>
            </motion.div>

            <motion.div className="lg:col-span-1">
                {/* Upcoming Events Section */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
                    <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-900">Upcoming Events</h2>
                    <div className="space-y-4">
                        {upcomingEvents.map(event => (
                            <motion.div key={event.id} whileHover={{ x: 5 }} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center transition-colors hover:bg-gray-100">
                                <div>
                                    <p className="font-semibold text-gray-800">{event.name}</p>
                                    <p className="text-sm text-gray-500">{event.date}</p>
                                </div>
                                <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{event.sport}</span>
                            </motion.div>
                        ))}
                         <Link to="/events" className="block text-center text-indigo-600 hover:underline mt-4">View All Events</Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
        
        {/* Communities and Coaches */}
        <motion.div className="mt-8">
             {/* Communities Section */}
            <motion.div className="mb-8">
                <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-100">Your Communities</h2>
                {profile.communities.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {profile.communities.map((community, index) => (
                    <Link to={`/community/${community._id}`} key={index}>
                        <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center justify-center gap-2 shadow-md bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 border border-gray-200 h-full">
                            <img
                            src={`http://localhost:5000/${community.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                            alt="Community"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-900 object-cover"
                            />
                            <span className="text-gray-800 text-center text-sm">{community.name}</span>
                        </motion.div>
                    </Link>
                    ))}
                </div>
                ) : (
                <Link to='/communities' className='text-gray-500 flex items-center justify-center hover:text-indigo-600 transition'>No communities yet, <span className='text-indigo-600 ml-1'>Find Communities</span></Link>
                )}
            </motion.div>

            {/* Coaches Section */}
            <motion.div className="mt-8">
                <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4 text-gray-100">Your Coaches</h2>
                {profile.coaches.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                    {profile.coaches.map((coach, index) => (
                    <Link to={`/coaches/${coach._id}`} key={index}>
                         <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center justify-center gap-2 shadow-md bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300 border border-gray-200 h-full">
                            <img
                            src={`http://localhost:5000/${coach.profileId.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                            alt="Coach"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-900 object-cover"
                            />
                            <span className="text-gray-800 text-center text-sm">{coach.profileId.name}</span>
                        </motion.div>
                    </Link>
                    ))}
                </div>
                ) : (
                <Link to='/coaches' className='text-gray-500 flex items-center justify-center hover:text-indigo-600 transition'>No coaches yet, <span className='text-indigo-600 ml-1'>Find Coaches</span></Link>
                )}
            </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;