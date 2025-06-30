import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../../utils/axios';

const ProfileViewModal = ({ isOpen, onClose, userId }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [currentUserId] = useState(localStorage.getItem('userId'));

    // Helper to fix avatar path
    const getAvatar = (avatar) => {
        if (!avatar) {
            return '/assets/images/testinomial1.jpg';
        }
        const path = avatar.replace(/\\/g, '/').replace('public/', '');
        return `http://localhost:5000/${path}`;
    };

    // Fetch profile data
    useEffect(() => {
        if (isOpen && userId) {
            fetchProfile();
        }
    }, [isOpen, userId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/users/profile/${userId}`);
            setProfile(res.data);

            // Check if current user is following this profile
            const currentUserProfile = JSON.parse(localStorage.getItem('profile'));
            const isCurrentlyFollowing = currentUserProfile?.following?.some(
                following => following.userId === userId
            );
            setIsFollowing(isCurrentlyFollowing);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (userId === currentUserId) return;

        setFollowLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/users/profile/connect', {
                targetUserId: userId
            },{
                headers: {
                  'Authorization': `Bearer ${token}`
                },
              });

            setIsFollowing(!isFollowing);

            // Update local profile data
            const currentProfile = JSON.parse(localStorage.getItem('profile'));
            if (isFollowing) {
                // Unfollowed - remove from following
                currentProfile.following = currentProfile.following.filter(
                    following => following.userId !== userId
                );
            } else {
                // Followed - add to following
                if (!currentProfile.following) currentProfile.following = [];
                currentProfile.following.push({
                    userId: userId,
                    name: profile.name,
                    avatar: profile.avatar
                });
            }
            localStorage.setItem('profile', JSON.stringify(currentProfile));

        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setFollowLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="mt-15 bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Profile</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                        >
                            x
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Loading profile...</p>
                            </div>
                        ) : profile ? (
                            <div className="space-y-5">
                                {/* Avatar and Name */}
                                <div className="flex items-center justify-start gap-5">
                                    <img
                                        src={getAvatar(profile.avatar)}
                                        alt={profile.name}
                                        className="w-24 h-24 rounded-full border-3 border-blue-400 object-cover shadow-lg"
                                    />
                                    <div className='flex flex-col items-start justify-start'>
                                        <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
                                        <div className='flex gap-4'>
                                            <div className='flex flex-col items-center'>
                                                <span>Followers</span>
                                                <p>{profile.followers.length}</p>
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <span>Following</span>
                                                <p>{profile.following.length}</p>
                                            </div>
                                        </div>                                
                                    </div>
                                </div>

                                {/* Bio */}
                                {profile.bio && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Bio</h4>
                                        <p className="text-gray-600 text-sm">{profile.bio}</p>
                                    </div>
                                )}

                                {/* Sports */}
                                {profile.sports && profile.sports.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Sports</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.sports.map((sport, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {sport}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                {profile.location && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Location</h4>
                                        <p className="text-gray-600 text-sm">{profile.location}</p>
                                    </div>
                                )}

                                {/* Experience (for coaches) */}
                                {profile.role === 'Coach' && profile.experience && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Experience</h4>
                                        <p className="text-gray-600 text-sm">{profile.experience} years</p>
                                    </div>
                                )}

                                {/* Fees (for coaches) */}
                                {profile.role === 'Coach' && profile.fees && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">Fees</h4>
                                        <p className="text-gray-600 text-sm">₹{profile.fees}/session</p>
                                    </div>
                                )}

                                {/* Follow/Unfollow Button */}
                                {userId !== currentUserId && (
                                    <div className="pt-4">
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={followLoading}
                                            className={`mb-2 w-full py-3 px-4 rounded-lg font-semibold transition-colors ${isFollowing
                                                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                                } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {followLoading ? (
                                                <span className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                                    {isFollowing ? 'Unfollowing...' : 'Following...'}
                                                </span>
                                            ) : (
                                                isFollowing ? 'Unfollow' : 'Follow'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Profile not found</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileViewModal; 