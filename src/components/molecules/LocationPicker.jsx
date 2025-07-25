import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const LocationPicker = ({ 
  onLocationSelect, 
  type = "pickup", 
  value,
  className = "" 
}) => {
  const [showSearch, setShowSearch] = useState(false);
  
  const mockSuggestions = [
    { name: "Current Location", address: "Use GPS to detect location", isCurrentLocation: true },
    { name: "Downtown Plaza", address: "123 Main Street, Downtown" },
    { name: "City Airport", address: "Airport Terminal, Gate A" },
    { name: "Central Mall", address: "456 Shopping District" },
    { name: "Business District", address: "789 Corporate Avenue" }
  ];

  const handleLocationSelect = (location) => {
    onLocationSelect?.(location);
    setShowSearch(false);
  };

  const getLocationIcon = () => {
    if (type === "pickup") return "MapPin";
    if (type === "destination") return "Flag";
    return "MapPin";
  };

  const getLocationColor = () => {
    if (type === "pickup") return "text-accent-600";
    if (type === "destination") return "text-secondary-600";
    return "text-primary-600";
  };

  const getLocationBg = () => {
    if (type === "pickup") return "bg-accent-100";
    if (type === "destination") return "bg-secondary-100";
    return "bg-primary-100";
  };

  if (showSearch) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`space-y-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Select {type === "pickup" ? "Pickup" : "Destination"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={() => setShowSearch(false)}
          />
        </div>
        
        <SearchBar
          placeholder={`Search ${type} location...`}
          suggestions={mockSuggestions}
          onLocationSelect={handleLocationSelect}
        />

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Recent Locations</h4>
          {mockSuggestions.slice(1, 4).map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="w-full p-3 text-left bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors flex items-center space-x-3"
            >
              <div className={`w-8 h-8 ${getLocationBg()} rounded-full flex items-center justify-center`}>
                <ApperIcon name="Clock" size={16} className={getLocationColor()} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {location.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {location.address}
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={() => setShowSearch(true)}
      className={`w-full p-4 text-left bg-white border-2 border-dashed border-surface-300 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${getLocationBg()} rounded-full flex items-center justify-center`}>
          <ApperIcon name={getLocationIcon()} size={20} className={getLocationColor()} />
        </div>
        <div className="flex-1 min-w-0">
          {value ? (
            <>
              <div className="font-medium text-gray-900 truncate">
                {value.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {value.address}
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              Select {type === "pickup" ? "pickup" : "destination"} location
            </div>
          )}
        </div>
        <ApperIcon name="ChevronRight" size={20} className="text-gray-400" />
      </div>
    </button>
  );
};

export default LocationPicker;