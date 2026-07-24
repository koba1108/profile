import type { NavigationItem } from "@/content/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNavigation } from "@/components/portfolio/mobile-navigation"

interface SiteHeaderProps {
  copy: {
    desktopLabel: string
    mobileDescription: string
    mobileLabel: string
    mobileTitle: string
    mobileTriggerLabel: string
  }
  handle: string
  items: readonly NavigationItem[]
}

export function SiteHeader({ copy, handle, items }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
        <a
          className="mr-auto rounded-md text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          href="#top"
        >
          {handle}
        </a>
        <nav aria-label={copy.desktopLabel} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <MobileNavigation copy={copy} items={items} />
      </div>
    </header>
  )
}
