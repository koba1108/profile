import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "@/App"
import { ThemeProvider } from "@/components/theme-provider"
import { applyTheme, resolveInitialTheme } from "@/lib/theme"

import "./index.css"

applyTheme(resolveInitialTheme())

const root = document.getElementById("root")

if (!root) {
  throw new Error("React root element was not found")
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
