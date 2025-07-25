import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

const MapView = ({ 
  pickupLocation, 
  dropLocation, 
  driverLocation,
  onLocationSelect,
  className = "" 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (event) => {
    // In a real app, this would convert click coordinates to location
    const mockLocation = {
      name: "Selected Location",
      address: "Tap to set as pickup or destination",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    };
    onLocationSelect?.(mockLocation);
  };

  if (mapError) {
    return (
      <Error 
        type="map"
        onRetry={() => {
          setMapError(false);
          setMapLoaded(false);
        }}
        className={className}
      />
    );
  }

  if (!mapLoaded) {
    return <Loading type="map" className={className} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Map Background */}
      <div 
        className="map-container cursor-pointer"
        onClick={handleMapClick}
      >
        <div className="map-overlay" />
        
        {/* Mock Street Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Pickup Location Pin */}
        {pickupLocation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-full"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-accent-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <ApperIcon name="MapPin" size={20} className="text-white" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-lg border border-surface-200 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Pickup</div>
                <div className="text-xs text-gray-600">{pickupLocation.name}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Drop Location Pin */}
        {dropLocation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/4 right-1/3 transform -translate-x-1/2 -translate-y-full"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-secondary-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <ApperIcon name="Flag" size={20} className="text-white" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg shadow-lg border border-surface-200 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">Destination</div>
                <div className="text-xs text-gray-600">{dropLocation.name}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Driver Location (if active ride) */}
        {driverLocation && (
          <motion.div
            animate={{ 
              x: [0, 10, -5, 15, 0],
              y: [0, -5, 10, -8, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="w-14 h-14 bg-primary-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                <ApperIcon name="Car" size={24} className="text-white" />
              </div>
              {/* Pulse rings around driver */}
              <div className="absolute inset-0 rounded-full bg-primary-500 opacity-30 pulse-ring" />
              <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 pulse-ring" style={{ animationDelay: "0.5s" }} />
            </div>
          </motion.div>
        )}

        {/* Route Line (if both locations exist) */}
        {pickupLocation && dropLocation && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.line
              x1="33.33%"
              y1="33.33%"
              x2="66.66%"
              y2="25%"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-surface-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Plus" size={20} className="text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-surface-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Minus" size={20} className="text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-surface-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Navigation" size={20} className="text-gray-600" />
        </motion.button>
      </div>

      {/* Current Location Button */}
      <div className="absolute bottom-6 right-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
        >
          <ApperIcon name="Crosshair" size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default MapView;