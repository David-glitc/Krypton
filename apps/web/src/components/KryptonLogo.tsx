import * as React from 'react'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZES: Record<Size, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

interface Props {
  size?: Size
  className?: string
  animated?: boolean
}

/**
 * Krypton hexagon-K logo — geometric mark
 *
 *   ┌─┐
 *  ╱ K ╲    ← stylised K within a hexagon
 *  ╲   ╱
 *   └─┘
 * Two interlocking triangles form the core, with a K cutout.
 */
export function KryptonLogo({ size = 'md', className }: Props) {
  const px = SIZES[size]

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Krypton"
    >
      {/* Hexagon base */}
      <polygon
        points="32,4 56,18 56,46 32,60 8,46 8,18"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinejoin="miter"
      />

      {/* K letterform */}
      <line x1="22" y1="20" x2="22" y2="44" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="24" y1="32" x2="42" y2="20" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="24" y1="32" x2="42" y2="44" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  )
}

/** Inline SVG favicon — minimal 32x32 mark */
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
<polygon points="32,8 52,20 52,44 32,56 12,44 12,20" fill="none" stroke="var(--accent)" stroke-width="3"/>
<line x1="22" y1="22" x2="22" y2="42" stroke="var(--accent)" stroke-width="3" stroke-linecap="square"/>
<line x1="24" y1="32" x2="40" y2="22" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="square"/>
<line x1="24" y1="32" x2="40" y2="42" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="square"/>
</svg>`
