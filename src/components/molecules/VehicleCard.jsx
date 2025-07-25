import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const VehicleCard = ({ 
  vehicle, 
  selected = false, 
  onSelect,
  className = "" 
}) => {
  const getVehicleIcon = (type) => {
    switch (type) {
      case "economy": return "Car";
      case "premium": return "Car";
      case "suv": return "Truck";
      default: return "Car";
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case "economy": return "text-green-600";
      case "premium": return "text-purple-600";
      case "suv": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getVehicleBg = (type) => {
    switch (type) {
      case "economy": return "bg-green-100";
      case "premium": return "bg-purple-100";
      case "suv": return "bg-blue-100";
      default: return "bg-gray-100";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card
        className={`cursor-pointer transition-all duration-200 ${
          selected 
            ? "ring-2 ring-primary-500 shadow-lg bg-primary-50" 
            : "hover:shadow-md"
        }`}
        onClick={() => onSelect?.(vehicle)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${getVehicleBg(vehicle.type)} rounded-xl flex items-center justify-center`}>
              <ApperIcon 
                name={getVehicleIcon(vehicle.type)} 
                size={24} 
                className={getVehicleColor(vehicle.type)} 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                {vehicle.isPopular && (
                  <Badge variant="secondary" size="sm">
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{vehicle.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <ApperIcon name="Clock" size={14} />
                  <span>{vehicle.eta} min</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <ApperIcon name="Users" size={14} />
                  <span>{vehicle.capacity} seats</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              ${vehicle.price.toFixed(2)}
            </div>
            {vehicle.originalPrice && vehicle.originalPrice > vehicle.price && (
              <div className="text-sm text-gray-500 line-through">
                ${vehicle.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;