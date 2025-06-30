import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaUsers, FaImages, FaEdit, FaFacebook, FaInstagram, FaMedal, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GiAmericanFootballPlayer } from "react-icons/gi";
import axios from '../../../utils/axios';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileViewModal from './ProfileViewModal';

const ProfilePage = () => {

  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("bio");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowListModal, setShowFollowListModal] = useState(false);
  const [followListTitle, setFollowListTitle] = useState('');
  const [followListData, setFollowListData] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserIdForModal, setSelectedUserIdForModal] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      navigate('/login');
    } else {
      setUserId(storedUserId);
    }
  }, [navigate]);


  useEffect(() => {
    if (!userId) return;  // Don't fetch if no userId yet

    // Use profile from localStorage first for instant UI
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      setLoading(false);
    }

    // Then fetch fresh profile from server (optional, for up-to-date info)
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/users/profile/${userId}`);
        setProfile(res.data);
        localStorage.setItem('profile', JSON.stringify(res.data));
        const avatarUrl = res.data.avatar;
        localStorage.setItem('avatar', avatarUrl);
      } catch (err) {
        console.error('Failed to fetch profile:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/users/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { imageUrl, images: updatedImages } = res.data;

      setProfile((prev) => ({
        ...prev,
        images: updatedImages,
      }));

    } catch (err) {
      console.error("Failed to upload image:", err.response?.data || err.message);
    }
  };

  const [sports, setSports] = useState(profile?.sports || []);
  const [currentSport, setCurrentSport] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [achievements, setAchievements] = useState(profile?.achievements || []);
  const [newAchievement, setNewAchievement] = useState({ title: '', year: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the updated profile object with only the fields that were filled out
    const updatedProfile = {};

    // Check if each field is not empty, then add to updatedProfile
    if (e.target.name.value) updatedProfile.name = e.target.name.value;
    if (e.target.bio.value) updatedProfile.bio = e.target.bio.value;
    if (e.target.location.value) updatedProfile.location = e.target.location.value;
    if (e.target.facebook.value) updatedProfile.facebook = e.target.facebook.value;
    if (e.target.instagram.value) updatedProfile.instagram = e.target.instagram.value;
    if (e.target.twitter.value) updatedProfile.twitter = e.target.twitter.value;
    if (profile.role === 'Coach') {
      if (e.target.experience.value) updatedProfile.experience = e.target.experience.value;
      if (e.target.fees.value) updatedProfile.fees = e.target.fees.value;
      if (e.target.status) updatedProfile.status = e.target.status.value;
    }
    if (sports.length > 0) updatedProfile.sports = sports;  // If sports are selected

    // Ensure achievements are being sent as an array
    if (achievements.length > 0) updatedProfile.achievements = achievements;

    const formData = new FormData();

    // Append only the updated fields to FormData
    for (const [key, value] of Object.entries(updatedProfile)) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));  // Convert arrays to JSON string
      } else {
        formData.append(key, value);
      }
    }

    // Check if there's a new avatar file and append it to FormData
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    try {
      const token = localStorage.getItem('token');
      const userId = profile?.userId;

      const response = await axios.put(
        `/users/profile/${userId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',  // Important to specify multipart form data
          },
        }
      );

      // Update the profile state with the new profile data from the server
      setProfile(response.data.updatedProfile);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }

    setShowEditModal(false);
  };

  const handleDeleteImage = async (selectedImage) => {
    try {
      const modifiedUrl = selectedImage.replace('http://localhost:5000', '');
      const token = localStorage.getItem('token');
      const userId = profile?.userId;

      const response = await axios.put(
        `/users/profile/deletePost/${userId}`,
        { imageUrl: modifiedUrl },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const updatedProfile = response.data.profile;
        setProfile(updatedProfile);
        setSelectedImage(null);
      }
    }
    catch (error) {
      console.error('Error Deleting post:', error.response?.data || error.message)
    }
  }

  const handlelogout = () => {
    localStorage.clear();
    setProfile(null);
    window.location.href = '/login';
  };

  const sections = [
    { id: "bio", label: "Bio", icon: <FaUserCircle /> },
    { id: "posts", label: "Posts", icon: <FaImages /> },
    { id: "community", label: "Community", icon: <FaUsers /> },
    profile?.role === "Coach"
      ? { id: "trainees", label: "Trainees", icon: <GiAmericanFootballPlayer /> }
      : { id: "coaches", label: "Coaches", icon: <GiAmericanFootballPlayer /> },
  ];

  const handleShowFollowers = () => {
    setFollowListTitle('Followers');
    setFollowListData(profile.followers);
    setShowFollowListModal(true);
  };

  const handleShowFollowing = () => {
    setFollowListTitle('Following');
    setFollowListData(profile.following);
    setShowFollowListModal(true);
  };

  const handleUserItemClick = (userId) => {
    setShowFollowListModal(false);
    setSelectedUserIdForModal(userId);
    setShowProfileModal(true);
  };

  if (loading || !profile) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen px-4 py-6 lg:p-10 font-roboto">

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex md:flex-row gap-2 items-center justify-between bg-white shadow-lg p-6 rounded-2xl"
      >
        {/* Avatar & Info */}
        <div className="flex gap-3 justify-start items-center md:flex-row md:text-left">
          <img
            src={`http://localhost:5000/${profile.avatar.replace(/\\/g, '/').replace('public/', '')}`}
            alt="Profile"
            className="w-23 h-23 rounded-full border-4 border-indigo-500 shadow-lg"
          />
          <div className="md:ml-6 flex flex-col gap-2">
            <h2 className="text-xl md:mb-0 md:mt-0 md:text-xl lg:text-2xl font-bold text-gray-800">{profile.name}</h2>

            <div className="gap-5 lg:gap-10 flex ">
              <button onClick={handleShowFollowers} className="flex flex-col justify-center items-center hover:text-blue-500">
                <div className="flex gap-1 justify-center items-center">
                  <FaUsers />
                  <p>Followers</p>
                </div>
                <p>{profile.followers.length}</p>
              </button>
              <button onClick={handleShowFollowing} className="flex flex-col justify-center items-center hover:text-blue-500">
                <div className="flex gap-1 justify-center items-center">
                  <FaUsers />
                  <p>Following</p>
                </div>
                <p>{profile.following.length}</p>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlelogout}
          className="hidden sm:block sm:flex mt-2 md:mt-0  items-center md:gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <FiLogOut /> Logout
        </motion.button>
        <button onClick={handlelogout} className="sm:hidden text-2xl">
          <FiLogOut />
        </button>
      </motion.div>


      <div className="mt-6 gap-2 flex flex-col md:flex-row">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex px-1 md:flex-col gap-4 md:w-1/4 bg-white p-4 rounded-xl shadow-md"
        >
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setSelectedTab(section.id)}
              whileHover={{ scale: 1.02 }}
              className={`flex py-1 items-center gap-2 px-3 sm:py-2 w-full rounded-lg text-lg transition-all ${selectedTab === section.id
                ? "bg-indigo-500 text-white"
                : "hover:bg-gray-200"
                }`}
            >
              <span className="hidden sm:inline">{section.icon}</span>
              {section.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 md:mt-0 md:w-3/4 p-6 bg-white rounded-xl shadow-md"
        >
          {selectedTab === "bio" && (
            <div className="relative">
              <div className="gap-2 flex flex-col">
                <h3 className="text-2xl font-semibold mb-2 border-b-1">Bio</h3>
                <div className="pl-3 bg-gray-50 p-4 rounded-xl shadow-sm space-y-2">
                  <p className="text-gray-800">
                    <span className="font-semibold text-gray-900">About :</span> {profile.bio}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold text-gray-900">Sports :</span> {profile.sports.join(', ')}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold text-gray-900">Location :</span> {profile.location}
                  </p>
                  {profile.role === "Coach" && (
                    <>
                      <p className="text-gray-800">
                        <span className="font-semibold text-gray-900">Experience :</span> {profile.experience} Years
                      </p>
                      <p className="text-gray-800">
                        <span className="font-semibold text-gray-900">Fees :</span> Rs. {profile.fees}/month
                      </p>
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-5 border-b-1">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  {profile.achievements.length > 0 ? (
                    profile.achievements.map((achieve, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-200 p-4 rounded-xl shadow-md"
                      >
                        <h4 className="text-lg font-semibold flex justify-start items-center gap-2"><FaMedal />{achieve.title}</h4>
                        <p className="text-gray-600">{achieve.year}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 col-span-full flex flex-col justify-ceter items-center gap-2">
                      <p className="text-xl lg:text-2xl flex justify-center items-center gap-1"><FaMedal /> Unlock Your First Achievement<FaMedal /></p>
                      <Link to='/events' className="bg-blue-500 text-white w-fit px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">Explore Events</Link>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-5 border-b-1">Social Links</h3>
                <div className="flex gap-5 pl-1">
                  <a href={profile.socialLinks.facebook} target="_blank" className="text-3xl text-blue-900"><FaFacebook /></a>
                  <a href={profile.socialLinks.instagram} target="_blank" className="text-3xl text-orange-700"><FaInstagram /></a>
                  <a href={profile.socialLinks.twitter} target="_blank" className="text-3xl text-black"><FaXTwitter/></a>
                </div>
              </div>
              <div>
                <button onClick={() => setShowEditModal(true)}
                  className="text-[25px] absolute top-0 right-0 cursor-pointer"><FaEdit /></button>
              </div>
            </div>

          )}

          {showEditModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-40 z-50 flex items-center justify-center px-4">
              <div className="bg-white w-full max-w-2xl max-h-[90vh] mt-25 shadow-xl p-6 relative overflow-y-auto">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                >
                  &times;
                </button>

                <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-5 pb-6">
                  {/* Avatar */}
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={`http://localhost:5000/${profile.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                      alt="avatar"
                      className="w-20 h-20 rounded-full object-cover border border-gray-300"
                    />
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-600">Change Profile Photo</label>
                      <input onChange={(e) => setAvatarFile(e.target.files[0])} type="file" accept="image/*" className="mt-1 text-sm border-1 p-1 rounded cursor-pointer" />
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Name", id: "name", type: "text", value: profile?.name },
                      { label: "Bio", id: "bio", type: "text", value: profile?.bio },
                      { label: "Location", id: "location", type: "text", value: profile?.location },
                      { label: "Facebook", id: "facebook", type: "url", value: profile?.facebook },
                      { label: "Instagram", id: "instagram", type: "url", value: profile?.instagram },
                      { label: "Twitter", id: "twitter", type: "url", value: profile?.twitter },
                      {
                        label: "Profile",
                        id: "status",
                        type: "radio",
                        value: profile?.status === "Yes" ? true : false, // Convert "Yes"/"No" to boolean
                        options: [
                          { label: "Public", value: "Yes" },   // Available stores "Yes"
                          { label: "Private", value: "No" }  // Not Available stores "No"
                        ]
                      },
                      ...(profile?.role === "Coach" ? [
                        { label: "Experience", id: "experience", type: "text", value: profile?.experience },
                        { label: "Fees", id: "fees", type: "number", value: profile?.fees },
                      ] : [])
                    ].map((field) => (
                      <div key={field.id} className="flex items-center">
                        <label htmlFor={field.id} className="w-32 text-sm text-gray-600 font-medium">
                          {field.label}
                        </label>
                        {field.type === "radio" ? (
                          <div className="flex space-x-4">
                            {field.options.map((option) => (
                              <label key={option.value} className="flex items-center">
                                <input
                                  type="radio"
                                  id={field.id}
                                  name={field.id} // Group the radio buttons together
                                  value={option.value}
                                  defaultChecked={profile?.status === option.value} // Check the corresponding option based on profile status
                                  className="mr-2"
                                />
                                {option.label}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            defaultValue={field.value}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}

                    {/* Sports Multi-tag Input */}
                    <div className="flex items-start">
                      <label htmlFor="sports" className="w-32 text-sm text-gray-600 font-medium pt-2">Sports</label>
                      <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm flex flex-wrap gap-2 min-h-[44px]">
                        {sports.map((sport, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            {sport}
                            <button type="button" className="text-xs text-red-500 hover:text-red-700" onClick={() => {
                              const updated = [...sports];
                              updated.splice(index, 1);
                              setSports(updated);
                            }}>
                              &times;
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Type and press Enter"
                          value={currentSport}
                          onChange={(e) => setCurrentSport(e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ',') && currentSport.trim() !== '') {
                              e.preventDefault();
                              if (!sports.includes(currentSport.trim())) {
                                setSports([...sports, currentSport.trim()]);
                              }
                              setCurrentSport('');
                            } else if (e.key === 'Backspace' && currentSport === '') {
                              setSports((prev) => prev.slice(0, -1));
                            }
                          }}
                          className="flex-1 min-w-[120px] outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="flex items-start gap-8 sm:gap-0">
                      <label htmlFor="achievements" className="w-32 text-sm text-gray-600 font-medium pt-2">
                        Achievements
                      </label>
                      <div className="flex-1 flex flex-col gap-2">
                        {achievements.map((achieve, index) => (
                          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <input
                              type="text"
                              placeholder="Title"
                              value={achieve.title}
                              onChange={(e) => {
                                const updated = [...achievements];
                                updated[index].title = e.target.value;
                                setAchievements(updated);
                              }}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Year"
                              value={achieve.year}
                              onChange={(e) => {
                                const updated = [...achievements];
                                updated[index].year = e.target.value;
                                setAchievements(updated);
                              }}
                              className="w-full sm:w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = achievements.filter((_, i) => i !== index);
                                setAchievements(updated);
                              }}
                              className="text-red-500 text-sm"
                            >
                              &times;
                            </button>
                          </div>
                        ))}

                        {/* Add New Achievement */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Title"
                            value={newAchievement.title}
                            onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={newAchievement.year}
                            onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                            className="w-full sm:w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newAchievement.title && newAchievement.year) {
                                setAchievements([...achievements, newAchievement]);
                                setNewAchievement({ title: '', year: '' });
                              }
                            }}
                            className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Save Button */}
                  <div className="mt-6 text-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-sm font-medium transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {selectedTab === "posts" && (
            <div className="relative">
              <h3 className="text-xl font-semibold mb-4">My Posts</h3>

              {/* Posts Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.images && profile.images.length > 0 ? (
                  profile.images.map((url, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-200 p-4 rounded-xl shadow-md"
                      onClick={() => setSelectedImage(`http://localhost:5000${url}`)}
                    >
                      <img
                        // Use the full URL with localhost for dev or backend server URL in production
                        src={`http://localhost:5000${url}`}
                        alt={`Post ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 col-span-full flex flex-col justify-center items-center gap-2">
                    <p className="text-xl lg:text-2xl">Share your moments now!!</p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-500 text-white w-fit px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                      Upload Post
                    </button>
                  </div>
                )}
              </div>

              {/* Upload Button Floating Top-Right */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute top-0 right-0 border-1 p-[7px] bg-white rounded-[10px] hover:bg-gray-100 transition"
              >
                <FaPlus />
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {selectedImage && (
            <div className="mt-10 fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-70 flex items-center justify-center z-50">
              <div className="relative max-w-3xl w-full p-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-0 text-white bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaTimes />
                </button>
                <button
                  onClick={() => handleDeleteImage(selectedImage)}
                  className="absolute top-14 right-0 text-white bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaTrash />
                </button>
                <img
                  src={selectedImage}
                  alt="Full View"
                  className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {selectedTab === "community" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">My Community</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.communities.length > 0 ? (
                  profile.communities.map((community, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-200 p-4 rounded-xl shadow-md flex items-center gap-4 cursor-pointer"
                    >
                      <img src={`http://localhost:5000/${community.avatar.replace(/\\/g, '/').replace('public/', '')}`} alt={community.name} className="w-16 h-16 rounded-full" />
                      <div>
                        <h4 className="text-lg font-semibold">{community.name}</h4>
                        <p className="text-gray-600">{community.sport}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 col-span-full flex flex-col justify-ceter items-center gap-2">
                    <p className="text-xl lg:text-2xl flex justify-center items-center gap-1">Explore Various Community <FaUsers /> </p>
                    <Link to='/community' className="bg-blue-500 text-white w-fit px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">Join Community</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {(selectedTab === "coaches" || selectedTab === "trainees") && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {profile.role === "Coach" ? "My Trainees" : "My Coaches"}
              </h3>

              {/* Determine the data list */}
              {(() => {
                const dataList = profile.role === "Coach" ? profile.players : profile.coaches;
                const isCoachTab = selectedTab === "coaches";

                if (dataList && dataList.length > 0) {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {dataList.map((person, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gray-200 p-4 rounded-xl shadow-md flex flex-col justify-start items-center gap-4 cursor-pointer"
                        >
                          <img
                            src={`http://localhost:5000/${person.profileId.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                            alt={person.name}
                            className="w-16 h-16 rounded-full border-1"
                          />
                          <div className="flex flex-col justify-center items-center">
                            <h4 className="text-lg font-semibold">{person.profileId.name}</h4>
                            <p className="text-gray-600">
                              {person.profileId.sports[0] || "No info"}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center bg-gray-100 p-10 rounded-xl shadow-inner">
                      <p className="text-gray-600 text-lg mb-4">
                        {isCoachTab ? "Explore Coaches" : "Mentor Players"}
                      </p>
                      <Link to='/coach'>
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md">
                          {isCoachTab ? "Hire Coach" : "Train Players"}
                        </button>
                      </Link>
                    </div>
                  );
                }
              })()}
            </div>
          )}



        </motion.div>

      </div>

      {showFollowListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm max-h-[80vh] shadow-xl p-5 relative overflow-y-auto rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-center">{followListTitle}</h3>
                <button
                    onClick={() => setShowFollowListModal(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>
                <div className="space-y-3 mt-4">
                    {followListData.length > 0 ? (
                        followListData.map((user) => (
                            <div
                                key={user.userId}
                                onClick={() => handleUserItemClick(user.userId)}
                                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                            >
                                <img
                                    src={`http://localhost:5000/${user.avatar.replace(/\\/g, '/').replace('public/', '')}`}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <p className="font-semibold text-gray-800">{user.name}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No users to display.</p>
                    )}
                </div>
            </div>
        </div>
      )}

      <ProfileViewModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={selectedUserIdForModal}
      />
    </div>
  );
};

export default ProfilePage;
