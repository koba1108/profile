import { Code2, ExternalLink } from "lucide-react"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { Button } from "@/components/ui/button"
import type { ContactMethod, SectionCopy } from "@/content/types"

interface ContactSectionProps {
  contacts: readonly ContactMethod[]
  copy: SectionCopy
}

export function ContactSection({ contacts, copy }: ContactSectionProps) {
  return (
    <section
      aria-labelledby="contact-title"
      className="scroll-mt-20 border-y py-16 sm:py-24"
      id="contact"
    >
      <div className="rounded-[2rem] border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <SectionHeading
          description={copy.description}
          eyebrow={copy.eyebrow}
          id="contact-title"
          title={copy.title}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {contacts.map((contact) => (
            <Button asChild className="min-h-11" key={contact.id} variant="outline">
              <a
                aria-label={`${contact.label}: ${contact.description}`}
                href={contact.href}
                referrerPolicy="no-referrer"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Code2 aria-hidden="true" />
                {contact.label}
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
