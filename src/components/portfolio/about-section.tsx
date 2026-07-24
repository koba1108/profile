import { SectionHeading } from "@/components/portfolio/section-heading"
import type { Profile } from "@/content/types"

interface AboutSectionProps {
  copy: {
    eyebrow: string
  }
  profile: Profile
}

export function AboutSection({ copy, profile }: AboutSectionProps) {
  return (
    <section
      aria-labelledby="about-title"
      className="scroll-mt-20 border-t py-16 sm:py-24"
      id="about"
    >
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <SectionHeading
          eyebrow={copy.eyebrow}
          id="about-title"
          title={`${profile.displayName.value} / ${profile.handle.value}`}
        />
        <p className="max-w-3xl text-pretty text-lg leading-9 text-muted-foreground">
          {profile.about.value}
        </p>
      </div>
    </section>
  )
}
