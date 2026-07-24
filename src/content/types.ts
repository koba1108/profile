export type VerificationStatus =
  | "verified"
  | "provisional"
  | "withheld"
  | "pending"

export type PublicationStatus = "approved" | "blocked" | "pending"

export type NonEmptyArray<T> = readonly [T, ...T[]]

export interface ContentField<T> {
  value?: T
  verificationStatus: VerificationStatus
  sourceRefs: readonly string[]
}

export interface DisplayContentField<T> extends ContentField<T> {
  value: T
  verificationStatus: "verified" | "provisional"
}

export interface WorkCandidate<T> {
  value: T
  sourceRefs: readonly string[]
}

export interface WorkField<T> extends ContentField<T> {
  candidates?: readonly WorkCandidate<T>[]
}

export interface DisplayWorkField<T> extends WorkField<T> {
  value: T
  verificationStatus: "verified" | "provisional"
}

export type PublicDisplayWorkField<T> = Omit<
  DisplayWorkField<T>,
  "candidates"
> & {
  candidates?: never
}

type ExistingPublicWorkSourceBase =
  "https://github.com/koba1108/profile/blob/3b67135b0ff844530d4edb5308b30b9aadff4a19"

export type HomepageWorkSource =
  `${ExistingPublicWorkSourceBase}/data/homepage.yml#L${number}${string}`

export type AboutWorkSource =
  `${ExistingPublicWorkSourceBase}/content/about.md#L${number}${string}`

export type ExistingPublicWorkSource =
  | HomepageWorkSource
  | AboutWorkSource

export type ExistingPublicWorkField<
  T,
  TSource extends ExistingPublicWorkSource,
> = Omit<
  PublicDisplayWorkField<T>,
  "sourceRefs" | "verificationStatus"
> & {
  verificationStatus: "verified"
  sourceRefs: NonEmptyArray<TSource>
}

export interface Profile {
  displayName: DisplayContentField<string>
  handle: DisplayContentField<string>
  roles: DisplayContentField<NonEmptyArray<string>>
  headline: DisplayContentField<string>
  introduction: DisplayContentField<string>
  about: DisplayContentField<string>
}

export interface ApprovalEvidence {
  kind: "issue-comment"
  url: "https://github.com/koba1108/profile/issues/4#issuecomment-5071031559"
}

export interface ApprovedPublication {
  status: "approved"
  approval: ApprovalEvidence
}

export interface UnpublishedPublication {
  status: Exclude<PublicationStatus, "approved">
}

export type WorkPublication =
  | ApprovedPublication
  | UnpublishedPublication

export interface Work {
  id: string
  title: WorkField<string>
  role: WorkField<string>
  context: WorkField<string>
  responsibilities: WorkField<readonly string[]>
  technologies: WorkField<readonly string[]>
  challenge?: WorkField<string>
  decisions?: WorkField<readonly string[]>
  outcomes?: WorkField<readonly string[]>
  publication: WorkPublication
}

export interface ApprovedWorkCandidate {
  id: string
  title: ExistingPublicWorkField<string, HomepageWorkSource>
  role: ExistingPublicWorkField<string, HomepageWorkSource>
  context: ExistingPublicWorkField<string, AboutWorkSource>
  responsibilities: ExistingPublicWorkField<
    NonEmptyArray<string>,
    AboutWorkSource
  >
  technologies: ExistingPublicWorkField<
    NonEmptyArray<string>,
    HomepageWorkSource
  >
  challenge?: never
  decisions?: never
  outcomes?: never
  publication: ApprovedPublication
}

export interface PublishedWork {
  id: string
  title: string
  role: string
  context: string
  responsibilities: NonEmptyArray<string>
  technologies: NonEmptyArray<string>
}

export interface Capability {
  id: string
  label: DisplayContentField<string>
  title: DisplayContentField<string>
  description: DisplayContentField<string>
  technologies: DisplayContentField<readonly string[]>
}

export interface ApproachStep {
  id: string
  order: 1 | 2 | 3
  title: DisplayContentField<string>
  description: DisplayContentField<string>
}

export interface ContactMethod {
  id: string
  label: string
  description: string
  href: `https://${string}`
  publicationStatus: "approved"
  sourceRefs: readonly string[]
}

export interface NavigationItem {
  id: "work" | "capabilities" | "about" | "contact"
  label: string
  href: `#${string}`
}

export interface SectionCopy {
  eyebrow: string
  title: string
  description?: string
}

export interface WorkSectionCopy extends SectionCopy {
  cardTechnologiesLabel: string
  detailsCta: string
  detailsCtaSuffix: string
  details: {
    context: string
    role: string
    responsibilities: string
    stack: string
    technologiesLabel: string
  }
}
