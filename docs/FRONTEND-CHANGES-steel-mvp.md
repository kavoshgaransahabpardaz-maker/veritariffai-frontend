# Frontend changes — Generic → Steel MVP (Veritariff)

> **Audience:** the AI agent that built the generic client. This is a **delta**, not a rewrite. Apply against the existing React/TS codebase.
> **Framing:** KEEP = no change. CHANGE = modify existing. ADD = new. DEFER = remove from MVP, keep the seam.
> Match the backend change-set (`BACKEND-CHANGES-steel-mvp.md`) — the API contract there is the source of truth.

---

## 0. The one conceptual shift (mirrors the backend)

The generic Origin screen is built around a **bill of materials + a margin bar** (non-originating value % vs a cap). **Steel doesn't work that way.** Steel preferential origin is decided by **melt-and-pour country, read from the Mill Test Certificate (MTC)** — a country-based yes/no, not a percentage.

So the Origin screen's centrepiece changes from `BomTable` + `MarginBar` to a **Melt-and-Pour determination panel** fed by the MTC. The `MarginBar` isn't deleted (you'll reuse it when value/CTH rules return post-steel), but it's not the steel path.

---

## 1. KEEP unchanged (the spine)

- Tech stack (§2), project structure (§3 — extend `features/`, don't restructure).
- `lib/confidence.ts` + `ConfidenceBadge` — the whole confidence-tier system is correct.
- Shared components: `SectionCard`, `StatusPill`, `Stepper`, `FieldConfirmTable` (extend), `HeadlineChips` (re-content).
- Copy rules, accessibility floor, loading/empty/error discipline.
- Guardrails 1, 2, 3, 5, 6, 8, 9.
- Auth, shipments list, workspace shell.

---

## 2. CHANGE existing screens

### 2.1 Mission
Rewrite §1 to the steel framing: a UK steel SME goes from **invoice + MTC → certified Statement of Origin + Barrister's Bundle**, in time for the October melt-and-pour deadline.

### 2.2 Intake — add MTC as a primary input
- The intake step now expects **invoice + Mill Test Certificate(s)**. Add an MTC upload card alongside the invoice card.
- **De-emphasise the "Describe your goods" path** — keep it, but invoice+MTC is the steel flow.
- Extend `FieldConfirmTable` to show **MTC fields**: heat number, **melt-and-pour country**, chemical composition, mechanical properties — each with its per-field confidence flag. Confirm-before-compute gate unchanged.

### 2.3 Classification — steel tree + citations
- Q&A is now the **steel decision tree (Ch 72/73)**; same endpoints, narrower domain.
- **Replace** the "not dual-use — no export licence required" all-clear with **steel-relevant controls** (e.g., safeguard measures). Wrong control surface for steel.
- **Add a `CitationChain` display** — every classification shows its grounding citations (the plain-English "why"). A code with no citations should look wrong.

### 2.4 Cost — VAT-forward → duty + quota-forward
- Lead with **duty (conditional on origin) + safeguard quota status**, not VAT.
- Add a `QuotaStatus` panel (status, headroom, near/over-limit flag).
- Keep VAT, demote it to cost-detail. Update guardrail 4 (see §5).
- Intra-EU collapse: leave as-is but it's an edge case for steel.

### 2.5 Origin — BomTable/MarginBar → Melt-and-Pour panel
- Replace the steel-path centrepiece with a **`MeltPourCard`**: shows melt country, pour country (from the MTC), the TCA steel rule in plain language, and a clear **qualifies / does-not-qualify / needs-review** result with the disqualifying reason.
- Keep conservative-default messaging ("we never assume in your favour"): if melt-and-pour can't be evidenced, show `needs_human`, not a pass.
- Keep `BomTable`/`MarginBar` in the codebase for the value/CTH path, but they are not rendered on the steel flow.

### 2.6 Documents — rename + add steel docs
- Rename **"statement on origin" → "Statement of Origin"** (TCA Annex ORIG-4) throughout UI copy.
- The Statement of Origin `Stepper` flow now keys off the **melt-and-pour result** (not REX/supplier-declaration gaps): confirm origin result → resolve MTC evidence gaps (request human review if needed) → generate ORIG-4 draft → **explicit user certification** → sealed into the bundle.
- Add an **`MtcAuditPanel`** document (the MTC auto-audit report) and a **`BundleExport`** for the Barrister's Bundle.

### 2.7 Report — re-content the chips
Change `HeadlineChips` from `(duty, VAT, screening, origin)` to **`(melt-and-pour origin, safeguard quota, duty/preference, screening)`**. Render from the updated `/report` payload.

---

## 3. ADD new components

- **`MtcUpload`** — MTC file upload with in-progress/extraction state.
- **`MtcAuditPanel`** — extracted composition/properties/heat + **melt-and-pour country**, per-field confidence, with a `HumanReviewBanner` when extraction is sub-threshold.
- **`QuotaStatus`** — safeguard quota chip + detail.
- **`MeltPourCard`** — the steel origin determination (replaces MarginBar on this flow).
- **`CitationChain`** — renders the grounded citations behind any judgment; reused on classification, origin, cost.
- **`BundleExport`** — Barrister's Bundle: shows seal status (SHA-256 signed, AES-256 encrypted), the **"designed to meet the reasonable-care standard"** disclaimer (not "HMRC-accepted"), and download.
- **`HumanReviewBanner`** — surfaced when the backend routes an extraction to human review; explains the wait and the next step.

---

## 4. DEFER (remove from MVP, keep the seam)

- **"Describe goods" as primary intake** — secondary now.
- **`MarginBar` on the steel flow** — kept in code, not rendered for steel.
- **REX / supplier-declaration UI** — secondary (melt-and-pour is MTC-evidenced). Keep the component; off the critical path.
- **Intra-EU collapse** — edge; leave as-is.
- **CBAM / enterprise / API / multi-corridor UI** — out (per MVP PRD §11).

---

## 5. Guardrail edits

- **Edit guardrail 4:** cost leads with **duty + safeguard quota**, not VAT.
- **Add guardrail 10 — Citations visible:** any classification/origin/cost result renders its `CitationChain`. No grounded source → it should read as incomplete, not authoritative.
- **Add guardrail 11 — Bundle honesty:** render the bundle's disclaimer verbatim from the API; never display "HMRC-accepted" until the API marks the barrister opinion obtained.
- **Add guardrail 12 — Melt-and-pour conservatism:** never render a "qualifies" state the API didn't return; `needs_human` shows the review path, not a green pass.
- Keep all other guardrails.

---

## 6. New / changed API calls (from backend change-set §6)

```
POST /shipments/{id}/intake/mtc        -> {jobId}
GET  /shipments/{id}/mtc               -> MTC fields + per-field confidence + status
GET  /shipments/{id}/quota             -> quota status
POST /shipments/{id}/bundle/generate   -> {bundleId}
GET  /shipments/{id}/bundle            -> {status, sha256, disclaimer, downloadRef}
```
Update zod schemas: `OriginResult` gains melt-and-pour fields + nullable percentages; `Classification` gains `citationChain`, drops `dualUseFlag`, gains `controls`; `CostBreakdown` gains `safeguardQuota`; every judgment gains `citations`; `/report` chips change.

---

## 7. Build order for the remaining work (deadline-sequenced)

**Irreducible core first (the October chain):**
1. **MTC intake + `MtcAuditPanel`** (upload, extraction state, melt-and-pour display, `HumanReviewBanner`).
2. **Origin screen refit** → `MeltPourCard` from MTC data.
3. **Statement of Origin** `Stepper` keyed to melt-and-pour + explicit certify.
4. **`BundleExport`** with seal status + disclaimer.

**Then the supporting steel surface:**
5. **`CitationChain`** across classification/origin/cost.
6. **`QuotaStatus`** + report chip.
7. **Steel classification** copy/flow refit (drop dual-use all-clear).
8. **Cost screen refit** (duty + quota forward).

Ship 1–4 before 5–8. If timeline compresses, 1–4 is the product.

---

## 8. Open decisions (founder)

- Final palette/type still within the "document-grade, precise" brief — codes/heat-numbers/percentages stay in the tabular-mono signature treatment.
- MTC upload UX: multi-certificate, multi-page PDF preview, size/type limits.
- How prominently to surface the human-review wait (it's a feature, not a failure — frame it as quality assurance).
