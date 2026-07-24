import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const nextTheme = theme === "dark" ? "light" : "dark"
  const label =
    nextTheme === "light"
      ? "ライトテーマに切り替える"
      : "ダークテーマに切り替える"

  return (
    <Button
      aria-label={label}
      className="size-11"
      onClick={() => setTheme(nextTheme)}
      size="icon"
      variant="outline"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </Button>
  )
}
