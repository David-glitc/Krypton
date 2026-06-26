export function SectionHeading({
  title,
  trailing,
}: {
  title: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="font-[family-name:var(--font-hanken)] text-base font-medium text-text-primary sm:text-xl">
        {title}
      </h2>
      <div className="h-px flex-1 bg-border" />
      {trailing}
    </div>
  )
}
