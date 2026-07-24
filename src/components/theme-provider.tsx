import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  ThemeContext,
  type ThemeContextValue,
} from "@/components/theme-context"
import {
  applyTheme,
  readStoredTheme,
  readSystemTheme,
  resolveInitialTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme"

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(resolveInitialTheme)
  const [followsSystem, setFollowsSystem] = useState(
    () => readStoredTheme() === null,
  )

  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!followsSystem || typeof window.matchMedia !== "function") {
      return
    }

    let mediaQuery: MediaQueryList

    try {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    } catch {
      return
    }

    const handleChange = () => setThemeState(readSystemTheme())

    mediaQuery.addEventListener?.("change", handleChange)
    return () => mediaQuery.removeEventListener?.("change", handleChange)
  }, [followsSystem])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme(nextTheme) {
        setFollowsSystem(false)
        setThemeState(nextTheme)
        storeTheme(nextTheme)
      },
    }),
    [theme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
