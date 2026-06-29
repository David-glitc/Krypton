export function SectionHeading({
  title,
  trailing,
}: {
  title: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="section-title shrink-0">{title}</h2>
      <div className="h-px flex-1 bg-border" />
      {trailing}
    </div>
  )
}
