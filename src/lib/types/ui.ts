export interface AlertState {
  isOpen: boolean;
  title: string;
  description?: string;
  buttonText?: string;
}

export interface PromptState {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

export interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
}

export interface ToastItem {
  id: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}
