# Frontend build instructions — Trade compliance co-pilot (React + TypeScript)

> **Audience:** an AI coding agent building the web client from scratch.
> **Read this whole file before writing code.** The API contract in §8 is owned by the backend — match it exactly. The guardrails in §9 encode product non-negotiables; treat them as hard requirements.

---

## 1. Mission

A self-serve web client that walks an EU/UK SME through one cross-border shipment (EU↔UK lane): login → start a shipment → describe goods or upload an invoice → confirm what we read → step through classification, screening, cost, and rules of origin → reach completed documents (flagship: the **statement on origin**) → see the big-view report.

The audience is a non-expert ops/finance person doing this for the first time. The interface's job is **guidance to completion**, in plain language, with honest confidence signals — not a dump of customs jargon.

---

## 2. Tech stack (use exactly this unless blocked)

- **React 18 + TypeScript**, **Vite**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **TanStack Query** for all server state; **React Router** for routing
- **react-hook-form** + **zod** for forms and validation (zod schemas mirror API types)
- **lucide-react** for icons
- A generated/typed **API client** (see §8). Prefer OpenAPI-generated types from the backend if available; otherwise hand-write typed fetch wrappers.

No Redux/MobX — server state lives in TanStack Query, local UI state in component state/context. No CSS-in-JS.

---

## 3. Project structure

```
src/
  main.tsx, App.tsx, router.tsx
  lib/
    api/            # typed client, one file per domain, mirrors backend contract
    queryClient.ts
    confidence.ts   # ConfidenceTier type + tier→style mapping (single source of truth)
  components/
    ui/             # shadcn components
    common/         # ConfidenceBadge, SectionCard, StatusPill, MarginBar, Stepper...
  features/
    auth/
    shipments/
    intake/
    classification/
    screening/
    cost/
    origin/
    documents/
    report/
  routes/           # page components per route
  styles/
```

Each `features/*` folder owns its hooks (TanStack Query), components, and types for that domain.

---

## 4. Design system

Ground the look in the subject — this is customs and trade documentation, where **precision and trustworthiness are the brand**. Avoid the generic AI-SaaS defaults (cream + serif + terracotta; black + acid accent; broadsheet hairlines). Aim for a calm, document-grade, instrument-panel feel: confident, legible, quietly authoritative.

**Signature element:** commodity codes, origin percentages, REX numbers, and margins are the heartbeat of the product. Render them in a deliberate **tabular monospace** treatment (aligned digits, subtle background chip). The codes *are* the visual identity — let them carry it. Everything else stays quiet around them.

