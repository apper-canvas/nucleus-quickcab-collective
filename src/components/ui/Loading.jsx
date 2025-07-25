import { motion } from "framer-motion";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "map") {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <div className="w-8 h-8 bg-white rounded-full" />
            </div>
            <div className="text-primary-700 font-medium">Loading map...</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "bookings") {
    return (
      <div className={`space-y-4 p-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-surface-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-surface-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-surface-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="w-16 h-8 bg-surface-200 rounded-full animate-pulse" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="h-3 bg-surface-200 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-surface-200 rounded animate-pulse w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "driver") {
    return (
      <div className={`bg-white rounded-xl p-4 shadow-lg border border-surface-200 ${className}`}>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-surface-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-surface-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-surface-200 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-surface-200 rounded animate-pulse w-3/4" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-surface-200 rounded animate-pulse w-1/3" />
          <div className="h-10 bg-surface-200 rounded-lg animate-pulse w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;