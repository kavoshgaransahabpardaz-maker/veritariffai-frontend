import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { CodeChip } from '@/components/common/CodeChip'
import { ConfidenceBadge } from '@/components/common/ConfidenceBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth/AuthProvider'
import {
  useAnswerClassificationMutation,
  useClassificationQuery,
  useOverrideClassificationMutation,
  useStartClassificationMutation,
} from '@/features/classification/hooks'
import { useExtractionQuery } from '@/features/intake/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import { normalizeConfidence } from '@/lib/confidence'
import type { QAResponse } from '@/lib/api/types'
import { isRecord } from '@/lib/utils'

const overrideSchema = z.object({
  hsCode: z.string().min(4, 'Enter a commodity code.'),
  description: z.string().optional(),
})

type OverrideValues = z.infer<typeof overrideSchema>

export function ClassificationPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const extractionQuery = useExtractionQuery(auth.tokens?.accessToken, shipment.id)
  const classificationQuery = useClassificationQuery(auth.tokens?.accessToken, shipment.id)
  const startMutation = useStartClassificationMutation(auth.tokens?.accessToken, shipment.id)
  const answerMutation = useAnswerClassificationMutation(auth.tokens?.accessToken, shipment.id)
  const overrideMutation = useOverrideClassificationMutation(auth.tokens?.accessToken, shipment.id)
  const [qaState, setQaState] = useState<QAResponse | null>(null)
  const [freeAnswer, setFreeAnswer] = useState('')

  const overrideForm = useForm<OverrideValues>({
    resolver: zodResolver(overrideSchema),
    defaultValues: { hsCode: '', description: '' },
  })

  useEffect(() => {
    if (classificationQuery.data?.hs_code) {
      overrideForm.reset({
        hsCode: classificationQuery.data.hs_code,
        description: classificationQuery.data.description ?? '',
      })
    }
  }, [classificationQuery.data?.description, classificationQuery.data?.hs_code, overrideForm])

  const extractionConfirmed = Boolean(extractionQuery.data?.confirmed)

  const submitOverride = overrideForm.handleSubmit(async (values) => {
    await overrideMutation.mutateAsync({
      hs_code: values.hsCode,
      description: values.description?.trim() ? values.description.trim() : undefined,
    })
  })

  async function startFlow() {
    const qa = await startMutation.mutateAsync()
    setQaState(qa)
    setFreeAnswer('')
  }

  async function sendAnswer(answer: string) {
    const qa = await answerMutation.mutateAsync(answer)
    setQaState(qa)
    setFreeAnswer('')
  }

  const classificationTier = normalizeConfidence(classificationQuery.data?.confidence ?? null)

  return (
    <div className="space-y-6">
      {!extractionConfirmed ? (
        <div className="rounded-[var(--radius)] border border-[var(--warning)]/15 bg-[var(--warning-soft)] px-5 py-4 text-sm text-[var(--warning)]">
          Classification is locked until extracted fields are confirmed. Go back to <Link className="font-semibold underline" to="../intake">intake</Link> to confirm.
        </div>
      ) : null}

      <SectionCard
        title="Classification"
        eyebrow="Guided Q&A"
        description="Answer one question at a time. The backend proposes a commodity code candidate and confidence tier."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">Assistant questions</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Keep answers plain-language. The backend owns the logic and confidence.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={startFlow}
                disabled={!extractionConfirmed || startMutation.isPending}
              >
                {startMutation.isPending ? 'Starting...' : qaState ? 'Restart' : 'Start'}
              </Button>
            </div>

            {qaState ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Question</p>
                  <p className="mt-2 text-base font-semibold text-[var(--ink)]">{qaState.question}</p>
                  {qaState.options?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {qaState.options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          onClick={() => sendAnswer(option)}
                          disabled={!extractionConfirmed || answerMutation.isPending}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <label className="space-y-2 text-sm">
                  <span className="font-medium text-[var(--ink)]">Your answer</span>
                  <Textarea value={freeAnswer} onChange={(event) => setFreeAnswer(event.target.value)} />
                  <Button
                    type="button"
                    onClick={() => sendAnswer(freeAnswer)}
                    disabled={!extractionConfirmed || answerMutation.isPending || freeAnswer.trim().length < 2}
                  >
                    {answerMutation.isPending ? 'Sending...' : 'Send answer'}
                  </Button>
                </label>

                {qaState.is_complete && qaState.candidate_code ? (
                  <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Candidate code</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <CodeChip value={qaState.candidate_code} />
                      {qaState.confidence ? <ConfidenceBadge tier={normalizeConfidence(qaState.confidence)} /> : null}
                      <Button
                        variant="outline"
                        onClick={() =>
                          overrideMutation.mutate({
                            hs_code: qaState.candidate_code!,
                          })
                        }
                        disabled={!extractionConfirmed || overrideMutation.isPending}
                      >
                        Apply code
                      </Button>
                    </div>
                  </div>
                ) : null}

                {startMutation.error || answerMutation.error ? (
                  <p className="text-sm text-[var(--danger)]">Unable to continue the classification flow. Retry or use manual override.</p>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No classification session yet"
                description="Start the guided Q&A to receive a candidate commodity code from the backend."
              />
            )}
          </div>

          <div className="space-y-4">
            <SectionCard
              title="Current classification"
              description="This is the backend-owned classification record."
              actions={
                classificationQuery.data?.confidence ? (
                  <ConfidenceBadge tier={classificationTier} />
                ) : null
              }
            >
              {classificationQuery.isLoading ? (
                <div className="h-28 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
              ) : classificationQuery.data ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <CodeChip value={classificationQuery.data.hs_code ?? 'Pending'} />
                    {classificationQuery.data.dual_use_flag !== null ? (
                      <span className="text-sm text-[var(--muted)]">
                        Dual-use flag: {classificationQuery.data.dual_use_flag ? 'Yes' : 'No'}
                      </span>
                    ) : null}
                  </div>
                  {classificationQuery.data.description ? (
                    <p className="text-sm text-[var(--muted)]">{classificationQuery.data.description}</p>
                  ) : null}
                  {classificationQuery.data.official_data_json && isRecord(classificationQuery.data.official_data_json) ? (
                    <pre className="max-h-64 overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs text-[var(--ink)]">
                      {JSON.stringify(classificationQuery.data.official_data_json, null, 2)}
                    </pre>
                  ) : null}
                </div>
              ) : (
                <EmptyState
                  title="No classification yet"
                  description="Run the guided Q&A or set a commodity code manually."
                />
              )}
            </SectionCard>

            <SectionCard
              title="Manual override"
              description="Use this when you want to set the HS code yourself. The backend marks this as verify confidence."
            >
              <form className="space-y-4" onSubmit={submitOverride}>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-[var(--ink)]">HS code</span>
                  <Input {...overrideForm.register('hsCode')} placeholder="6109.10" disabled={!extractionConfirmed} />
                  <p className="text-xs text-[var(--danger)]">{overrideForm.formState.errors.hsCode?.message}</p>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="font-medium text-[var(--ink)]">Description (optional)</span>
                  <Textarea {...overrideForm.register('description')} disabled={!extractionConfirmed} />
                </label>
                <Button type="submit" disabled={!extractionConfirmed || overrideMutation.isPending}>
                  {overrideMutation.isPending ? 'Saving...' : 'Save override'}
                </Button>
                {overrideMutation.error ? (
                  <p className="text-sm text-[var(--danger)]">Unable to save the override. Check backend validation and retry.</p>
                ) : null}
              </form>
            </SectionCard>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
