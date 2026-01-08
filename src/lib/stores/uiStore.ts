import { writable, get } from "svelte/store";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastState = "entering" | "visible" | "exiting";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  state: ToastState;
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

// Animation duration in ms - should match CSS transition
const ANIMATION_DURATION = 300;

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

  // Track timeouts per toast for cleanup
  const toastTimeouts = new Map<string, NodeJS.Timeout>();

  // Queue for pending success toasts
  let pendingSuccessToast: { message: string; duration: number } | null = null;

  const scheduleToastRemoval = (id: string, delay: number) => {
    // Clear any existing timeout for this toast
    const existingTimeout = toastTimeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(() => {
      // Start exit animation
      update((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, state: "exiting" as ToastState } : t
        ),
      }));

      // Remove after animation completes
      setTimeout(() => {
        update((state) => ({
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
        toastTimeouts.delete(id);

        // If there's a pending success toast, show it now
        if (pendingSuccessToast) {
          const { message, duration } = pendingSuccessToast;
          pendingSuccessToast = null;
          // Small delay to ensure smooth transition
          setTimeout(() => {
            addToast(message, "success", duration);
          }, 50);
        }
      }, ANIMATION_DURATION);
    }, delay);

    toastTimeouts.set(id, timeout);
  };

  const addToast = (message: string, type: ToastType, duration: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { id, message, type, duration, state: "entering" };

    update((state) => ({
      ...state,
      toasts: [...state.toasts, toast],
    }));

    // Transition to visible state after entering animation
    setTimeout(() => {
      update((state) => ({
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id ? { ...t, state: "visible" as ToastState } : t
        ),
      }));
    }, 10);

    // Schedule removal
    scheduleToastRemoval(id, duration);
  };

  const dismissToast = (id: string) => {
    // Clear scheduled timeout
    const existingTimeout = toastTimeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      toastTimeouts.delete(id);
    }

    // Start exit animation
    update((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, state: "exiting" as ToastState } : t
      ),
    }));

    // Remove after animation
    setTimeout(() => {
      update((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }));

      // If there's a pending success toast, show it now
      if (pendingSuccessToast) {
        const { message, duration } = pendingSuccessToast;
        pendingSuccessToast = null;
        setTimeout(() => {
          addToast(message, "success", duration);
        }, 50);
      }
    }, ANIMATION_DURATION);
  };

  return {
    subscribe,

    /**
     * Show a toast notification
     * For success toasts: only one at a time, new ones replace existing
     */
    showToast: (
      message: string,
      type: ToastType = "info",
      duration: number = 1500
    ) => {
      const state = get({ subscribe });

      // For success toasts, ensure only one exists at a time
      if (type === "success") {
        const existingSuccessToast = state.toasts.find(
          (t) => t.type === "success" && t.state !== "exiting"
        );

        if (existingSuccessToast) {
          // Queue this toast and dismiss the existing one
          pendingSuccessToast = { message, duration };
          dismissToast(existingSuccessToast.id);
          return;
        }
      }

      addToast(message, type, duration);
    },

    /**
     * Remove a specific toast with animation
     */
    removeToast: (id: string) => {
      dismissToast(id);
    },

    /**
     * Clear all toasts
     */
    clearToasts: () => {
      // Clear all timeouts
      toastTimeouts.forEach((timeout) => clearTimeout(timeout));
      toastTimeouts.clear();
      pendingSuccessToast = null;

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
