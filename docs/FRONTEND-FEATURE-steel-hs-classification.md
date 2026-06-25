# Frontend feature spec — Steel HS classification UI (`features/classification/`)

> **Audience:** the AI agent working on the existing Veritariff React/TS client.
> **This is an ADD/REPLACE against code you already have.** It replaces the generic classification screen with the steel disambiguation flow + citation chain, and reuses your existing `ConfidenceBadge`, `SectionCard`, the tabular-mono code treatment, TanStack Query setup, and the confidence-tier system in `lib/confidence.ts`.
> **Match the backend feature spec** (`BACKEND-FEATURE-steel-hs-classification.md`) — its `/classify/*` contract and `HIGH | VERIFY | NEEDS_HUMAN` model are the source of truth.
> **The differentiator on this screen is the citation chain.** A code with no visible legal "why" should look incomplete. This is the UI that makes the Barrister's Bundle credible — treat it as a primary element, never a hidden detail.

---

## 1. How it fits the existing client

- Lives in `features/classification/` (owns its hooks, components, types).
- Reuses `ConfidenceBadge`, `SectionCard`, `StatusPill`, the mono code treatment, and `lib/confidence.ts`.
- **Consumes MTC-derived data:** when the MTC has already given the steel grade (non-alloy / alloy / stainless from composition), show it as a **pre-filled, cited attribute — not a question.** Never ask the user something the certificate already answered.
- Drops the generic "not dual-use — no export licence required" all-clear (wrong control surface for steel) in favour of a steel `ControlsPanel`.

---

## 2. The three outcomes drive the whole screen

The backend returns one of three confidence states. The UI is fundamentally a switch on this:

| State | UI | Code presented? |
|---|---|---|
| `HIGH` (auto-resolved) | green `CodeResult` + full `CitationChain` + "auto-resolved" badge; override still available | Yes, as resolved |
| `VERIFY` | amber `CodeResult` + `CitationChain` + a clear "confirm this code" action | Yes, as **pending confirmation** |
| `NEEDS_HUMAN` | `ReviewRoutedBanner`; **no code shown as settled** | No — routed to human review |

Never render a `NEEDS_HUMAN` result as if it were an answer. Never auto-confirm a `VERIFY` result.

---

## 3. Components to add

- **`ClassificationFlow`** — orchestrator. Starts the flow, renders either a `GateQuestion` or a result, manages the Q&A loop via the `/classify/*` hooks.
- **`AttributeSummary`** — what was extracted: grade, form, dimensions, processing — each with its per-attribute confidence and **source tag** (`from MTC` / `from invoice` / `you answered`). The MTC-derived grade shows as e.g. *"Alloy steel — read from your Mill Test Certificate"* with its citation.
- **`GateQuestion`** — one disambiguation question at a time (the "gates"), in plain language, with 2–4 mutually-exclusive options as buttons (e.g. "Is this hot-rolled or cold-rolled?"). Maps to a backend gate's branches.
- **`CodeResult`** — the resolved/candidate code in the **tabular-mono signature treatment**, with `ConfidenceBadge`, the auto-resolved indicator, and the override entry point.
- **`CitationChain`** — the ordered legal path that produced the code: for each gate, the applied test → outcome → legal reference (e.g. *"Composition → alloy → Ch72 Note 1(f)"*). This is the plain-English "why". Prominent, expandable to full note text. **Reused on the report and folded into the bundle.**
- **`CandidateAlternatives`** — when the result isn't unique, a ranked short-list the user can pick from (each with its own mini-rationale).
- **`ControlsPanel`** — steel-relevant controls (e.g. safeguard measures) surfaced from `controls`. Replaces the dual-use all-clear.
- **`ReviewRoutedBanner`** — shown on `NEEDS_HUMAN`: explains the item went to expert review (frame as quality assurance, not failure), the expected wait, and what the user can do meanwhile.
- **`OverrideCode`** — manual code entry; records that the user overrode (the backend stamps provenance).

---

## 4. The flow (what `ClassificationFlow` does)

```
mount → POST /classify/start
   ├─ response is {question}  → render GateQuestion
   │     user picks option → POST /classify/answer → {question?} | {candidate...}
   │     loop until a candidate/result returns
   └─ response is {candidate, confidence, citationChain, ...} → render result by state (§2)

always visible alongside: AttributeSummary (what we know so far + sources)
```

