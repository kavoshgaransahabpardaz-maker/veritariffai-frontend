# Graph Report - veritarifai-front  (2026-06-24)

## Corpus Check
- 50 files · ~17,112 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 276 nodes · 275 edges · 29 communities (20 shown, 9 thin omitted)
- Extraction: 81% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_TypeScript Compiler Options|TypeScript Compiler Options]]
- [[_COMMUNITY_Node TypeScript Config|Node TypeScript Config]]
- [[_COMMUNITY_Project Dependencies|Project Dependencies]]
- [[_COMMUNITY_Development Dependencies|Development Dependencies]]
- [[_COMMUNITY_Linting Rules and Plugins|Linting Rules and Plugins]]
- [[_COMMUNITY_Build and Dev Scripts|Build and Dev Scripts]]
- [[_COMMUNITY_Frontend Assets and Docs|Frontend Assets and Docs]]
- [[_COMMUNITY_Application Entry Points|Application Entry Points]]
- [[_COMMUNITY_TypeScript Project References|TypeScript Project References]]
- [[_COMMUNITY_Icon Images|Icon Images]]
- [[_COMMUNITY_Project README|Project README]]
- [[_COMMUNITY_React Logo Image|React Logo Image]]
- [[_COMMUNITY_Vite Logo Image|Vite Logo Image]]
- [[_COMMUNITY_Vite Configuration|Vite Configuration]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `apiRequest()` - 17 edges
3. `compilerOptions` - 15 edges
4. `Frontend build instructions — Trade compliance co-pilot (React + TypeScript)` - 13 edges
5. `useAuth()` - 10 edges
6. `cn()` - 8 edges
7. `CostPage()` - 8 edges
8. `IntakePage()` - 8 edges
9. `scripts` - 6 edges
10. `rules` - 3 edges

## Surprising Connections (you probably didn't know these)
- `HTML Entry Point` --references--> `Hero Illustration Image`  [INFERRED]
  index.html → src/assets/hero.png
- `CodeChip()` --calls--> `cn()`  [INFERRED]
  src/components/common/CodeChip.tsx → src/lib/utils.ts
- `ConfidenceBadge()` --calls--> `cn()`  [INFERRED]
  src/components/common/ConfidenceBadge.tsx → src/lib/utils.ts
- `SectionCard()` --calls--> `cn()`  [INFERRED]
  src/components/common/SectionCard.tsx → src/lib/utils.ts
- `Input()` --calls--> `cn()`  [INFERRED]
  src/components/ui/input.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (29 total, 9 thin omitted)

### Community 0 - "TypeScript Compiler Options"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, baseUrl, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 1 - "Node TypeScript Config"
Cohesion: 0.11
Nodes (19): dependencies, class-variance-authority, clsx, @hookform/resolvers, lucide-react, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-scroll-area (+11 more)

### Community 2 - "Project Dependencies"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 3 - "Development Dependencies"
Cohesion: 0.09
Nodes (22): devDependencies, openapi-typescript, oxlint, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+14 more)

### Community 4 - "Linting Rules and Plugins"
Cohesion: 0.09
Nodes (16): CodeChip(), CodeChipProps, ConfidenceBadge(), ConfidenceBadgeProps, SectionCard(), SectionCardProps, StatusPill(), StatusPillProps (+8 more)

### Community 5 - "Build and Dev Scripts"
Cohesion: 0.33
Nodes (5): components, $defs, operations, paths, webhooks

### Community 6 - "Frontend Assets and Docs"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 7 - "Application Entry Points"
Cohesion: 0.12
Nodes (15): 10. Build order (milestones), 11. Quality bar, 12. Open decisions to surface (don't silently choose), 1. Mission, 2. Tech stack (use exactly this unless blocked), 3. Project structure, 4. Design system, 5. Shared components to build first (+7 more)

### Community 12 - "React Logo Image"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 17 - "Community 17"
Cohesion: 0.11
Nodes (20): getGoogleAuthUrl(), getMe(), answerClassification(), getClassification(), overrideClassification(), startClassification(), ApiError, apiRequest() (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (15): useAuth(), AppLayout(), AuthCallbackPage(), LoginPage(), NewShipmentPage(), shipmentFormSchema, ShipmentFormValues, ShipmentsPage() (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.15
Nodes (12): apiErrorSchema, classificationSchema, confidenceStringSchema, costSchema, extractionSchema, googleAuthUrlSchema, laneSchema, qaSchema (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (19): FieldConfirmTableProps, getFieldMeta(), useCostQuery(), useConfirmFieldsMutation(), useDescribeShipmentMutation(), useExtractionQuery(), useUploadInvoiceMutation(), confidenceMeta (+11 more)

### Community 21 - "Community 21"
Cohesion: 0.22
Nodes (8): Classification, CostBreakdown, ExtractionResult, QAResponse, Shipment, ShipmentCreate, ShipmentUpdate, User

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (5): AuthContext, AuthContextValue, AuthTokens, consumeTokensFromLocation(), persistTokens()

## Ambiguous Edges - Review These
- `FRONTEND-BUILD-INSTRUCTIONS.md` → `Hero Illustration Image`  [AMBIGUOUS]
  docs/FRONTEND-BUILD-INSTRUCTIONS.md · relation: references

## Knowledge Gaps
- **146 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `FRONTEND-BUILD-INSTRUCTIONS.md` and `Hero Illustration Image`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `useAuth()` connect `Community 18` to `Community 20`, `Community 23`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `cn()` connect `Linting Rules and Plugins` to `Community 20`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `CostPage()` connect `Community 20` to `Community 18`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `apiRequest()` (e.g. with `getGoogleAuthUrl()` and `getMe()`) actually correct?**
  _`apiRequest()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Compiler Options` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._