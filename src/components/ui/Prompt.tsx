"use client";

import React from "react";
import { Overlay } from "./Overlay";

interface PromptProps {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const Prompt: React.FC<PromptProps> = ({
  isOpen,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
  onClose,
  onCancel,
  onConfirm,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} className="z-[999]">
      <div className="fixed inset-0 flex items-center justify-center p-3 md:p-4">
        <div
          className="bg-white rounded-lg shadow-lg max-w-xs md:max-w-sm w-full mx-2 md:mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                {description}
              </p>
            )}
            <div className="flex justify-end space-x-2 md:space-x-3">
              <button
                onClick={handleCancel}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
};
