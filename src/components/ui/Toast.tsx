"use client";

import React, { useState, useEffect, useCallback } from "react";

import { ToastItem, ToastProps } from "@/lib/types/ui";

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 애니메이션을 위한 지연
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // 자동 제거 타이머
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300); // 애니메이션 완료 후 제거
    }, toast.duration || 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles =
      "px-3 py-2 md:px-4 md:py-3 rounded-lg shadow-lg mb-2 transition-all duration-300 transform break-words text-sm md:text-base";

    switch (toast.type) {
      case "success":
        return `${baseStyles} bg-green-500 text-white`;
      case "error":
        return `${baseStyles} bg-red-500 text-white`;
      case "warning":
        return `${baseStyles} bg-yellow-500 text-white`;
      case "info":
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  return (
    <div
      className={`${getToastStyles()} ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {toast.message}
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Toast 추가 함수를 전역으로 노출
  useEffect(() => {
    const addToast = (toast: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: ToastItem = {
        id,
        duration: 3000,
        type: "info",
        ...toast,
      };
      setToasts((prev) => [...prev, newToast]);
    };

    // 전역 함수로 등록
    (window as any).showToast = addToast;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:max-w-sm z-[1001]">
      {toasts
        .slice()
        .reverse()
        .map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
    </div>
  );
};

// 편의 함수들
export const showToast = (
  message: string,
  type: ToastItem["type"] = "info",
  duration?: number
) => {
  if (typeof window !== "undefined" && (window as any).showToast) {
    (window as any).showToast({ message, type, duration });
  }
};

export const showSuccessToast = (message: string, duration?: number) => {
  showToast(message, "success", duration);
};

export const showErrorToast = (message: string, duration?: number) => {
  showToast(message, "error", duration);
};

export const showWarningToast = (message: string, duration?: number) => {
  showToast(message, "warning", duration);
};

export const showInfoToast = (message: string, duration?: number) => {
  showToast(message, "info", duration);
};
