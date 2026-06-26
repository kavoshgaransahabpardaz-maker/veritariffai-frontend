# Frontend Agent Change Log

> **For the frontend agent:** This file contains every API change, schema change, and new endpoint added to the backend. Read this file before implementing any new frontend feature. Each entry includes what changed, what the frontend must do, and the response shape.
>
> **For the backend agent:** Update this file whenever an endpoint path, method, request body, response schema, enum value, or auth requirement changes.

---

## Base URL
```
https://api.veritariffai.co/api/v1
```
Development: `http://localhost:8000/api/v1`

---

## Authentication

All endpoints except `/auth/*` require:
```
Authorization: Bearer <access_token>
```

Access token expires in 15 minutes. Use refresh token to get a new one.

---

## Change Log

---

### 2026-06-25 — Steel MVP Changes

#### 1. Classification response — `dual_use_flag` REMOVED
**Breaking change.**

`GET /shipments/{id}/classification` response no longer includes `dual_use_flag`.

New response shape:
```json
{
  "id": "uuid",
  "shipment_id": "uuid",
  "hs_code": "7208",
  "description": "Hot-rolled flat coil, non-alloy steel, 600mm+ width",
  "confidence": "HIGH",
  "source": "assistant",
  "official_data_json": null,
  "controls_json": null,
  "citation_chain_json": [
    {
      "gate_id": "g_material_grade",
      "test": {"attribute": "material_grade", "op": "passthrough", "value": null},
      "outcome": "non_alloy",
      "citations": [
        {"ref": "Ch72 Note 1(d)", "text": "Steel — Ferrous materials..."}
      ]
    }
  ],
  "auto_resolved": true,
  "candidate_codes_json": null,
  "tree_version": "1.0.0",
  "nomenclature_version": "2024",
  "created_at": "2026-06-25T12:00:00Z"
}
```

**Frontend action:** Remove `dual_use_flag` field. Add citation chain display (collapsible). Show `auto_resolved` badge. Show `tree_version` + `nomenclature_version` in tooltip.

---

#### 2. Origin result — new melt-and-pour fields
**Additive (non-breaking).**

`GET /shipments/{id}/origin` response now includes:
```json
{
  "melt_country": "GB",
  "pour_country": "DE",
  "disqualifying_reason": null,
  "citations_json": ["TCA Annex ORIG-4 Article 5"]
}
```

`melt_country` / `pour_country` are ISO 3166-1 alpha-2 codes or null.

**Frontend action:** Show melt-and-pour origin section in origin tab. If both countries present → "TCA Melt-and-Pour Origin Verified". If `disqualifying_reason` is set → show warning.

---

#### 3. New endpoint — melt-and-pour determination
**New endpoint.**

```
POST /shipments/{id}/origin/melt-and-pour
```

No request body. Reads MTC for the shipment and evaluates TCA melt-and-pour origin.

Response:
```json
{
  "eligible": true,
  "melt_country": "GB",
  "pour_country": "DE",
  "confidence": "VERIFY",
  "disqualifying_reason": null,
  "citations": ["TCA Annex ORIG-4 Article 5"]
}
```

**Frontend action:** Add "Determine Melt-and-Pour Origin" button in origin tab. Show result inline. `confidence` is always `VERIFY` — never auto-accepted without user confirmation.

---

#### 4. Document type — renamed `statement_on_origin` → `statement_of_origin`
**Breaking change for document type enum.**

Old: `statement_on_origin`
New: `statement_of_origin`

New doc types added: `mtc_audit_report`, `barristers_bundle`

**Frontend action:**
- Update any hardcoded `statement_on_origin` strings to `statement_of_origin`
- Display label: "Statement of Origin (TCA ORIG-4)"
- Add icons/labels for `mtc_audit_report` and `barristers_bundle` in document list

---

#### 5. Cost breakdown — new fields
**Additive (non-breaking).**

