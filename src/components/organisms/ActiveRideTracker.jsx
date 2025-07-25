import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import DriverCard from "@/components/molecules/DriverCard";
import ApperIcon from "@/components/ApperIcon";

const ActiveRideTracker = ({ booking, onRideComplete, onCancelRide, className = "" }) => {
  const [rideStatus, setRideStatus] = useState(booking?.status || "searching");
  const [driver, setDriver] = useState(null);
  const [eta, setEta] = useState(booking?.vehicle?.eta || 5);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (rideStatus === "searching") {
      // Simulate driver matching
      const timer = setTimeout(() => {
        const mockDriver = {
          id: "driver-1",
          name: "Alex Johnson",
          photo: "/api/placeholder/64/64",
          rating: 4.8,
          totalRides: 1247,
          phone: "+1 (555) 123-4567",
          vehicle: {
            make: "Toyota",
            model: "Camry",
            licensePlate: "ABC-123"
          },
          eta: 3,
          distance: 0.8
        };
        
        setDriver(mockDriver);
        setRideStatus("driver_assigned");
        setEta(3);
        toast.success("Driver found! Alex is on the way.");
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (rideStatus === "driver_assigned") {
      // Simulate driver arrival countdown
      const interval = setInterval(() => {
        setEta(prev => {
          if (prev <= 1) {
            setRideStatus("driver_arrived");
            toast.info("Your driver has arrived!");
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [rideStatus]);

  const getStatusConfig = () => {
    switch (rideStatus) {
      case "searching":
        return {
          title: "Finding Your Driver",
          description: "We're matching you with the best driver nearby",
          icon: "Search",
          color: "text-blue-600",
          bg: "bg-blue-100"
        };
      case "driver_assigned":
        return {
          title: "Driver On The Way",
          description: `${driver?.name} is coming to pick you up`,
          icon: "Navigation",
          color: "text-orange-600",
          bg: "bg-orange-100"
        };
      case "driver_arrived":
        return {
          title: "Driver Arrived",
          description: "Your driver is waiting at the pickup location",
          icon: "CheckCircle",
          color: "text-green-600",
          bg: "bg-green-100"
        };
      case "in_ride":
        return {
          title: "On Your Way",
          description: "Enjoy your ride to the destination",
          icon: "Car",
          color: "text-purple-600",
          bg: "bg-purple-100"
        };
      default:
        return {
          title: "Processing",
          description: "Please wait...",
          icon: "Clock",
          color: "text-gray-600",
          bg: "bg-gray-100"
        };
    }
  };

  const handleCancelRide = () => {
    const timeElapsed = 5; // Mock time elapsed in minutes
    const isFreeCancel = timeElapsed <= 15;
    
    if (!isFreeCancel) {
      setShowCancelDialog(true);
      return;
    }
    
    onCancelRide?.();
    toast.success("Ride cancelled successfully");
  };

  const confirmCancellation = () => {
    onCancelRide?.();
    toast.success("Ride cancelled. Cancellation fee applied.");
    setShowCancelDialog(false);
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Header */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 ${statusConfig.bg} rounded-full flex items-center justify-center`}>
            <ApperIcon name={statusConfig.icon} size={24} className={statusConfig.color} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 font-display">
              {statusConfig.title}
            </h2>
            <p className="text-gray-600">{statusConfig.description}</p>
          </div>
          {rideStatus === "searching" && (
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          )}
        </div>

        {eta > 0 && rideStatus !== "in_ride" && (
          <div className="flex items-center justify-between bg-surface-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Estimated arrival</span>
            </div>
            <Badge variant="primary" size="sm">
              {eta} min{eta !== 1 ? "s" : ""}
            </Badge>
          </div>
        )}
      </Card>

      {/* Driver Information */}
      {driver && rideStatus !== "searching" && (
        <DriverCard driver={driver} />
      )}

      {/* Trip Details */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Trip Details</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent-100 rounded-full flex items-center justify-center mt-0.5">
              <ApperIcon name="MapPin" size={12} className="text-accent-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500">Pickup</div>
              <div className="font-medium text-gray-900 truncate">
                {booking?.pickupLocation?.name}
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center mt-0.5">
              <ApperIcon name="Flag" size={12} className="text-secondary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500">Destination</div>
              <div className="font-medium text-gray-900 truncate">
                {booking?.dropLocation?.name}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200">
          <div className="text-sm text-gray-600">Estimated fare</div>
          <div className="text-lg font-bold text-gray-900">
            ${booking?.fare?.toFixed(2)}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {rideStatus === "driver_arrived" && (
          <Button
            onClick={() => setRideStatus("in_ride")}
            className="flex-1"
            icon="Car"
          >
            Start Ride
          </Button>
        )}
        
        {rideStatus === "in_ride" && (
          <Button
            onClick={onRideComplete}
            variant="success"
            className="flex-1"
            icon="CheckCircle"
          >
            Complete Ride
          </Button>
        )}
        
        {rideStatus !== "in_ride" && (
          <Button
            onClick={handleCancelRide}
            variant="outline"
            className="flex-1"
            icon="X"
          >
            Cancel Ride
          </Button>
        )}
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-sm w-full"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Cancel Ride?</h3>
                <p className="text-sm text-gray-600">Cancellation fee will apply</p>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-red-700">
                Since it's been more than 15 minutes, a cancellation fee of $3.50 will be charged.
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="flex-1"
              >
                Keep Ride
              </Button>
              <Button
                variant="danger"
                onClick={confirmCancellation}
                className="flex-1"
              >
                Cancel & Pay
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ActiveRideTracker;