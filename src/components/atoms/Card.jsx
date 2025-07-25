import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  variant = "default",
  padding = "default",
  hoverable = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl border transition-all duration-200";
  
  const variants = {
    default: "border-surface-200 shadow-sm",
    elevated: "border-surface-200 shadow-lg",
    outlined: "border-surface-300 shadow-none",
    glass: "bg-white/80 backdrop-blur-sm border-white/20 shadow-lg"
  };

  const paddings = {
    none: "",
    sm: "p-3",
    default: "p-4",
    lg: "p-6",
    xl: "p-8"
  };

  const hoverStyles = hoverable 
    ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer" 
    : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;