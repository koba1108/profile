import type { NavigationItem } from "@/content/types"

const navigationItems = [
  { id: "work", label: "Selected Work", href: "#work" },
  { id: "capabilities", label: "Capabilities", href: "#capabilities" },
  { id: "about", label: "About", href: "#about" },
  { id: "contact", label: "Contact", href: "#contact" },
] as const satisfies readonly NavigationItem[]

export function getNavigationItems(includeWork: boolean) {
  return includeWork
    ? navigationItems
    : navigationItems.filter((item) => item.id !== "work")
}
