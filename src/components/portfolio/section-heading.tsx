interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow === title ? null : (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2
        className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
        id={id}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
