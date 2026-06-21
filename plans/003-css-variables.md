# Plan 003: Fix CSS variable naming inconsistency

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.

> **Drift check (run first)**: `git diff --stat 23968b68d..HEAD -- src/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `23968b68d`, 2026-06-19

## Why this matters

The CSS defines variables like `--color-border` but components reference `var(--border)`. This means borders, backgrounds, and text colors may not render correctly. The `@theme` block in `globals.css` defines `--color-*` variables but the utility classes and component styles reference the old `--*` names.

## Current state

- `src/app/globals.css:7` — defines `--color-border: #2A323D` via `@theme`
- `src/app/globals.css:19` — uses `var(--border)` in `* { border-color: var(--border) }` — **this references a variable that doesn't exist**
- `src/app/app/layout.tsx:16` — uses `border-border` class which maps to `--color-border`
- `src/app/app/page.tsx` — uses `bg-bg-panel`, `text-text-primary`, etc. which map to `--color-*` variables
- The `@theme` block correctly defines `--color-bg-base`, `--color-bg-panel`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`, `--color-accent-muted`, `--color-accent-risk`, `--color-accent-positive`

## Commands you will need

| Purpose   | Command                | Expected on success |
|-----------|------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`     | exit 0, no errors   |
| Build     | `pnpm build`           | exit 0              |

## Scope

**In scope** (the only file you should modify):
- `src/app/globals.css` — fix variable references to use consistent naming

**Out of scope**:
- Any `.tsx` files — they use Tailwind classes which map correctly to `--color-*` variables
- `tailwind.config.ts` — not present, using Tailwind v4 defaults

## Steps

### Step 1: Fix the CSS variable references in globals.css

The `@theme` block defines `--color-*` variables. The rest of the CSS needs to reference these correctly. Replace the inconsistent `var(--border)`, `var(--bg-base)`, etc. with the correct `var(--color-*)` references.

In `src/app/globals.css`, change:

```css
/* BEFORE (broken) */
* {
  border-color: var(--border);
}

body {
  background: var(--bg-base);
  color: var(--text-primary);
}
```

To:

```css
/* AFTER (correct) */
* {
  border-color: var(--color-border);
}

body {
  background: var(--color-bg-base);
  color: var(--color-text-primary);
}
```

Also update the `.btn-primary`, `.btn-secondary`, `.panel`, `.label`, and `.input-field` classes to use `var(--color-*)` instead of `var(--*)`:

```css
.btn-primary {
  background: var(--color-accent);
  ...
}
.btn-primary:hover { background: var(--color-accent-hover); }

.btn-secondary {
  border: 1px solid var(--color-border);
  background: var(--color-bg-panel);
  color: var(--color-text-primary);
}
.btn-secondary:hover { border-color: var(--color-text-secondary); }

.panel {
  border: 1px solid var(--color-border);
  background: var(--color-bg-panel);
}

.label {
  color: var(--color-accent);
}

.input-field {
  border: 1px solid var(--color-border);
  background: var(--color-bg-base);
  color: var(--color-text-primary);
}
.input-field:focus { border-color: var(--color-accent); }
```

**Verify**: `pnpm build` → exits 0

## Test plan

- Visual verification: borders should render as `#2A323D`, backgrounds as `#161B22`, text as `#E6E9EE`
- No unit tests needed for CSS changes

## Done criteria

- [ ] `pnpm build` exits 0
- [ ] All `var(--border)` references changed to `var(--color-border)`
- [ ] All `var(--bg-base)` references changed to `var(--color-bg-base)`
- [ ] All `var(--text-*)` references changed to `var(--color-text-*)`
- [ ] All `var(--accent-*)` references changed to `var(--color-accent-*)`

## STOP conditions

- If Tailwind v4 auto-generates classes from `@theme` variables, the `border-border` class may already work — verify by checking if borders render correctly before making changes

## Maintenance notes

- When adding new CSS custom properties, always use the `--color-*` prefix for consistency
- Tailwind v4 reads from `@theme` — keep all design tokens there
