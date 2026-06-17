# Krypton Frontend — Component Patterns

## PolicyBlock

Renders policy schema fields in IBM Plex Mono with `--accent-policy` labels:

```tsx
// Pseudotype — match Style Guide §4
<div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-sm p-4 font-mono text-sm">
  <div><span className="text-[var(--accent-policy)]">objective:</span> maximize_risk_adjusted_return</div>
  <div><span className="text-[var(--accent-policy)]">max_drawdown_pct:</span> 12</div>
</div>
```

## ConstraintBars

Horizontal bars showing current vs limit (drawdown, leverage, concentration). Use `--accent-risk` when &gt; 90% of limit.

## PendingActionCard

Level 2 approval UI:
- Agent rationale (collapsible full transcript link to Arweave)
- Simulation metrics table
- Post-execution constraint preview
- Approve / Reject with wallet sign

## Pipeline strip (landing hero)

Monospace nodes: `policy` → `agents` → `constraints` → `vault` with one node frosted in `--accent-privacy` (Ika signing).

## Voice

Write from policy perspective: "Your vault enforces..." not "Krypton's AI will..."
