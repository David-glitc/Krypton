# Krypton Brand Identity

**v2.0 · Goa-Inspired Design System**

This document defines the complete brand identity for Krypton. It supersedes the v1.0 style guide and the current CSS implementation. Every value here is implementation-ready.

---

## 1. Design Principles

**1. Infrastructure, not entertainment.** Krypton is a constraint engine for capital policies. The interface should feel like reading a well-formed spec document that happens to be alive — quietly technical, never decorative. Every pixel must earn its place.

**2. Color carries meaning.** The two-accent system is the core semantic layer: amber for active/policy state, teal for encrypted/private state. Color is never decorative. Risk red and positive green are reserved exclusively for product status states.

**3. Monospace is the voice.** IBM Plex Mono is not a stylistic choice — it is the literal representation of the core object (the policy). Field labels, constraint values, account schemas, and structural dividers all render in monospace. It signals: this is structured data, not prose.

**4. Density is a feature.** This product serves builders and DAOs. Tables, live constraint bars, execution logs, and policy schemas should be information-dense. Whitespace is used for section separation, not as a default state.

**5. Restraint over expression.** No element should draw attention to itself. No gradients, no glass, no glow, no rounded corners beyond a 2px functional minimum. The interface should feel closer to a terminal, an audit log, or a well-typeset RFC than to a consumer app.

**6. Legibility at every level.** From the hero headline to the 10px constraint label, every text element must be instantly readable. High contrast, clear hierarchy, no decorative font weights or treatments that compromise reading speed.

**7. The policy block is the signature.** Section transitions use `field: value` labels in Plex Mono with `--accent-policy`. This is not decoration — it encodes real information from the policy schema. It is the single recurring motif that ties the brand to the actual primitive.

---

## 2. Color System

### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0E1116` | Page background — deep graphite, not pure black |
| `--bg-panel` | `#161B22` | Cards, policy blocks, code panels |
| `--bg-panel-raised` | `#1C232C` | Hover states, nested panels, active rows |

### Borders

| Token | Hex | Usage |
|---|---|---|
| `--border` | `#2A323D` | Hairline dividers, card borders, table borders |

### Text

| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#E6E9EE` | Headlines, body copy, field values |
| `--text-secondary` | `#8B949E` | Captions, metadata, muted labels |
| `--text-muted` | `#484F58` | Timestamps, disabled states, hints |

### Accents (semantic — never decorative)

| Token | Hex | Usage |
|---|---|---|
| `--accent-policy` | `#FFB02E` | Active/policy state. CTA buttons, live constraint indicators, policy field labels, "active" badges |
| `--accent-privacy` | `#5EE6D9` | Encrypted/private state. Proof-of-reserves badges, privacy toggles, encrypted data indicators |
| `--accent-risk` | `#FF6B5E` | Constraint violations, drawdown warnings, rejected actions. **Never decorative.** |
| `--accent-positive` | `#7CD992` | Executed/passed states, positive performance. **Never decorative.** |

### Migration from current CSS

