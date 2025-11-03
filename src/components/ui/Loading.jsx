import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "restaurants") {
    return (
      <div className="space-y-6">
        {/* Cuisine filters skeleton */}
        <div className="flex gap-3 overflow-hidden px-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-chip flex-shrink-0"
            />
          ))}
        </div>

        {/* Restaurant cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-card shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-1/2" />
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-16" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "menu") {
    return (
      <div className="space-y-6">
        {/* Restaurant header skeleton */}
        <div className="px-4">
          <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-card mb-4" />
          <div className="space-y-2">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-3/4" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-1/2" />
          </div>
        </div>

        {/* Menu items skeleton */}
        <div className="space-y-4 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-full" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded w-1/3" />
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/30 rounded-full animate-spin border-t-primary"></div>
        </div>
        <p className="text-gray-600 text-sm">Loading delicious food...</p>
      </motion.div>
    </div>
  );
};

export default Loading;