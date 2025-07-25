import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const BottomNavigation = ({ className = "" }) => {
  const location = useLocation();
  
  const navItems = [
    {
      path: "/",
      icon: "Home",
      label: "Home",
      activeColor: "text-primary-600"
    },
    {
      path: "/bookings",
      icon: "Calendar",
      label: "Bookings",
      activeColor: "text-secondary-600"
    },
    {
      path: "/history",
      icon: "Clock",
      label: "History",
      activeColor: "text-accent-600"
    },
    {
      path: "/payments",
      icon: "CreditCard",
      label: "Payments",
      activeColor: "text-purple-600"
    }
  ];

  return (
    <div className={`bg-white border-t border-surface-200 ${className}`}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center p-3 min-w-[60px]"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-x-0 top-0 h-0.5 bg-primary-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                      isActive ? item.activeColor : "text-gray-500"
                    }`}
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={24} 
                      className={isActive ? "fill-current" : ""} 
                    />
                    <span className="text-xs font-medium">
                      {item.label}
                    </span>
                  </motion.div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;