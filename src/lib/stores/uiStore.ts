import { writable } from "svelte/store";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface UIState {
  toasts: Toast[];
  modal: ModalState;
  isLoading: boolean;
  loadingMessage: string;
}

/**
 * UI store for managing toasts, modals, and loading states
 */
function createUIStore() {
  const { subscribe, set, update } = writable<UIState>({
    toasts: [],
    modal: {
      isOpen: false,
      title: "",
      content: "",
    },
    isLoading: false,
    loadingMessage: "",
  });

  let toastTimeout: NodeJS.Timeout | null = null;

  return {
    subscribe,

    /**
     * Show a toast notification
     */
    showToast: (
      message: string,
      type: ToastType = "info",
      duration: number = 1500
    ) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const toast: Toast = { id, message, type, duration };

      update((state) => ({
        ...state,
        toasts: [...state.toasts, toast],
      }));

      // Auto-remove after duration
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }

      toastTimeout = setTimeout(() => {
        update((state) => ({
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    },

    /**
     * Remove a specific toast
     */
    removeToast: (id: string) => {
      update((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },

    /**
     * Clear all toasts
     */
    clearToasts: () => {
      update((state) => ({
        ...state,
        toasts: [],
      }));
    },

    /**
     * Show a modal
     */
    showModal: (
      title: string,
      content: string,
      onConfirm?: () => void,
      onCancel?: () => void
    ) => {
      update((state) => ({
        ...state,
        modal: {
          isOpen: true,
          title,
          content,
          onConfirm,
          onCancel,
        },
      }));
    },

    /**
     * Close the modal
     */
    closeModal: () => {
      update((state) => ({
        ...state,
        modal: {
          isOpen: false,
          title: "",
          content: "",
        },
      }));
    },

    /**
     * Show loading state
     */
    showLoading: (message: string = "Loading...") => {
      update((state) => ({
        ...state,
        isLoading: true,
        loadingMessage: message,
      }));
    },

    /**
     * Hide loading state
     */
    hideLoading: () => {
      update((state) => ({
        ...state,
        isLoading: false,
        loadingMessage: "",
      }));
    },

    /**
     * Reset UI state
     */
    reset: () => {
      set({
        toasts: [],
        modal: {
          isOpen: false,
          title: "",
          content: "",
        },
        isLoading: false,
        loadingMessage: "",
      });
    },
  };
}

export const uiStore = createUIStore();

// Convenience methods
export const toast = {
  success: (message: string, duration?: number) =>
    uiStore.showToast(message, "success", duration),
  error: (message: string, duration?: number) =>
    uiStore.showToast(message, "error", duration),
  info: (message: string, duration?: number) =>
    uiStore.showToast(message, "info", duration),
  warning: (message: string, duration?: number) =>
    uiStore.showToast(message, "warning", duration),
};
