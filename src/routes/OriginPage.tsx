import { useState } from 'react'
import { MeltPourCard } from '@/components/common/MeltPourCard'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthProvider'
import { useEvaluateOriginMutation, useOriginResultQuery, useOriginRuleQuery } from '@/features/origin/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'

export function OriginPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const ruleQuery = useOriginRuleQuery(auth.tokens?.accessToken, shipment.id)
  const resultQuery = useOriginResultQuery(auth.tokens?.accessToken, shipment.id)
  const evaluateMutation = useEvaluateOriginMutation(auth.tokens?.accessToken, shipment.id)
  const [attested, setAttested] = useState(false)

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

      <SectionCard
        title="Melt & Pour Origin Determination"
        description="Steel preferential origin is based on melt and pour country from the MTC."
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
          />
        ) : (
          <p className="text-sm text-[var(--muted)]">No origin evaluation yet. Upload an MTC in Intake and run evaluate.</p>
        )}
      </SectionCard>
    </div>
  )
}
