import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`
      bg-white/10
      backdrop-blur-lg
      rounded-2xl
      border border-white/10
      shadow-xl
      p-8
      ${className}
    `}
    style={{
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
    }}
  >
    {children}
  </div>
);

export default Card;