- Pre-fill from MTC/invoice: if `/classify/start` already returns a candidate (because the MTC + invoice gave enough attributes), skip straight to the result — don't force questions the data already answered.
- One question per screen. Plain language. No HS jargon in the question text.

---

## 5. Citation chain — the centerpiece (don't bury it)

`CitationChain` renders the ordered gates that led to the code. Each row: the attribute tested, the outcome, and the legal reference, e.g.:

```
Composition → alloy steel        Ch72 Note 1(f)
Form         → flat-rolled        Heading 7208 text
Processing   → hot-rolled, ≥4.75mm Subheading 7208.51
```

- Each legal reference is expandable to the actual note/heading text (from the backend).
- Render it on the classification screen **and** as a `SectionCard` on the report.
- This is the artifact that answers "explain this to my CFO and to HMRC" — give it visual weight, not a collapse-by-default accordion.

---

## 6. Confidence + controls

- Every `CodeResult` carries a `ConfidenceBadge` mapped from the API tier. Never show a code without it.
- `VERIFY` requires a deliberate "Confirm this code" action before the shipment treats classification as settled. The user reviews the citation chain first.
- `ControlsPanel`: render steel controls from `controls`; when none apply, an explicit green "no steel import/export restriction on this code" is fine — the tool gives all-clears when warranted, but a **steel-relevant** one, not dual-use.

---

## 7. API calls (from backend feature spec §8)

```
POST /shipments/{id}/classify/start
   -> {question} | {candidate, confidence, citationChain, ...}
POST /shipments/{id}/classify/answer {questionId, answer}
   -> {question} | {candidate, confidence, citationChain, alternatives}
GET  /shipments/{id}/classification
   -> {hsCode, confidence, confidenceReason, citationChain, controls, autoResolved, candidateCodes, treeVersion, nomenclatureVersion}
PUT  /shipments/{id}/classification {hsCode}   # override
```
Update zod schemas: `Classification` gains `citationChain`, `controls`, `autoResolved`, `candidateCodes`, `treeVersion`, `nomenclatureVersion`; drops `dualUseFlag`. `/classify/answer` may return either a question or a result — model it as a discriminated union.

---

## 8. Guardrails (do not violate)

1. **Citation chain always visible.** A resolved/candidate code renders its `CitationChain`. A code with no chain should read as incomplete, never authoritative.
2. **Never present `NEEDS_HUMAN` as an answer.** Show `ReviewRoutedBanner`; don't render a code as settled.
3. **Never auto-confirm `VERIFY`.** Confirmation is a deliberate user act after they've seen the chain.
4. **Don't re-ask what the MTC answered.** MTC-derived attributes are pre-filled and cited, not questions.
5. **Confidence badge mandatory** on every code result.
6. **Steel controls, not dual-use.** Use `controls`; drop the export-licence all-clear copy.
7. **Override always available**, on every state, recorded via `PUT`.
8. **No locally-computed codes.** The client only displays backend results; it never derives or guesses a code.
9. **Mono signature treatment** for the code, alternatives, and any thresholds — consistent with the design system.

---

## 9. Build order

1. **`AttributeSummary`** — render extracted attributes + sources (pre-fill from MTC).
2. **`GateQuestion` + `ClassificationFlow`** — the disambiguation Q&A loop.
3. **`CodeResult` + `CitationChain`** — the result and the visible "why".
4. **Confidence-state handling** (§2) + `ReviewRoutedBanner` for `NEEDS_HUMAN`.
5. **`CandidateAlternatives` + `OverrideCode`.**
6. **`ControlsPanel`** (replace dual-use all-clear).

Ship 1–4 as the usable classifier UI; 5–6 complete it.

---

## 10. Open decisions (founder)

- How prominently to surface the human-review wait — frame it as expert quality assurance, with an honest expected turnaround.
- Whether `CitationChain` shows full note text inline or on expand by default (lean: summary inline, full text on expand).
- Multi-line-item shipments (multiple steel SKUs) — out for v1; design the screen so it doesn't assume a single classification forever.