`GET /shipments/{id}/cost` response now includes:
```json
{
  "safeguard_quota_json": {
    "applicable": true,
    "category": "1A",
    "in_quota_rate": "0%",
    "out_of_quota_rate": "25%",
    "quota_exhausted": false
  },
  "citations_json": ["UK Safeguard Measure SI 2019/449"]
}
```

**Frontend action:** Add safeguard quota section in cost breakdown. Show in/out-of-quota rate comparison.

---

#### 6. New endpoints — MTC (Mill Test Certificate)

**Upload MTC:**
```
POST /shipments/{id}/intake/mtc
Content-Type: multipart/form-data
Body: file (PDF/image)
```
Response:
```json
{
  "id": "uuid",
  "status": "pending",
  "heat_number": "HT-2024-001",
  "melt_country": "GB",
  "pour_country": "GB",
  "chemical_composition_json": {"C": 0.18, "Mn": 1.5, "Si": 0.35, "Cr": 0.0},
  "mechanical_properties_json": {"tensile_strength_mpa": 550},
  "per_field_confidence_json": {"chemical_composition": 0.9}
}
```

**Get MTC:**
```
GET /shipments/{id}/mtc
```
Same response shape.

**Confirm MTC:**
```
POST /shipments/{id}/mtc/confirm
Body: {"overrides": {"melt_country": "GB"}}
```

**Review tasks:**
```
GET /shipments/{id}/review-tasks
```
Response:
```json
[
  {
    "id": "uuid",
    "task_type": "hs_classification",
    "status": "pending",
    "reason": "missing_attribute: form_family",
    "context_json": {...},
    "created_at": "2026-06-25T12:00:00Z"
  }
]
```

**Frontend action:** Add MTC upload step in shipment workflow (before classification). Show confidence indicators per field. Show review tasks queue for operations team.

---

#### 7. New endpoints — Barrister's Bundle

```
POST /shipments/{id}/bundle/generate
```
No body. Assembles all evidence, encrypts (AES-256-GCM), returns:
```json
{
  "id": "uuid",
  "status": "ready",
  "sha256": "abc123...",
  "manifest_json": {
    "sections": ["mtc", "classification", "origin", "cost", "screening"],
    "generated_at": "2026-06-25T12:00:00Z"
  },
  "disclaimer": "This bundle has been assembled to support demonstration of reasonable care..."
}
```

```
GET /shipments/{id}/bundle
```
Same response shape.

**Frontend action:** Add "Generate Bundle" button in shipment detail. Show SHA-256 hash for integrity. Always display disclaimer. Bundle download → decrypt on frontend if needed (key management TBD).

---

#### 8. New endpoint — Safeguard Quota

```
GET /shipments/{id}/quota
```
Response:
```json
{
  "hs_code": "7208",
  "status": "unknown",
  "confidence": "VERIFY",
  "quota_data": null,
  "note": "Real-time quota source not yet connected"
}
```

**Frontend action:** Show quota chip in report. `status=unknown` → amber chip with tooltip "Quota data not yet available — verify manually".

---

### 2026-06-26 — Steel HS Classification Pipeline

#### 9. Classification start — new response fields
**Additive (non-breaking).**

`POST /shipments/{id}/classify/start` response now includes extra fields beyond `QAResponse`:
```json
{
  "question": "",
  "options": null,
  "state_token": "",
  "is_complete": true,
  "candidate_code": "7208",
  "confidence": "HIGH",
  "citation_chain": [
    {
      "gate_id": "g_material_grade",
      "citations": [{"ref": "Ch72 Note 1(d)", "text": "..."}],
      "outcome": "non_alloy"
    }
  ],
  "auto_resolved": true,
  "why_text": "Candidate code 7208 — Flat-rolled products of iron or non-alloy steel..."
}
```

