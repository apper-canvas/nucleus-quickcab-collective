import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  type = "default",
  className = "" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "map":
        return {
          icon: "MapPin",
          title: "Map Unavailable",
          description: "Unable to load the map. Please check your connection and try again."
        };
      case "booking":
        return {
          icon: "Car",
          title: "Booking Failed",
          description: "We couldn't process your booking. Please try again."
        };
      case "driver":
        return {
          icon: "UserX",
          title: "Driver Not Found",
          description: "No drivers available in your area right now."
        };
      case "payment":
        return {
          icon: "CreditCard",
          title: "Payment Error",
          description: "Payment processing failed. Please check your payment method."
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Oops!",
          description: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={errorContent.icon} size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {errorContent.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm">
        {errorContent.description}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;