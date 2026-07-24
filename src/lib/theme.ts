export const THEME_STORAGE_KEY = "profile.theme"

export type Theme = "dark" | "light"

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light"
}

export function readStoredTheme(): Theme | null {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(storedTheme) ? storedTheme : null
  } catch {
    return null
  }
}

export function readSystemTheme(): Theme {
  try {
    if (typeof window.matchMedia !== "function") {
      return "dark"
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  } catch {
    return "dark"
  }
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? readSystemTheme()
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.classList.toggle("light", theme === "light")
  root.style.colorScheme = theme
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme switching remains available for the current page if storage is blocked.
  }
}
