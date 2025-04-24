<div className="w-full px-2 font-roboto md:hidden">
        <div className="p-4 mt-2 mx-auto bg-gray-100 rounded-xl shadow-lg">
          {/* Profile Header */}
          <motion.div
            className="flex justify-start items-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <motion.img
                src="/assets/images/testinomial1.jpg"
                alt="Profile Pic"
                className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-md"
                whileHover={{ scale: 1.05 }}
              />
              <h3 className="text-lg font-bold mt-2">{profile.name}</h3>
            </div>

            <div className="flex gap-4 text-center">
              {["Posts", "Followers", "Following"].map((item, index) => (
                <motion.button
                  key={index}
                  className="flex flex-col text-gray-700 font-semibold mb-9 ml-5"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-lg font-bold">{Math.floor(Math.random() * 1000)}</p>
                  <h3 className="text-sm">{item}</h3>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            className="text-sm mt-3 text-gray-600 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="font-semibold">🏆 Passionate Sports Enthusiast</p>
            <p>🏠 Location: New York, USA</p>
            <p>⚽ Sport: Football</p>
            <p>📅 Experience: {Math.floor(Math.random() * 15)} years</p>
          </motion.div>

          {/* Edit Profile Button */}
          <motion.button
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit Profile
          </motion.button>



          {/* Posts Section */}
          <div className="p-3 mt-4 rounded-md bg-white shadow-md">
            <h3 className="text-lg font-semibold pb-2 border-b border-gray-300">Posts</h3>

            {/* Masonry Image Grid */}
            <motion.div
              className="grid grid-cols-3 gap-2 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {[
                "/assets/images/EventCricket.jpg",
                "/assets/images/EventFootball.webp",
                "/assets/images/EventCricket.jpg",
                "/assets/images/EventFootball.webp",
                "/assets/images/EventCricket.jpg",
                "/assets/images/EventFootball.webp",
                "/assets/images/EventCricket.jpg",
                "/assets/images/EventFootball.webp",
                "/assets/images/EventCricket.jpg",
              ].map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt={`Post ${index}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                  whileHover={{ scale: 1.05 }}
                />
              ))}
            </motion.div>

            {/* See All Posts Button */}
            <motion.button
              className="mt-3 w-full py-2 border border-gray-400 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See All Posts
            </motion.button>
            {/* Joined Communities Section */}
            <div className="p-3 mt-4 rounded-md bg-white shadow-md">
              <h3 className="text-lg font-semibold pb-2 border-b border-gray-300">Joined Communities</h3>

              <motion.div
                className="grid grid-cols-2 gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {["Cricket Club", "Football League", "Basketball Squad", "Chess Masters"].map((community, index) => (
                  <motion.div
                    key={index}
                    className="p-2 bg-gray-200 rounded-lg text-center font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    {community}
                  </motion.div>
                ))}

              </motion.div>
              <motion.button
                className="mt-3 py-2 w-full border border-gray-400 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See All
              </motion.button>
            </div>

            {/* Coaches/Players Section */}
            <div className="p-3 mt-4 rounded-md bg-white shadow-md">
              <h3 className="text-lg font-semibold pb-2 border-b border-gray-300">
                {isCoach ? "Players" : "Coaches"}
              </h3>

              <motion.div
                className="grid grid-cols-2 gap-2 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {["Michael Smith", "Emma Johnson", "David Lee", "Sophia Brown"].map((person, index) => (
                  <motion.div
                    key={index}
                    className="p-2 bg-gray-200 rounded-lg text-center font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    {person}
                  </motion.div>
                ))}

              </motion.div>
              <motion.button
                className="mt-3 w-full py-2 border border-gray-400 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See All
              </motion.button>

            </div>

          </div>
          {/* Logout Button at Bottom */}
          <motion.button
            className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlelogout}
          >
            <FiLogOut className="inline-block mr-2" />
            Logout
          </motion.button>

        </div>
      </div>