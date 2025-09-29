"use client";

import React from "react";

interface OverlayProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Overlay: React.FC<OverlayProps> = ({
  isOpen,
  onClick,
  className = "",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 transition-opacity duration-300 bg-black/50 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
