import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const DriverCard = ({ 
  driver, 
  showCallButton = true,
  className = "" 
}) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-yellow-600";
    return "text-red-600";
  };

  const handleCall = () => {
    // In a real app, this would initiate a call
    toast.success(`Calling ${driver.name} at ${driver.phone}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card variant="elevated" className="slide-up">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <img
              src={driver.photo || "/api/placeholder/64/64"}
              alt={driver.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{driver.name}</h3>
              {driver.rating >= 4.5 && (
                <Badge variant="success" size="sm">
                  Top Rated
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-1 mb-2">
              <ApperIcon name="Star" size={16} className={getRatingColor(driver.rating)} fill="currentColor" />
              <span className="text-sm font-medium text-gray-700">
                {driver.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({driver.totalRides} rides)
              </span>
            </div>
            
<div className="text-sm text-gray-600">
              {driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model} • {driver.vehicle.licensePlate}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Navigation" size={16} className="text-blue-500" />
              <span>{driver.eta} min away</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="MapPin" size={16} className="text-gray-400" />
              <span>{driver.distance} km</span>
            </div>
          </div>
          
          {showCallButton && (
            <Button
              variant="outline"
              size="sm"
              icon="Phone"
              onClick={handleCall}
            >
              Call
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DriverCard;