import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

interface LinkButtonProps extends Omit<LinkProps, "className"> {
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

export default function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: LinkButtonProps) {
  const baseStyles =
    "inline-block rounded-lg font-medium transition-colors text-center";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm md:px-4 md:py-2",
    md: "px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base",
    lg: "px-6 py-3 text-base md:px-8 md:py-4 md:text-lg",
  };

  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
