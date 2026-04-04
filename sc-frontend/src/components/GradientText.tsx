import type { CSSProperties } from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  style?: CSSProperties;
}

const DEFAULT_GRADIENT = "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #0000FF, #8000FF)";

export default function GradientText({
  children,
  className = "",
  gradient = DEFAULT_GRADIENT,
  style,
}: GradientTextProps) {
  return (
    <span
      className={`font-sans ${className}`}
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
