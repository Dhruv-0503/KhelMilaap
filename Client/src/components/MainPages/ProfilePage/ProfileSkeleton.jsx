import React from 'react'

const ProfileSkeleton = () => {
  return (
    <>
        <div className="min-h-screen px-4 py-6 lg:px-16 lg:py-10 font-roboto hidden sm:block animate-pulse">
          {/* Profile Header Skeleton */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center md:flex-row md:text-left">
              <div className="w-24 h-24 rounded-full bg-gray-300" />
              <div className="md:ml-6 space-y-2">
                <div className="h-6 w-40 bg-gray-300 rounded"></div>
              </div>
              <div className="gap-10 flex md:ml-20">
                <div className="flex flex-col items-center justify-center md:p-3 md:text-xl border-2 rounded-xl border-gray-200 shadow-sm">
                  <div className="h-6 w-24 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                </div>
                <div className="flex flex-col items-center justify-center md:p-3 md:text-xl border-2 rounded-xl border-gray-200 shadow-sm">
                  <div className="h-6 w-24 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-10 w-28 bg-gray-300 rounded-md"></div>
          </div>

          {/* Body Skeleton */}
          <div className="mt-6 gap-2 flex flex-col md:flex-row">
            {/* Sidebar Skeleton */}
            <div className="flex md:flex-col gap-4 md:w-1/4 bg-white p-4 rounded-xl shadow-md">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded w-full"></div>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="mt-6 md:mt-0 md:w-3/4 p-6 bg-white rounded-xl shadow-md space-y-6">
              {/* Section Title */}
              <div className="h-6 w-32 bg-gray-300 rounded"></div>

              {/* Bio Info */}
              <div className="space-y-2">
                <div className="h-4 w-60 bg-gray-300 rounded"></div>
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
                <div className="h-4 w-48 bg-gray-300 rounded"></div>
              </div>

              {/* Achievements */}
              <div>
                <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-300 rounded-xl"></div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="flex gap-5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-gray-300"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-2 font-roboto sm:hidden animate-pulse">
          <div className="p-4 mt-2 mx-auto bg-gray-100 rounded-xl shadow-lg">

            {/* Profile Header Skeleton */}
            <div className="flex justify-start items-center gap-6">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded mt-2 w-24 mx-auto"></div>
              </div>

              <div className="flex gap-4 text-center">
                {Array(3).fill().map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-4 bg-gray-300 rounded"></div>
                    <div className="w-16 h-3 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio Info Skeleton */}
            <div className="mt-4 space-y-2">
              {Array(4).fill().map((_, i) => (
                <div key={i} className="h-3 bg-gray-300 rounded w-3/4"></div>
              ))}
            </div>

            {/* Edit Profile Button Skeleton */}
            <div className="mt-4 w-full h-10 bg-gray-300 rounded"></div>

            {/* Posts Section Skeleton */}
            <div className="p-3 mt-4 rounded-md bg-white shadow-md">
              <div className="w-32 h-4 bg-gray-300 rounded mb-3"></div>
              <div className="grid grid-cols-3 gap-2">
                {Array(9).fill().map((_, i) => (
                  <div key={i} className="w-full h-24 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="mt-3 w-full h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Joined Communities Skeleton */}
            <div className="p-3 mt-4 rounded-md bg-white shadow-md">
              <div className="w-40 h-4 bg-gray-300 rounded mb-3"></div>
              <div className="grid grid-cols-2 gap-2">
                {Array(4).fill().map((_, i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="mt-3 w-full h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Coaches/Players Skeleton */}
            <div className="p-3 mt-4 rounded-md bg-white shadow-md">
              <div className="w-40 h-4 bg-gray-300 rounded mb-3"></div>
              <div className="grid grid-cols-2 gap-2">
                {Array(4).fill().map((_, i) => (
                  <div key={i} className="h-10 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="mt-3 w-full h-10 bg-gray-300 rounded"></div>
            </div>

            {/* Logout Button Skeleton */}
            <div className="mt-6 w-full h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </>
  )
}

export default ProfileSkeleton