**Starting tokens** (a direction, not a cage — refine, but don't drift into the defaults above):
- Palette: a deep ink/navy as primary, a clean off-white surface, one restrained accent, and **functional status colors that are reserved strictly for confidence/state** (see below).
- Type: a precise, slightly technical sans for UI/body; a distinct display weight for headings; a tabular monospace for codes/numbers.
- Spacing: generous, document-like; clear sectioning via cards with hairline borders.

**Confidence tiers are functional color — never decorative.** Map once in `lib/confidence.ts` and use everywhere:

| Tier | Meaning | Use |
|---|---|---|
| `high` | Official / deterministic | success/green — facts from official tariff |
| `verify` | Depends on attested facts | warning/amber — origin eligibility, VAT mechanics |
| `needs_human` | Cannot be auto-resolved | danger/red — the evidence cliff, BOI route |

`<ConfidenceBadge tier={...} reason={...} />` is the canonical component. Do not invent ad-hoc colored labels elsewhere.

**Copy rules:** sentence case, active voice, plain verbs. Name things by what the user controls ("Request supplier's declaration", not "trigger declaration workflow"). Errors explain what happened and the next step. Empty states invite the next action. A button's label matches the result it produces.

---

## 5. Shared components to build first

- **`ConfidenceBadge`** — tier → color + label + optional tooltip reason.
- **`SectionCard`** — titled card with icon, optional confidence badge, body; the report and steps are built from these.
- **`StatusPill`** — clear / hit / ready / blocked / pending.
- **`MarginBar`** — horizontal bar showing non-originating % vs a cap line, with a proven segment and an unproven (amber) segment crossing the line. (Mirrors the origin-check mockup.)
- **`Stepper`** — vertical guided-completion stepper for documents, each step with state and a next-action button.
- **`HeadlineChips`** — the four big-view chips (duty status, VAT, screening, origin).
- **`FieldConfirmTable`** — editable table of extracted fields with per-field confidence flags.
- **`BomTable`** — editable bill-of-materials with origin + supplier-declaration status per row.

---

## 6. Routes / screens (map to the journey)

```
/login                         → request magic link / verify
/                              → shipments list + "Start a shipment"
/shipments/new                 → choose entry path (Describe | Upload invoice)
/shipments/:id                 → shipment workspace (left nav of steps + section panel)
   ├─ intake (describe | invoice → extraction → confirm fields)
   ├─ classification            → Q&A assistant → candidate code + confidence + override
   ├─ screening                 → parties + outcomes
   ├─ cost                      → landed cost, VAT-forward
   ├─ origin                    → rule + BomTable + evaluate → MarginBar result
   └─ documents                 → required set; per-doc guided-completion Stepper
/shipments/:id/report          → big-view report (the funnel artifact)
```

The workspace is a single shipment with a step rail; users can move between steps but the UI nudges the deliberate order (classification → screening → cost → origin → documents).

---

## 7. Key screen behaviors

**Intake.** Two cards: "Describe your goods" (free text) and "Upload an invoice". Invoice upload shows an extraction-in-progress state, then a **`FieldConfirmTable`**. Low-confidence fields are visibly flagged. A prominent "Confirm and continue" gate — nothing downstream is reachable until confirmed.

**Classification.** Plain-language Q&A, one question at a time. Result: candidate code in the monospace code treatment + `ConfidenceBadge` + the official duty/VAT/controls pulled from the backend. An "I'll set the code myself" override path. When clear, show the green "not dual-use — no export licence required" result explicitly (the tool gives all-clears, not just warnings).

**Cost.** Lead with **import VAT**, large, then explain reclaim/PVA so the user understands it's usually net-zero cash. Show duty as conditional when preference applies (£0 *if origin qualifies*) with the MFN fallback beside it. For intra-EU lanes, render the collapsed "free circulation — no customs" state, not a full cost table.

**Origin.** Show the retrieved rule in plain language. `BomTable` for inputs. "Evaluate" → result with a **`MarginBar`** (proven vs unproven segments against the cap) and, on a fail-on-evidence, the single fix: the pending supplier declaration that flips it, with a "Request supplier's declaration" action. Surface conservative-default messaging ("we never assume in your favour").

**Documents.** List required documents with `StatusPill`s. Each opens a **`Stepper`** guided-completion flow. The **statement-on-origin** stepper is the flagship: confirm preference → resolve evidence gaps (request declarations) → REX-threshold check → generate draft → **explicit user certification** (a real, deliberate sign-off action) → stored. Never present a document as certified without the user's explicit action.

**Report.** `HeadlineChips` + a `SectionCard` per section, each with its `ConfidenceBadge`, rendered straight from `GET /report`. Viewable before documents are complete — it's the hook. Footer carries the "not a customs ruling / verify before shipping" disclaimer from the API.

---

## 8. API contract (owned by backend — match exactly)

Base: `/api/v1`. Bearer JWT on all `/shipments/**`. Build a typed client per domain mirroring these:

```
POST /auth/request-link {email}
POST /auth/verify {token} -> {access, refresh}
GET  /me

POST /shipments {name} -> Shipment
GET  /shipments -> Shipment[]
GET  /shipments/{id} -> Shipment(with section statuses)
PATCH /shipments/{id} {fields}

POST /shipments/{id}/intake/describe {text} -> {classificationSeed, prefilled}
POST /shipments/{id}/intake/invoice (multipart) -> {jobId}
GET  /shipments/{id}/extraction -> {fields, perFieldConfidence, status, confirmed}
POST /shipments/{id}/confirm-fields {fields}

POST /shipments/{id}/classify/start -> {question}
POST /shipments/{id}/classify/answer {questionId, answer} -> {question? | candidate?}
GET  /shipments/{id}/classification -> {hsCode, confidence, confidenceReason, officialData, dualUseFlag}
PUT  /shipments/{id}/classification {hsCode}

POST /shipments/{id}/screening/run -> ScreeningResult[]
GET  /shipments/{id}/screening -> ScreeningResult[]

GET  /shipments/{id}/cost -> CostBreakdown   # VAT-forward; duty conditional

GET  /shipments/{id}/origin/rule -> {ruleType, plainLanguage, ...}
PUT  /shipments/{id}/origin/bom {items: BomItem[]}
POST /shipments/{id}/origin/evaluate -> OriginResult  # qualifies, nonOriginatingPct, capPct, marginPct, blockingItems
GET  /shipments/{id}/origin -> OriginResult

GET  /shipments/{id}/documents -> DocumentSummary[]
GET  /shipments/{id}/documents/{docType} -> {status, steps, draft, blocker}
POST /shipments/{id}/documents/{docType}/generate -> {draft}
POST /shipments/{id}/documents/{docType}/request-declaration {supplier} -> {ok}
POST /shipments/{id}/documents/{docType}/certify -> {status: "certified", certifiedAt}

GET  /shipments/{id}/report -> {lane, chips, sections[{key, confidence, data}], disclaimer}
```

Every section/judgment response includes `confidence: "high" | "verify" | "needs_human"`. Render it. Mirror response shapes as zod schemas in `lib/api`.

---

## 9. Guardrails for the agent (do not violate)

1. **Confidence is always visible.** Any classification, origin, or control result renders a `ConfidenceBadge`. Never display a judgment as plain fact when the API marks it `verify`/`needs_human`.
2. **Certification is an explicit user act.** The certify button is deliberate (confirm dialog), distinct from "generate". Never auto-advance a document to certified. Never imply the app certifies on the user's behalf.
3. **Confirm-before-compute.** Classification/cost/origin screens are gated until `extraction.confirmed === true`; show the confirm step if not.
4. **Lead with VAT, not duty**, on the cost screen. Duty is conditional when preference applies.
5. **Conservative origin messaging** is shown verbatim from the API — don't soften "treated as non-originating until proven."
6. **Disclaimers render** wherever the API sends them; never strip "not a customs ruling".
7. **Intra-EU collapse**: if lane is EU↔EU, render the simplified no-customs state, not the full workspace.
8. **No fabricated numbers.** The client never computes duty/VAT/origin locally — it displays backend values. `MarginBar` visualizes server-provided percentages only.
9. **Accessibility floor**: keyboard focus visible, labels on inputs, color never the sole signal (pair status color with an icon/text), reduced-motion respected.

---

## 10. Build order (milestones)

1. **M0 — Shell:** Vite + TS + Tailwind + shadcn + router + TanStack Query + typed API client scaffold. `lib/confidence.ts` and `ConfidenceBadge` first.
2. **M1 — Auth:** magic-link request + verify + token storage + authed fetch + route guards.
3. **M2 — Shipments:** list, create, workspace shell with the step rail.
4. **M3 — Intake:** both entry paths, extraction state, `FieldConfirmTable`, confirm gate.
5. **M4 — Classification + Cost:** Q&A assistant, candidate + confidence + override; VAT-forward cost screen (+ intra-EU collapse).
6. **M5 — Screening:** parties + outcomes + blocked state.
7. **M6 — Origin:** rule display, `BomTable`, `MarginBar` result, fail-on-evidence fix action.
8. **M7 — Documents:** document list + `Stepper`; the statement-on-origin guided-completion flow with explicit certify.
9. **M8 — Report:** `HeadlineChips` + section cards from `GET /report`.

Ship M0–M5 as a usable slice (login → code → cost) before M6–M8.

---

## 11. Quality bar

- Responsive to mobile; the workspace step rail collapses gracefully.
- Loading and empty states everywhere (no spinners-on-blank — show skeletons and inviting empty states with the next action).
- Error states explain and offer a retry; auth expiry refreshes silently then re-tries.
- One golden flow tested (Cypress/Playwright): login → upload invoice → confirm → classify → cost → origin → certify statement on origin → report.

---

## 12. Open decisions to surface (don't silently choose)

- Final palette/type direction — propose 1–2 options to the founder before locking; keep within the "document-grade, precise, not the AI defaults" brief.
- Whether to generate API types from the backend's OpenAPI schema (preferred) or hand-maintain them.
- File-upload UX for invoices (drag-drop + size/type limits) and how multi-page PDFs are previewed.
