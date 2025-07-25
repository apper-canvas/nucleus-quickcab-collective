import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import MapView from "@/components/organisms/MapView";
import BookingFlow from "@/components/organisms/BookingFlow";
import ActiveRideTracker from "@/components/organisms/ActiveRideTracker";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const HomePage = () => {
  const navigate = useNavigate();
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Simulate getting user's current location
    const timer = setTimeout(() => {
      setUserLocation({
        name: "Current Location",
        address: "123 Main Street, Downtown",
        coordinates: { lat: 40.7128, lng: -74.0060 }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBookingComplete = (booking) => {
    setActiveBooking(booking);
    setShowBookingFlow(false);
    setPickupLocation(booking.pickupLocation);
    setDropLocation(booking.dropLocation);
  };

  const handleRideComplete = () => {
    toast.success("Ride completed successfully!");
    setActiveBooking(null);
    setPickupLocation(null);
    setDropLocation(null);
    navigate("/payments");
  };

  const handleCancelRide = () => {
    setActiveBooking(null);
    setPickupLocation(null);
    setDropLocation(null);
  };

  const quickActions = [
    {
      icon: "Home",
      label: "Home",
      description: "123 Main St",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      icon: "Briefcase",
      label: "Work",
      description: "456 Office Blvd",
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      icon: "MapPin",
      label: "Airport",
      description: "Terminal A",
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      icon: "ShoppingBag",
      label: "Mall",
      description: "Central Plaza",
      color: "text-orange-600",
      bg: "bg-orange-100"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-surface-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 font-display">QuickCab</h1>
            <p className="text-sm text-gray-600">
              {userLocation ? "Ready to go!" : "Getting location..."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center hover:bg-surface-200 transition-colors">
            <ApperIcon name="Bell" size={20} className="text-gray-600" />
          </button>
          <button className="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center hover:bg-surface-200 transition-colors">
            <ApperIcon name="User" size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Map */}
        <MapView
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
          driverLocation={activeBooking ? { lat: 40.7130, lng: -74.0058 } : null}
          className="absolute inset-0"
        />

        {/* Floating Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-4">
          {/* Active Ride */}
          {activeBooking && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="slide-up"
            >
              <ActiveRideTracker
                booking={activeBooking}
                onRideComplete={handleRideComplete}
                onCancelRide={handleCancelRide}
              />
            </motion.div>
          )}

          {/* Booking Flow */}
          {showBookingFlow && !activeBooking && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="slide-up"
            >
              <BookingFlow
                onBookingComplete={handleBookingComplete}
              />
              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowBookingFlow(false)}
                  icon="X"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          {!showBookingFlow && !activeBooking && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fade-in"
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 font-display">
                    Where would you like to go?
                  </h2>
                  <Badge variant="success" size="sm">
                    <ApperIcon name="Zap" size={12} className="mr-1" />
                    Online
                  </Badge>
                </div>

                <Button
                  onClick={() => setShowBookingFlow(true)}
                  className="w-full mb-4"
                  icon="Navigation"
                >
                  Book a Ride
                </Button>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Quick destinations</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowBookingFlow(true)}
                        className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors text-left"
                      >
                        <div className={`w-8 h-8 ${action.bg} rounded-full flex items-center justify-center`}>
                          <ApperIcon name={action.icon} size={16} className={action.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {action.label}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {action.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;