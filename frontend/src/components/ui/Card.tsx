import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-lg bg-white";

  const variantStyles = {
    default: "shadow-md",
    elevated: "shadow-md transition-shadow hover:shadow-lg",
    outlined: "border border-gray-200",
  };

  const paddingStyles = {
    sm: "p-4",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
  };

  const responsiveRounded = variant !== "outlined" ? "md:rounded-xl" : "";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${responsiveRounded} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
