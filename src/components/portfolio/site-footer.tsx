interface SiteFooterProps {
  displayName: string
  handle: string
}

export function SiteFooter({ displayName, handle }: SiteFooterProps) {
  return (
    <footer>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {displayName}
        </p>
        <p>@{handle}</p>
      </div>
    </footer>
  )
}
