import { useMemo, useState } from 'react'
import { BomTable, type EditableBomItem } from '@/components/common/BomTable'
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { MarginBar } from '@/components/common/MarginBar'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useEvaluateOriginMutation, useOriginResultQuery, useOriginRuleQuery, useSetBomMutation } from '@/features/origin/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import { normalizeConfidence } from '@/lib/confidence'
import { formatDateTime, formatLabel, isRecord } from '@/lib/utils'

const defaultBomItem: EditableBomItem = {
  material_name: '',
  hs_code: '',
  claimed_origin_country: '',
  value: '',
  supplier_declaration_status: 'none',
}

export function OriginPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const ruleQuery = useOriginRuleQuery(auth.tokens?.accessToken, shipment.id)
  const resultQuery = useOriginResultQuery(auth.tokens?.accessToken, shipment.id)
  const setBomMutation = useSetBomMutation(auth.tokens?.accessToken, shipment.id)
  const evaluateMutation = useEvaluateOriginMutation(auth.tokens?.accessToken, shipment.id)
  const [items, setItems] = useState<EditableBomItem[]>([defaultBomItem])
  const [attested, setAttested] = useState(false)

  const blockingItems = useMemo(() => resultQuery.data?.blocking_items_json ?? [], [resultQuery.data?.blocking_items_json])

  return (
    <div className="space-y-6">
      <SectionCard
        title="Origin rule"
        eyebrow="TCA rule"
        description="Render the backend rule in plain language and keep conservative messaging visible."
        actions={
          ruleQuery.data ? (
            <span className="code-chip rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1.5 text-sm text-[var(--ink)]">
              {ruleQuery.data.rule_type}
            </span>
          ) : null
        }
      >
        {ruleQuery.data ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted)]">
              HS heading <span className="font-semibold text-[var(--ink)]">{ruleQuery.data.hs_heading}</span> under {ruleQuery.data.agreement}
            </p>
            <pre className="overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs text-[var(--ink)]">
              {JSON.stringify(ruleQuery.data.rule_json, null, 2)}
            </pre>
            <p className="text-xs text-[var(--muted)]">Source ref: {ruleQuery.data.source_ref}</p>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">The applicable rule will appear here when the backend returns it.</p>
        )}
      </SectionCard>

      <SectionCard
        title="Bill of materials"
        description="Enter each non-trivial input and its supplier declaration state, then save the BOM to the backend."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setItems((current) => [...current, defaultBomItem])}
            >
              Add row
            </Button>
            <Button
              onClick={() =>
                setBomMutation.mutate(
                  items
                    .filter((item) => item.material_name.trim())
                    .map((item) => ({
                      material_name: item.material_name,
                      hs_code: item.hs_code || undefined,
                      claimed_origin_country: item.claimed_origin_country,
                      value: item.value,
                      supplier_declaration_status: item.supplier_declaration_status,
                    })),
                )
              }
              disabled={setBomMutation.isPending}
            >
              {setBomMutation.isPending ? 'Saving...' : 'Save BOM'}
            </Button>
          </div>
        }
      >
        <BomTable
          items={items}
          onChange={(index, next) =>
            setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)))
          }
        />
      </SectionCard>

      <SectionCard
        title="Evaluate origin"
        description="The client never computes origin locally. It sends the BOM and displays backend percentages and blockers."
        actions={
          <Button onClick={() => evaluateMutation.mutate(attested)} disabled={evaluateMutation.isPending}>
            {evaluateMutation.isPending ? 'Evaluating...' : 'Evaluate'}
          </Button>
        }
      >
        <label className="mb-5 flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            className="mt-1"
            checked={attested}
            onChange={(event) => setAttested(event.target.checked)}
          />
          <span>Attest that insufficient operations have been reviewed before evaluating origin.</span>
        </label>

        {resultQuery.data ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <ConfidenceBadge
                tier={normalizeConfidence(resultQuery.data.confidence)}
                reason={resultQuery.data.confidence_reason}
              />
              <span className="text-sm font-semibold text-[var(--ink)]">
                {resultQuery.data.qualifies ? 'Qualifies for preferential origin' : 'Does not yet qualify'}
              </span>
            </div>

            <MarginBar
              nonOriginatingPct={resultQuery.data.non_originating_pct}
              capPct={resultQuery.data.cap_pct}
              marginPct={resultQuery.data.margin_pct}
            />

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">Basis</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{resultQuery.data.basis}</p>
              <p className="mt-3 text-xs text-[var(--muted)]">Evaluated {formatDateTime(resultQuery.data.evaluated_at)}</p>
            </div>

            {blockingItems.length ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[var(--ink)]">Blocking items</p>
                {blockingItems.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-[var(--warning)]/15 bg-[var(--warning-soft)] p-4">
                    {isRecord(item) ? (
                      <div className="space-y-1 text-sm text-[var(--warning)]">
                        {Object.entries(item).map(([key, value]) => (
                          <p key={key}>
                            {formatLabel(key)}: <span className="font-semibold">{String(value)}</span>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--warning)]">{String(item)}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">
              {resultQuery.data.disclaimer}
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">No origin evaluation yet. Save a BOM and run evaluate.</p>
        )}
      </SectionCard>
    </div>
  )
}
