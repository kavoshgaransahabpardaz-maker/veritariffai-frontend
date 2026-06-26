import { useState } from 'react'
import { MeltPourCard } from '@/components/common/MeltPourCard'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import {
  useEvaluateOriginMutation,
  useMeltAndPourMutation,
  useOriginResultQuery,
  useOriginRuleQuery,
} from '@/features/origin/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import type { MeltAndPourResult } from '@/lib/api/types'

export function OriginPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const ruleQuery = useOriginRuleQuery(auth.tokens?.accessToken, shipment.id)
  const resultQuery = useOriginResultQuery(auth.tokens?.accessToken, shipment.id)
  const evaluateMutation = useEvaluateOriginMutation(auth.tokens?.accessToken, shipment.id)
  const meltAndPourMutation = useMeltAndPourMutation(auth.tokens?.accessToken, shipment.id)
  const [attested, setAttested] = useState(false)
  const [meltAndPourResult, setMeltAndPourResult] = useState<MeltAndPourResult | null>(null)

  async function runMeltAndPour() {
    const result = await meltAndPourMutation.mutateAsync()
    setMeltAndPourResult(result)
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Origin rule"
        eyebrow="TCA rule"
        description="Rule for preferential origin under the TCA."
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

      {/* ── TCA Melt-and-Pour (dedicated endpoint) ── */}
      <SectionCard
        title="Melt-and-Pour Origin (TCA ORIG-4)"
        eyebrow="Steel origin"
        description="Determines TCA preferential origin by reading melt and pour countries from the MTC. Confidence is always VERIFY — user must confirm."
        actions={
          <Button onClick={runMeltAndPour} disabled={meltAndPourMutation.isPending}>
            {meltAndPourMutation.isPending ? 'Determining…' : 'Determine Melt-and-Pour Origin'}
          </Button>
        }
      >
        {meltAndPourResult ? (
          <MeltPourCard
            meltCountry={meltAndPourResult.melt_country}
            pourCountry={meltAndPourResult.pour_country}
            qualifies={meltAndPourResult.eligible}
            confidence={meltAndPourResult.confidence}
            disqualifyingReason={meltAndPourResult.disqualifying_reason}
          />
        ) : (
          <p className="text-sm text-[var(--muted)]">
            Run the determination to check TCA melt-and-pour eligibility from the uploaded MTC.
          </p>
        )}
        {meltAndPourMutation.error ? (
          <p className="mt-3 text-sm text-[var(--danger)]">Unable to determine melt-and-pour origin. Check that an MTC has been uploaded.</p>
        ) : null}
      </SectionCard>

      {/* ── Full origin evaluation (BOM-based) ── */}
      <SectionCard
        title="Full Origin Evaluation"
        eyebrow="Rules of origin"
        description="BOM-based origin qualification under the applicable TCA rule."
        actions={
          <Button onClick={() => evaluateMutation.mutate(attested)} disabled={evaluateMutation.isPending}>
            {evaluateMutation.isPending ? 'Evaluating...' : 'Evaluate Origin'}
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
          <span>Attest that you have reviewed the MTC data before evaluating origin.</span>
        </label>

        {resultQuery.data ? (
          <MeltPourCard
            meltCountry={resultQuery.data.melt_country}
            pourCountry={resultQuery.data.pour_country}
            qualifies={resultQuery.data.melt_pour_qualifies ?? resultQuery.data.qualifies}
            basis={resultQuery.data.basis}
            confidence={resultQuery.data.confidence}
            disclaimer={resultQuery.data.disclaimer}
            citations={resultQuery.data.citations}
            disqualifyingReason={resultQuery.data.disqualifying_reason}
          />
        ) : (
          <p className="text-sm text-[var(--muted)]">No origin evaluation yet. Upload an MTC in Intake and run evaluate.</p>
        )}
      </SectionCard>
    </div>
  )
}
