"use client";

import React, { useEffect } from "react";
import { Overlay } from "./Overlay";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onClose} className="z-[998]">
      {/* PC 사이즈 - 가운데 정렬 */}
      <div className="hidden md:flex fixed inset-0 items-center justify-center p-3 lg:p-4">
        <div
          className={`bg-white rounded-lg shadow-lg max-w-xl lg:max-w-2xl w-full max-h-[85vh] lg:max-h-[90vh] overflow-auto transform transition-all duration-300 scale-100 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>

      {/* Mobile 사이즈 - 하단에서 올라오는 모달 */}
      <div className="md:hidden fixed inset-x-0 bottom-0">
        <div
          className={`bg-white rounded-t-lg shadow-lg w-full max-h-[85vh] overflow-auto transform transition-all duration-300 translate-y-0 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Overlay>
  );
};
