import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  type = "default",
  onAction,
  actionLabel,
  className = "" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "bookings":
        return {
          icon: "Calendar",
          title: "No Bookings Yet",
          description: "You haven't made any bookings. Start by booking your first ride!",
          actionLabel: actionLabel || "Book a Ride",
          gradient: "from-blue-500 to-purple-600"
        };
      case "history":
        return {
          icon: "Clock",
          title: "No Ride History",
          description: "Your completed rides will appear here. Take your first ride to get started!",
          actionLabel: actionLabel || "Book Your First Ride",
          gradient: "from-green-500 to-teal-600"
        };
      case "payments":
        return {
          icon: "CreditCard",
          title: "No Payment Methods",
          description: "Add a payment method to book rides quickly and securely.",
          actionLabel: actionLabel || "Add Payment Method",
          gradient: "from-purple-500 to-pink-600"
        };
      case "monthly":
        return {
          icon: "Repeat",
          title: "No Monthly Bookings",
          description: "Set up recurring rides for your daily commute and save time.",
          actionLabel: actionLabel || "Create Monthly Booking",
          gradient: "from-orange-500 to-red-600"
        };
      case "drivers":
        return {
          icon: "Users",
          title: "No Drivers Nearby",
          description: "We couldn't find any drivers in your area. Try adjusting your pickup location.",
          actionLabel: actionLabel || "Refresh",
          gradient: "from-indigo-500 to-blue-600"
        };
      default:
        return {
          icon: "Search",
          title: "Nothing Here",
          description: "We couldn't find what you're looking for.",
          actionLabel: actionLabel || "Try Again",
          gradient: "from-gray-500 to-gray-600"
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className={`w-20 h-20 bg-gradient-to-r ${emptyContent.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
        <ApperIcon name={emptyContent.icon} size={40} className="text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">
        {emptyContent.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
        {emptyContent.description}
      </p>

      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`bg-gradient-to-r ${emptyContent.gradient} text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2`}
        >
          <ApperIcon name="Plus" size={18} />
          <span>{emptyContent.actionLabel}</span>
        </motion.button>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4 opacity-20">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </motion.div>
  );
};

export default Empty;