**Remove entirely:**
- `--bg-surface`, `--border-bright` — unnecessary complexity
- `--accent-primary` (#9945FF), `--accent-secondary` (#14F195) — Solana-purple/green is replaced by the semantic amber/teal system
- `--accent-primary-hover`, `--accent-secondary-hover`, `--accent-primary-glow`, `--accent-secondary-glow` — no glow effects
- `--accent-warning` — fold into `--accent-policy` (amber covers both)
- `--gradient-hero`, `--gradient-subtle` — no gradients
- `--logo-accent`, `--logo-primary` — logo colors derived from accent system

**Add:**
- `--text-muted: #484F58` — darker than current for better hierarchy

---

## 3. Typography

### Typefaces

| Role | Family | Fallback |
|---|---|---|
| Display / Headlines | `Space Grotesk` | `system-ui, sans-serif` |
| Body | `IBM Plex Sans` | `system-ui, sans-serif` |
| Monospace / Policy / Code | `IBM Plex Mono` | `ui-monospace, monospace` |

All three loaded from Google Fonts with `display: swap`.

### Type Scale

| Level | Size | Line-height | Weight | Family | Letter-spacing | Usage |
|---|---|---|---|---|---|---|
| Display XL | 64px | 1.05 | 600 | Space Grotesk | -0.02em | Hero headlines (marketing only) |
| Display L | 40px | 1.1 | 600 | Space Grotesk | -0.01em | Page titles |
| Heading | 24px | 1.3 | 500 | Space Grotesk | 0 | Section headings |
| Subheading | 18px | 1.4 | 500 | Space Grotesk | 0 | Subsection headings |
| Body | 16px | 1.6 | 400 | IBM Plex Sans | 0 | Primary copy |
| Body Small | 14px | 1.5 | 400 | IBM Plex Sans | 0 | Secondary copy |
| Mono Label | 13px | 1.4 | 400 | IBM Plex Mono | 0.08em uppercase | Field labels, captions |
| Mono Small | 10px | 1.3 | 400 | IBM Plex Mono | 0.06em uppercase | Constraint bars, timestamps, badges |

### Rules
- Never use Space Grotesk below 18px — it loses its character at small sizes
- Never use IBM Plex Mono for body copy — it is for labels, values, and code only
- Uppercase tracking on mono labels is functional (scannability), not decorative
- No italic usage — use weight and color for emphasis instead

---

## 4. Component Patterns

### Buttons

**Primary (CTA):**
- Background: `--accent-policy`
- Text: `--bg-base` (dark on amber for contrast)
- Border: none
- Padding: 12px 24px
- Radius: 2px
- Font: IBM Plex Mono, 13px, uppercase, letter-spacing 0.06em, weight 500
- Hover: brightness 1.1 (no shadow, no glow, no transform)
- Active: brightness 0.95

**Secondary:**
- Background: transparent
- Border: 1px solid `--border`
- Text: `--text-primary`
- Padding: 12px 24px
- Radius: 2px
- Font: IBM Plex Mono, 13px, uppercase, letter-spacing 0.06em, weight 500
- Hover: border-color `--text-secondary`

**Ghost:**
- Background: transparent
- Border: none
- Text: `--text-secondary`
- Padding: 8px 12px
- Radius: 2px
- Font: IBM Plex Mono, 12px, uppercase, letter-spacing 0.06em
- Hover: text `--text-primary`, background `--bg-panel`

**Rules:**
- No `rounded-xl` or `rounded-2xl` — maximum 2px radius on all buttons
- No `shadow-lg`, `shadow-xl`, or glow effects
- No `translate` or `scale` on hover — only color/brightness changes

### Cards / Panels

**Standard panel:**
- Background: `--bg-panel`
- Border: 1px solid `--border`
- Radius: 2px
- Padding: 16px (compact), 24px (standard)
- No shadow, no blur, no backdrop-filter

**Raised panel (hover/active):**
- Background: `--bg-panel-raised`
- Border: 1px solid `--border`
- Radius: 2px

**Rules:**
- No `rounded-2xl` — 2px maximum
- No `shadow-sm`, `shadow-md`, `shadow-lg`
- No `backdrop-blur`
- Depth comes from background-layer contrast only

### Forms

**Input fields:**
- Background: `--bg-base`
- Border: 1px solid `--border`
- Radius: 2px
- Padding: 8px 12px
- Font: IBM Plex Mono, 14px
- Focus: border-color `--accent-policy`, no outline, no shadow
- Placeholder: `--text-muted`

**Select / dropdown:**
- Same as input fields
- Custom arrow in `--text-secondary`, no decorative icon

**Rules:**
- No glow on focus
- No animated borders
- Labels above fields, in Mono Label style (13px uppercase)

### Badges

**Status badge:**
- Padding: 2px 8px
- Radius: 2px
- Font: IBM Plex Mono, 10px, uppercase, letter-spacing 0.06em
- Background: `--accent` at 10% opacity
- Text: `--accent` at 100%
- Border: none

**Variants:**
- Active: `--accent-policy` bg/text
- Encrypted: `--accent-privacy` bg/text
- Risk: `--accent-risk` bg/text
- Positive: `--accent-positive` bg/text

### Navigation

**Top nav bar:**
- Background: `--bg-base`
- Bottom border: 1px solid `--border`
- Height: 56px
- Font: IBM Plex Mono, 13px, uppercase, letter-spacing 0.06em
- Active item: text `--accent-policy`, bottom border 2px solid `--accent-policy`
- Inactive item: text `--text-secondary`

**Rules:**
- No shadow on nav
- No logo glow or gradient treatment

---

## 5. Layout

### Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps (badge padding, icon gaps) |
| `--space-2` | 8px | Compact gaps (inline elements, input padding) |
| `--space-3` | 12px | Standard gaps (button padding, form field gaps) |
| `--space-4` | 16px | Panel padding (compact), section gaps |
| `--space-5` | 24px | Panel padding (standard), component separation |
| `--space-6` | 32px | Section separation, grid gutters (desktop) |
| `--space-7` | 48px | Major section breaks |
| `--space-8` | 64px | Page-level spacing |

### Grid

- 12-column grid on desktop (≥1024px)
- Gutter: 32px (`--space-6`)
- Max content width: 1200px
- Tablet (768–1023px): 8-column, 24px gutters
- Mobile (<768px): 4-column, 16px gutters

### Vertical Rhythm

- Base unit: 8px
- All vertical spacing should be a multiple of 8px
- Line-heights are unitless (see Typography section)

### Density Rules

- Product UI (tables, logs, dashboards): compact spacing (`--space-2` to `--space-4`)
- Marketing/landing pages: generous spacing (`--space-6` to `--space-8`)
- Never use more than `--space-8` between elements

---

## 6. Anti-Patterns

The following are **strictly prohibited**. If you find these in the codebase, remove them.

### Visual Effects
- **No gradients.** Remove all `linear-gradient`, `radial-gradient`, `bg-gradient-to-*`. This includes gradient text, gradient borders, gradient backgrounds.
- **No glass effects.** Remove all `backdrop-blur`, `backdrop-filter`, `bg-opacity` used for frosted glass.
- **No glow effects.** Remove all `box-shadow` with color values (shadows for glow, not elevation). Remove `--accent-*-glow` variables.
- **No shadows for depth.** Remove `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`. Depth comes from background-layer contrast only.
- **No rounded corners beyond 2px.** Remove `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`. Maximum radius is 2px.
- **No decorative animations.** Remove `animate-glow`, `animate-pulse`, `animate-bounce`. Fade-in on mount is acceptable (0.2s ease-out, no transform).
- **No decorative transforms.** No `scale`, `rotate`, `translate` on hover or interaction. Only color and brightness changes.

### Color
- **No purple or green as brand colors.** The Solana palette (#9945FF, #14F195) is replaced by the semantic amber/teal system.
- **No accent colors outside the defined set.** If it's not `--accent-policy`, `--accent-privacy`, `--accent-risk`, or `--accent-positive`, it doesn't get a special color.
- **No decorative use of risk/positive colors.** These are for status states only.

### Typography
- **No decorative fonts.** No serif, display, or script typefaces. Only Space Grotesk, IBM Plex Sans, IBM Plex Mono.
- **No text shadows or text glow.**
- **No font weight below 400 or above 700.**

### Components
- **No 3D renders, abstract orbs, spheres, rocket/moon imagery.**
- **No icons with decorative fills.** Icons are monochrome line-stroke (1.5px), `--text-secondary` by default, accent color only for active/selected states.
- **No decorative borders.** Borders are 1px solid `--border` only. No gradient borders, no double borders, no decorative dividers.

### Layout
- **No full-bleed decorative backgrounds.** Background is always `--bg-base` or `--bg-panel`.
- **No sticky hover states that change layout.** Hover effects only change color, not size or position.

---

## 7. CSS Custom Properties — Complete Reference

Replace the entire `:root` block in `app.css` with:

```css
:root {
  /* Backgrounds */
  --bg-base: #0E1116;
  --bg-panel: #161B22;
  --bg-panel-raised: #1C232C;

  /* Borders */
  --border: #2A323D;

  /* Text */
  --text-primary: #E6E9EE;
  --text-secondary: #8B949E;
  --text-muted: #484F58;

  /* Accents (semantic) */
  --accent-policy: #FFB02E;
  --accent-privacy: #5EE6D9;
  --accent-risk: #FF6B5E;
  --accent-positive: #7CD992;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Layout */
  --max-width: 1200px;
  --nav-height: 56px;
  --radius: 2px;
}
```

### Font face imports (keep, but verify weights):

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
```

### Component class replacements:

| Current class | Replacement |
|---|---|
| `.btn-primary` | Remove shadow, glow, `rounded-xl` → 2px radius, dark text on amber |
| `.btn-secondary` | Remove `rounded-xl` → 2px radius, remove shadow |
| `.btn-ghost` | Remove `rounded-xl` → 2px radius |
| `.panel` | Remove `rounded-2xl` → 2px, remove `shadow-sm`, remove `backdrop-blur-sm` |
| `.panel-raised` | Remove `rounded-2xl` → 2px, remove `shadow-md` |
| `.panel-surface` | Remove `rounded-2xl` → 2px, remove `shadow-sm` |
| `.gradient-text` | **Delete entirely** |
| `.gradient-border` | **Delete entirely** |
| `.animate-glow` | **Delete entirely** |
| `.animate-fade-in` | Keep but remove `translateY` — opacity only, 0.2s |

---

## Implementation Checklist

When applying this brand identity to the codebase:

1. Replace `:root` CSS variables with the values in §7
2. Delete all gradient, glow, and glass-related variables
3. Update all component classes per the replacement table
4. Change all `rounded-2xl` and `rounded-xl` to `rounded-[2px]`
5. Remove all `shadow-*` classes from components
6. Remove all `backdrop-blur` classes
7. Remove `.gradient-text`, `.gradient-border`, `.animate-glow` classes
8. Simplify `.animate-fade-in` to opacity-only transition
9. Update selection color to `--accent-policy` with `--bg-base` text
10. Verify all accent colors reference the new semantic tokens
