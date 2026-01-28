import type { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Section({
  spacing = "md",
  className = "",
  children,
  ...props
}: SectionProps) {
  const spacingStyles = {
    sm: "space-y-2 md:space-y-3",
    md: "space-y-4 md:space-y-6",
    lg: "space-y-6 md:space-y-8",
  };

  return (
    <section className={`${spacingStyles[spacing]} ${className}`} {...props}>
      {children}
    </section>
  );
}
