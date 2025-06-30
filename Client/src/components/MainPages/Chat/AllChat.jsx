import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import socketService from '../../../utils/socket';
import ProfileViewModal from '../ProfilePage/ProfileViewModal';
import { IoMdArrowRoundBack, IoMdAttach } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';

const sidebarTabs = [
  { label: 'Players' },
  { label: 'Coaches' },
  { label: 'Communities' },
];

const AllChat = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Chat state
  const [chatModel, setChatModel] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const chatAreaRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  // Initialize socket connection
  useEffect(() => {
    const socket = socketService.connect();

    if (socket) {
      socketService.onReceiveMessage((data) => {
        // Update the message list for the currently open chat
        if (data.chatId === currentChatId) {
          setMessages(prevMessages => [...prevMessages, data.message]);
        }
      });

      socketService.onUserTyping((data) => {
        if (data.chatId === currentChatId && data.userId !== currentUserId) {
          setIsTyping(true);
        }
      });

      socketService.onUserStopTyping((data) => {
        if (data.chatId === currentChatId && data.userId !== currentUserId) {
          setIsTyping(false);
        }
      });

      socketService.onError((error) => {
        console.error('Socket error:', error);
      });
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [currentChatId, currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, chatModel]);

  const getSearchPlaceholder = () => {
    const tabLabels = ['Player', 'Coach', 'Community'];
    return `Search ${tabLabels[activeTab]}..`;
  };

  const getAddButtonText = () => {
    const tabLabels = ['Players', 'Coaches', 'Communities'];
    return `Add ${tabLabels[activeTab]}`;
  };

  const handleAddButton = () => {
    if (activeTab === 0) {
      // Players - show modal
      setShowAddModal(true);
    } else if (activeTab === 1) {
      // Coaches - navigate
      navigate('/coach');
    } else if (activeTab === 2) {
      // Communities - navigate
      navigate('/community');
    }
  };

  const handleSearchPlayers = async () => {
    if (!addSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await axios.get('users/profile/searchPlayer', {
        params: { name: addSearchQuery },
      });
      setSearchResults(res.data.players);
      console.log(res.data.players);
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load existing messages for a chat
  const loadChatMessages = async (chatType, payload) => {
    try {
      const res = await axios.post('/messages/getmsg', {
        chatType,
        ...payload
      });

      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
        setCurrentChatId(res.data._id);
      } else {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
      setCurrentChatId(null);
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatUser) return;

    let messageData = {};
    const chatType = activeTab === 2 ? 'Community' : 'Personal';

    if (chatType === 'Personal') {
      messageData = {
        text: newMessage,
        chatType: 'Personal',
        receiverId: selectedChatUser.userId,
      };
    } else if (chatType === 'Community') {
      messageData = {
        text: newMessage,
        chatType: 'Community',
        communityId: selectedChatUser.userId, // This holds the communityId
      };
    }

    socketService.sendMessage(messageData);
    setNewMessage('');

    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    socketService.emitStopTyping(currentChatId);
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    socketService.emitTyping(currentChatId);

    const timeout = setTimeout(() => {
      socketService.emitStopTyping(currentChatId);
    }, 1000);

    setTypingTimeout(timeout);
  };

  // Handle chat click with user data
  const handleChatClick = async (item) => {
    // Player Chat
    if (activeTab === 0) {
      setSelectedChatUser(item);
      setChatModel(true);
      setMessages([]);
  
      socketService.joinChat({
        chatType: 'Personal',
        otherUserId: item.userId
      });
  
      await loadChatMessages('Personal', { sender: currentUserId, receiver: item.userId });
    
    // Community Chat
    } else if (activeTab === 2) {
      const communityDetails = {
        userId: item._id, // Using _id for state consistency
        name: item.name || 'Community',
        avatar: item.avatar,
      };
      setSelectedChatUser(communityDetails);
      setChatModel(true);
      setMessages([]);

      socketService.joinChat({
        chatType: 'Community',
        communityId: item._id
      });
      
      await loadChatMessages('Community', { communityId: item._id });
    }
  };

  // Handle back button
  const handleBackClick = () => {
    setChatModel(false);
    setSelectedChatUser(null);
    setMessages([]);
    setCurrentChatId(null);
    setIsTyping(false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  };

  // Get the list for the current tab
  let list = [];
  if (profile) {
    if (activeTab === 0) {
      // Combine followers and following, deduplicate by userId
      const combined = [...(profile.followers || []), ...(profile.following || [])];
      const seen = new Set();
      list = combined.filter(item => {
        if (!item.userId || seen.has(item.userId)) return false;
        seen.add(item.userId);
        return true;
      });
    } else if (activeTab === 1) {
      list = (profile.coaches || []).map(c => c.profileId);
    } else if (activeTab === 2) {
      list = profile.communities || [];
    }
  }

  // Filter by search query
  const filteredList = list.filter(item => {
    // Prevent crash if an item in the list is null
    if (!item) return false; 
    const name = item?.name || item?.title || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Helper to fix avatar path
  const getAvatar = (avatar) => {
    if (!avatar) {
      return '/assets/images/testinomial1.jpg'; // Keep local fallback for default
    }
    const path = avatar.replace(/\\/g, '/').replace('public/', '');
    return `http://localhost:5000/${path}`;
  };

  return (
    <div className="font-roboto min-h-[calc(100vh-80px)] p-0 flex flex-col md:flex-row">
      <div className="w-full h-full flex flex-col md:flex-row border border-gray-200 bg-gray-100" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <div className="flex md:flex-col flex-row md:w-1/4 w-full md:max-w-xs border-b md:border-b-0 md:border-r border-gray-200 bg-white">
          {sidebarTabs.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 md:flex-none py-4 px-4 font-bold border-b-2 border-gray-400 md:border-b-0 text-center flex items-center justify-center transition-all duration-200
                ${activeTab === idx
                  ? 'bg-blue-100 text-blue-900 border-blue-300 shadow'
                  : 'bg-white text-gray-800 hover:bg-blue-50'}
              `}
              style={{ outline: 'none', borderRadius: 0 }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat List */}
        <div className="flex-1 flex flex-col py-2 px-2 md:px-6 max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-80px)] md:border-l overflow-y-auto custom-scrollbar shadow">
          <h2 className="hidden md:block text-2xl font-extrabold text-gray-800 mb-2 tracking-wide border-b border-gray-400 pb-1">Chats</h2>

          {chatModel ? (
            <div className='border h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]'>
              {/* Chat Header */}
              <div className='flex gap-2 items-center justify-start bg-blue-100 border-b border-gray-500 px-2 py-1'>
                <button
                  onClick={handleBackClick}
                  className="p-1 hover:bg-blue-200 rounded transition-colors"
                  aria-label="Back to chat list"
                >
                  <IoMdArrowRoundBack className='text-xl hover:scale-110 transition-transform' />
                </button>
                <div className='flex items-center justify-start gap-2'>
                  <img
                    src={getAvatar(selectedChatUser?.avatar)}
                    alt={`${selectedChatUser?.name || 'User'} profile`}
                    className='w-10 h-10 rounded-full border-blue-400 border-2 object-cover'
                  />
                  <div>
                    <p className='font-semibold text-gray-800'>{selectedChatUser?.name || 'User'}</p>
                    <p className='text-gray-500 text-[14px]'>
                      {isTyping ? 'typing...' : `Last seen ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Area */}
              <div
                ref={chatAreaRef}
                className='flex-1 overflow-y-auto p-4 bg-gray-50'
                style={{ height: 'calc(100% - 120px)' }}
              >
                {messages.length === 0 ? (
                  <div className='flex justify-center items-center h-full'>
                    <div className='flex flex-col justify-center items-center'>
                      <span className='text-5xl text-blue-600 mb-4'>💬</span>
                      <span className='text-xl text-gray-700 font-medium'>Game On - Chat Now</span>
                      <span className='text-sm text-gray-500 mt-2'>Start a conversation with {selectedChatUser?.name || 'this user'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message, index) => {
                      let senderId = null;
                      if (message.sender && typeof message.sender === 'object') {
                        senderId = message.sender._id;
                      } else {
                        senderId = message.sender;
                      }
                      const isMe = senderId && senderId.toString() === currentUserId;

                      const isCommunityChat = activeTab === 2;

                      // In community chat, show name for other users if it's their first message in a sequence.
                      const showSenderName = isCommunityChat && !isMe && message.sender && (index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id);
                      
                      // In community chat, show avatar for other users.
                      const showAvatar = isCommunityChat && !isMe && message.sender;

                      return (
                        <div
                          key={message._id || message.id}
                          className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {showAvatar && (
                             <img 
                                src={getAvatar(message.sender?.avatar)} 
                                alt={message.sender?.name || 'User'} 
                                className='w-8 h-8 rounded-full mr-2 mb-1 border-2 border-gray-300' 
                             />
                          )}
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              isMe
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            {showSenderName && (
                              <p className="text-xs font-bold text-blue-700 mb-1">{message.sender?.name || 'Unknown User'}</p>
                            )}
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-500'}`}> 
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className='relative flex justify-start items-center gap-2 h-15 border-t border-gray-500 px-2 py-2 bg-white'>
                {showEmojiPicker && (
                  <div className='absolute bottom-16'>
                    <EmojiPicker 
                      onEmojiClick={(emojiObject) => setNewMessage(prev => prev + emojiObject.emoji)}
                      pickerStyle={{ width: '100%' }}
                    />
                  </div>
                )}
                <button 
                  className='text-2xl text-gray-600 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-100'
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  aria-label="Toggle emoji picker"
                >
                  <BsEmojiSmile />
                </button>
                <button 
                  className='text-2xl text-gray-600 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-100'
                  aria-label="Attach file"
                >
                  <IoMdAttach />
                </button>
                <input
                  type="text"
                  placeholder='Type Your Message'
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className='border border-gray-400 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  aria-label="Type your message"
                />
                <button
                  className='text-2xl text-gray-600 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-100'
                  aria-label="Voice message"
                >
                  <FaMicrophone />
                </button>
              </div>
            </div>
          ) : (
            <div>
              {!showAddModal ? (
                <>
                  <div className='flex items-center justify-between gap-2 mb-4'>
                    <input
                      type='text'
                      name='searchBox'
                      placeholder={getSearchPlaceholder()}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='border border-gray-400 p-2 w-2/3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                      onClick={handleAddButton}
                      className='border-1 border-blue-500 rounded p-2 w-1/3 bg-blue-500 text-white hover:bg-blue-600 transition-colors'
                    >
                      {getAddButtonText()}
                    </button>
                  </div>

                  {/* Player List with loading spinner */}
                  {activeTab === 0 && loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-600">Loading players...</p>
                    </div>
                  ) : (
                    filteredList.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg">No results found.</p>
                      </div>
                    ) : (
                      filteredList.map((item) => (
                        <button
                          onClick={() => handleChatClick(item)}
                          key={item.userId || item._id}
                          className="flex items-center gap-4 px-4 py-3 w-full hover:bg-blue-100 transition border-b border-gray-400 group focus:outline-none focus:bg-blue-50"
                          style={{ borderRadius: 0 }}
                        >
                          <img
                            src={getAvatar(item?.avatar)}
                            alt={`${item?.name || 'Chat'} profile`}
                            className="w-14 h-14 rounded-full border-3 border-blue-400 object-cover shadow"
                          />
                          <div className="flex flex-col items-start">
                            <p className="font-bold text-gray-800 text-lg transition">{item?.name || 'Untitled Chat'}</p>
                            <p className="text-gray-500 text-sm truncate max-w-xs">Click to view chat</p>
                          </div>
                        </button>
                      ))
                    )
                  )}
                </>
              ) : (
                /* Add Players Modal */
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Add New Players</h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <input
                      type='text'
                      placeholder="Search for players to add..."
                      value={addSearchQuery}
                      onChange={(e) => setAddSearchQuery(e.target.value)}
                      className='border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                      onClick={handleSearchPlayers}
                      className='border rounded p-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50'
                      disabled={isSearching}
                    >
                      {isSearching ? '...' : 'Search'}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {isSearching ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((player) => {
                        const currentUserId = localStorage.getItem('userId');
                        return (
                          <div key={player.userId} className="flex items-center justify-between p-3 border-b hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <img
                                src={getAvatar(player.avatar)}
                                alt={`${player.name} profile`}
                                className="w-12 h-12 border-3 border-blue-400 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-gray-800">{player.name}</p>
                                <p className="text-sm text-gray-500">{player.role}</p>
                              </div>
                            </div>
                            {player.userId === currentUserId ? (
                              <span className="text-gray-500 font-semibold px-4">You</span>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedUserId(player.userId);
                                  setShowProfileModal(true);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                              >
                                {player.isFollowing ? 'Unfollow' : 'View Profile'}
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="text-lg">Search for players to start chatting!</p>
                        <p className="text-sm mt-2">Results will appear here when you search</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Profile View Modal */}
      <ProfileViewModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default AllChat;