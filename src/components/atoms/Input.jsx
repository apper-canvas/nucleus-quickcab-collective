import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  className,
  type = "text",
  label,
  error,
  icon,
  iconPosition = "left",
  placeholder,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={18} />
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            "block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-200",
            "focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={18} />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;