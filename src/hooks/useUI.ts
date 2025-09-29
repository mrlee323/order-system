"use client";

import { useState, useCallback } from "react";

import { AlertState, PromptState, ModalState } from "@/lib/types/ui";

export const useUI = () => {
  // Alert 상태
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    title: "",
    description: "",
    buttonText: "확인",
  });

  // Prompt 상태
  const [prompt, setPrompt] = useState<PromptState>({
    isOpen: false,
    title: "",
    description: "",
    cancelText: "취소",
    confirmText: "확인",
  });

  // Modal 상태
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: null,
  });

  // Alert 함수들
  const showAlert = useCallback(
    (title: string, description?: string, buttonText?: string) => {
      setAlert({
        isOpen: true,
        title,
        description,
        buttonText: buttonText || "확인",
      });
    },
    []
  );

  const closeAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Prompt 함수들
  const showPrompt = useCallback(
    (
      title: string,
      description?: string,
      cancelText?: string,
      confirmText?: string
    ) => {
      setPrompt({
        isOpen: true,
        title,
        description,
        cancelText: cancelText || "취소",
        confirmText: confirmText || "확인",
      });
    },
    []
  );

  const closePrompt = useCallback(() => {
    setPrompt((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Modal 함수들
  const showModal = useCallback((content: React.ReactNode) => {
    setModal({
      isOpen: true,
      content,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    // 상태
    alert,
    prompt,
    modal,

    // Alert 함수들
    showAlert,
    closeAlert,

    // Prompt 함수들
    showPrompt,
    closePrompt,

    // Modal 함수들
    showModal,
    closeModal,
  };
};
