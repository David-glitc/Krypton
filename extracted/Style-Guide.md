# Krypton — Visual Identity & Style Guide
**v1.0 · Brand & Product Design System**

---

## 1. Design Thesis

Krypton's product is a *readable policy that an AI interprets and a contract enforces*. The visual identity should make that legible at a glance: the interface should feel like reading a well-formed spec document that happens to be alive — quietly technical, never decorative, with one recurring motif that ties the brand to the actual primitive (the policy block) rather than to generic crypto signifiers (rockets, gradients, abstract orbs, glowing coins).

**What we are avoiding:** the three AI-generated defaults — warm cream/serif/terracotta, near-black with a single neon accent used purely as decoration, and broadsheet newspaper columns. We are also avoiding the "Phantom purple gradient + rounded glass card" wallet-app look, since Krypton is infrastructure, not a consumer wallet — it should feel closer to a terminal, an audit log, or a well-typeset RFC than to a mobile banking app.

**What we are reaching for instead:** a **policy-document aesthetic** — structured, monospace-inflected, with a restrained two-accent system where color carries *meaning* (amber = active/policy state, cyan-glass = encrypted/private state) rather than mood.

---

## 2. Color System

| Token | Hex | Role |
|---|---|---|
| `--bg-base` | `#0E1116` | Primary background — deep graphite, not pure black (avoids the "near-black + neon" cliché while staying low-glare for a data-dense product) |
| `--bg-panel` | `#161B22` | Cards, policy blocks, code panels |
| `--bg-panel-raised` | `#1C232C` | Hover states, nested panels |
| `--border` | `#2A323D` | Hairline dividers, table borders |
| `--text-primary` | `#E6E9EE` | Headlines, primary copy |
| `--text-secondary` | `#8B949E` | Captions, metadata, muted labels |
| `--accent-policy` | `#FFB02E` | **Active/Policy state.** Used for live constraint indicators, policy field labels, "active" badges, CTA buttons |
| `--accent-privacy` | `#5EE6D9` | **Encrypted/Private state.** Used for encrypted data indicators, proof-of-reserves badges, privacy toggles |
| `--accent-risk` | `#FF6B5E` | Reserved exclusively for constraint violations, drawdown warnings, rejected actions — never decorative |
| `--accent-positive` | `#7CD992` | Executed/passed states, positive performance |

**Usage rule:** `--accent-policy` and `--accent-privacy` are the only two accents that may appear in marketing/brand contexts. `--accent-risk` and `--accent-positive` are reserved for product UI status states and should not appear in the deck or one-pager except where literally illustrating the constraint engine.

---

## 3. Typography

| Role | Typeface | Notes |
|---|---|---|
| Display / Headlines | **Space Grotesk** | Geometric but with enough character (the slightly squared 'o' and 'a') to feel engineered rather than generic-tech. Used at large sizes, tight letter-spacing, weight 500–700. |
| Body | **IBM Plex Sans** | Pairs naturally with Plex Mono for a "technical document" cohesion; highly legible at small sizes for dense product copy. |
| Monospace / Code / Policy blocks | **IBM Plex Mono** | This is the signature typographic device — policy YAML, field labels, account schemas, and structural dividers all render in Plex Mono. It is *not* decoration; it is literally how the product represents its core object. |

**Type scale (deck/marketing):**
- Display XL: 64px / 1.05 / Space Grotesk 600
- Display L: 40px / 1.1 / Space Grotesk 600
- Heading: 24px / 1.3 / Space Grotesk 500
- Body: 16px / 1.6 / IBM Plex Sans 400
- Caption/label: 13px / 1.4 / IBM Plex Mono 400, uppercase, letter-spacing 0.08em

---

## 4. Layout Principles

- **Grid:** 12-column, generous gutters (32px desktop). Panels align to a baseline grid that echoes a fixed-width terminal — this is felt rather than seen, but governs vertical rhythm.
- **Structural device — the policy block.** Instead of numbered markers (01/02/03), section transitions use a `field: value` label rendered in Plex Mono with `--accent-policy`, e.g. `objective:`, `constraints:`, `privacy:`. This is appropriate *because* the content genuinely maps to policy schema fields — it encodes real information, not decoration.
- **Cards/panels:** minimal border-radius (4px) — enough to soften, not enough to feel "app-like." Hairline 1px borders in `--border`, no heavy shadows. Depth comes from background-layer contrast (`bg-base` → `bg-panel` → `bg-panel-raised`), not elevation shadows.
- **Density:** this is an infrastructure product for builders and DAOs — embrace information density in product UI (tables, live constraint bars, execution logs). In marketing contexts (deck, one-pager), allow more whitespace to let the policy-block motif breathe.

---

## 5. Signature Element

**The Policy → Vault pipeline strip.** A horizontal flow diagram rendered with Plex Mono node labels (`policy`, `agents`, `constraints`, `vault`), connected by thin directional lines. One node — representing encrypted state — is rendered with a subtle frosted/blur scrim in `--accent-privacy` at low opacity, visually demonstrating the privacy primitive without needing an explanatory icon. This element appears once, prominently, in the hero of the deck and the one-pager header — everywhere else, restraint.

---

## 6. Iconography & Imagery

- No 3D renders, no abstract orbs/spheres, no rocket/moon imagery.
- Where icons are needed, use a thin-stroke (1.5px) line icon set, monochrome in `--text-secondary`, with `--accent-policy` or `--accent-privacy` reserved for active/selected states only.
- Diagrams (architecture, pipeline flows) are line-based, monospace-labeled, on `--bg-panel` — they should look like they could be pasted directly into the PRD, reinforcing that the brand *is* the spec.

---

## 7. Voice & Tone

- Write from the policy's perspective where possible: "Your vault enforces..." not "Krypton's AI will...".
- Avoid hedge-fund language entirely: no "alpha," "returns," "managed," "fund." Use "policy," "constraint," "execution," "proof."
- Status/error copy is factual and specific: "Rejected — leverage 2.3x exceeds policy max 2.0x" not "Something went wrong."
- Numbers are never decorative. Every stat shown must trace to a defined metric in the PRD (drawdown %, leverage, TVL floor, etc.).

---

## 8. Reference Points (and why we diverge)

- **Phantom** (consumer wallet): exceptional at making complex chain interactions feel safe and simple via transaction previews and clean iconography — Krypton borrows the *clarity* principle (always show what will happen before it happens, especially for Level 2 advisory approvals) but rejects the rounded, gradient-forward consumer-app visual language in favor of a flatter, document-like surface appropriate for an infrastructure/DAO audience.
- **Kamino / Drift-class DeFi dashboards:** dense data tables and live metrics are the right reference for the product UI (§4 density principle) — but their visual identities lean generic-dark-dashboard; Krypton differentiates via the policy-block motif and the two-accent meaning system.
- **AI agent dashboards (2026 cohort):** many lean into "neural network" visual metaphors (node graphs, glowing connections) to signal "AI." Krypton deliberately avoids this — the AI is positioned as an interpreter of a human-readable spec, so the visual metaphor is the *document*, not the *network*.
