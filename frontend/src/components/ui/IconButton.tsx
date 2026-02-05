import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary";
}

export default function IconButton({
  icon: Icon,
  size = "md",
  variant = "default",
  className = "",
  ...props
}: IconButtonProps) {
  const baseStyles = "transition-colors";

  const variantStyles = {
    default: "text-gray-400 hover:text-gray-600",
    primary: "text-blue-600 hover:text-blue-700",
  };

  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <Icon size={sizeMap[size]} />
    </button>
  );
}
