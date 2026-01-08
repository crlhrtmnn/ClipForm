import { w as writable, g as get } from "./index.js";
import { s as sanitize_props, j as rest_props, k as attributes, l as clsx, g as ensure_array_like, m as element, b as slot, h as bind_props } from "./index2.js";
import { Y as fallback } from "./context.js";
const ANIMATION_DURATION = 300;
function createUIStore() {
  const { subscribe, set, update } = writable({
    toasts: [],
    modal: {
      isOpen: false,
      title: "",
      content: ""
    },
    isLoading: false,
    loadingMessage: ""
  });
  const toastTimeouts = /* @__PURE__ */ new Map();
  let pendingSuccessToast = null;
  const scheduleToastRemoval = (id, delay) => {
    const existingTimeout = toastTimeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    const timeout = setTimeout(() => {
      update((state) => ({
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === id ? { ...t, state: "exiting" } : t
        )
      }));
      setTimeout(() => {
        update((state) => ({
          ...state,
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
        toastTimeouts.delete(id);
        if (pendingSuccessToast) {
          const { message, duration } = pendingSuccessToast;
          pendingSuccessToast = null;
          setTimeout(() => {
            addToast(message, "success", duration);
          }, 50);
        }
      }, ANIMATION_DURATION);
    }, delay);
    toastTimeouts.set(id, timeout);
  };
  const addToast = (message, type, duration) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast2 = { id, message, type, duration, state: "entering" };
    update((state) => ({
      ...state,
      toasts: [...state.toasts, toast2]
    }));
    setTimeout(() => {
      update((state) => ({
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === id ? { ...t, state: "visible" } : t
        )
      }));
    }, 10);
    scheduleToastRemoval(id, duration);
  };
  const dismissToast = (id) => {
    const existingTimeout = toastTimeouts.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      toastTimeouts.delete(id);
    }
    update((state) => ({
      ...state,
      toasts: state.toasts.map(
        (t) => t.id === id ? { ...t, state: "exiting" } : t
      )
    }));
    setTimeout(() => {
      update((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
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
    showToast: (message, type = "info", duration = 1500) => {
      const state = get({ subscribe });
      if (type === "success") {
        const existingSuccessToast = state.toasts.find(
          (t) => t.type === "success" && t.state !== "exiting"
        );
        if (existingSuccessToast) {
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
    removeToast: (id) => {
      dismissToast(id);
    },
    /**
     * Clear all toasts
     */
    clearToasts: () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout));
      toastTimeouts.clear();
      pendingSuccessToast = null;
      update((state) => ({
        ...state,
        toasts: []
      }));
    },
    /**
     * Show a modal
     */
    showModal: (title, content, onConfirm, onCancel) => {
      update((state) => ({
        ...state,
        modal: {
          isOpen: true,
          title,
          content,
          onConfirm,
          onCancel
        }
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
          content: ""
        }
      }));
    },
    /**
     * Show loading state
     */
    showLoading: (message = "Loading...") => {
      update((state) => ({
        ...state,
        isLoading: true,
        loadingMessage: message
      }));
    },
    /**
     * Hide loading state
     */
    hideLoading: () => {
      update((state) => ({
        ...state,
        isLoading: false,
        loadingMessage: ""
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
          content: ""
        },
        isLoading: false,
        loadingMessage: ""
      });
    }
  };
}
const uiStore = createUIStore();
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
export {
  Icon as I,
  uiStore as u
};