When a question is needed (missing attribute):
```json
{
  "question": "ask:form_family",
  "options": ["flat", "long", "wire", "tube", "other"],
  "is_complete": false,
  "candidate_code": null,
  "confidence": "NEEDS_HUMAN"
}
```

**Frontend action:**
- If `is_complete: true` → show classified code + citation chain accordion
- If `question` contains `ask:<attribute>` → show attribute picker with allowed values
- Show `confidence` badge: HIGH (green), VERIFY (amber), NEEDS_HUMAN (red)
- Show `why_text` as plain-English explanation below the code
- If `auto_resolved: false` → show "Awaiting review" banner

---

#### 10. ConfidenceTier values (canonical)

| Value | Display | Color | Meaning |
|-------|---------|-------|---------|
| `HIGH` | High Confidence | Green | MTC composition + all attributes ≥ 0.8 confidence |
| `VERIFY` | Needs Confirmation | Amber | Some attributes inferred; user must confirm |
| `NEEDS_HUMAN` | Requires Review | Red | Missing/conflicting data or GRI-3 complexity |

---

## Current API Surface (full list)

### Auth
| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/google` | No |
| GET | `/auth/google/callback` | No |
| POST | `/auth/refresh` | No |
| POST | `/auth/magic-link` | No |
| GET | `/auth/magic-link/verify` | No |

### Shipments
| Method | Path | Auth |
|--------|------|------|
| POST | `/shipments` | Yes |
| GET | `/shipments` | Yes |
| GET | `/shipments/{id}` | Yes |
| DELETE | `/shipments/{id}` | Yes |

### Intake & Extraction
| Method | Path | Auth |
|--------|------|------|
| POST | `/shipments/{id}/intake` | Yes |
| POST | `/shipments/{id}/intake/mtc` | Yes |

### Classification
| Method | Path | Auth |
|--------|------|------|
| POST | `/shipments/{id}/classify/start` | Yes |
| POST | `/shipments/{id}/classify/answer` | Yes |
| GET | `/shipments/{id}/classification` | Yes |
| PUT | `/shipments/{id}/classification` | Yes |

### MTC
| Method | Path | Auth |
|--------|------|------|
| GET | `/shipments/{id}/mtc` | Yes |
| POST | `/shipments/{id}/mtc/confirm` | Yes |
| GET | `/shipments/{id}/review-tasks` | Yes |

### Origin
| Method | Path | Auth |
|--------|------|------|
| GET | `/shipments/{id}/origin` | Yes |
| POST | `/shipments/{id}/origin/evaluate` | Yes |
| POST | `/shipments/{id}/origin/melt-and-pour` | Yes |

### Cost
| Method | Path | Auth |
|--------|------|------|
| GET | `/shipments/{id}/cost` | Yes |
| POST | `/shipments/{id}/cost` | Yes |

### Screening
| Method | Path | Auth |
|--------|------|------|
| POST | `/shipments/{id}/screening` | Yes |
| GET | `/shipments/{id}/screening` | Yes |

### Documents
| Method | Path | Auth |
|--------|------|------|
| POST | `/shipments/{id}/documents` | Yes |
| GET | `/shipments/{id}/documents` | Yes |
| POST | `/shipments/{id}/documents/generate` | Yes |

### Bundle
| Method | Path | Auth |
|--------|------|------|
| POST | `/shipments/{id}/bundle/generate` | Yes |
| GET | `/shipments/{id}/bundle` | Yes |

### Quota
| Method | Path | Auth |
|--------|------|------|
| GET | `/shipments/{id}/quota` | Yes |

### Report
| Method | Path | Auth |
|--------|------|------|
| GET | `/shipments/{id}/report` | Yes |

### Ops
| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | No |

---

## Error Response Shape

All errors follow:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Shipment not found"
  }
}
```

Common error codes: `NOT_FOUND`, `VALIDATION_ERROR`, `UNAUTHORIZED`, `EXTERNAL_SERVICE_ERROR`
