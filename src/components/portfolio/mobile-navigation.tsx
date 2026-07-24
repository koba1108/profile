import { Menu } from "lucide-react"

import type { NavigationItem } from "@/content/types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileNavigationProps {
  copy: {
    mobileDescription: string
    mobileLabel: string
    mobileTitle: string
    mobileTriggerLabel: string
  }
  items: readonly NavigationItem[]
}

export function MobileNavigation({ copy, items }: MobileNavigationProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label={copy.mobileTriggerLabel}
          className="size-11 md:hidden"
          size="icon"
          variant="outline"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(21rem,calc(100vw-2rem))]">
        <SheetHeader>
          <SheetTitle>{copy.mobileTitle}</SheetTitle>
          <SheetDescription className="sr-only">
            {copy.mobileDescription}
          </SheetDescription>
        </SheetHeader>
        <nav aria-label={copy.mobileLabel}>
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <SheetClose asChild>
                  <a
                    className="flex min-h-11 items-center rounded-lg px-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
