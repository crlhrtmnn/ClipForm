import { writable } from "svelte/store";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeMode;
  systemPreference: "light" | "dark";
  resolvedTheme: "light" | "dark";
}

const STORAGE_KEY = "clipform-theme";

/**
 * Theme store for managing dark mode with system preference detection
 */
function createThemeStore() {
  // Initialize with system preference
  const getSystemPreference = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Load saved theme or default to 'system'
  const getSavedTheme = (): ThemeMode => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return "system";
  };

  const systemPreference = getSystemPreference();
  const savedMode = getSavedTheme();

  const { subscribe, set, update } = writable<ThemeState>({
    mode: savedMode,
    systemPreference,
    resolvedTheme:
      savedMode === "system"
        ? systemPreference
        : (savedMode as "light" | "dark"),
  });

  let mediaQuery: MediaQueryList | null = null;

  /**
   * Update resolved theme based on mode and system preference
   */
  const updateResolvedTheme = (
    mode: ThemeMode,
    systemPref: "light" | "dark"
  ): "light" | "dark" => {
    return mode === "system" ? systemPref : (mode as "light" | "dark");
  };

  return {
    subscribe,

    /**
     * Set theme mode and persist to localStorage
     */
    setTheme: (mode: ThemeMode) => {
      if (typeof window === "undefined") return;

      localStorage.setItem(STORAGE_KEY, mode);

      update((state) => {
        const resolvedTheme = updateResolvedTheme(mode, state.systemPreference);
        return {
          ...state,
          mode,
          resolvedTheme,
        };
      });
    },

    /**
     * Toggle between light and dark (ignoring system)
     */
    toggleTheme: () => {
      update((state) => {
        const newMode: ThemeMode =
          state.resolvedTheme === "dark" ? "light" : "dark";

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, newMode);
        }

        return {
          ...state,
          mode: newMode,
          resolvedTheme: newMode,
        };
      });
    },

    /**
     * Initialize system preference detection
     */
    syncSystemPreference: () => {
      if (typeof window === "undefined") return;

      const systemPref = getSystemPreference();

      update((state) => {
        const resolvedTheme = updateResolvedTheme(state.mode, systemPref);
        return {
          ...state,
          systemPreference: systemPref,
          resolvedTheme,
        };
      });

      // Set up listener for system preference changes
      if (!mediaQuery) {
        mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
          const newSystemPref = e.matches ? "dark" : "light";

          update((state) => {
            const resolvedTheme = updateResolvedTheme(
              state.mode,
              newSystemPref
            );
            return {
              ...state,
              systemPreference: newSystemPref,
              resolvedTheme,
            };
          });
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", handler);
        } else {
          // Fallback for older browsers
          mediaQuery.addListener(handler);
        }
      }
    },

    /**
     * Clean up listeners
     */
    destroy: () => {
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", () => {});
        } else {
          mediaQuery.removeListener(() => {});
        }
        mediaQuery = null;
      }
    },
  };
}

export const themeStore = createThemeStore();
