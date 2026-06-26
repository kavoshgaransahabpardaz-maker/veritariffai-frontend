import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth/AuthProvider'
import { AttributeSummary } from '@/features/classification/AttributeSummary'
import { CandidateAlternatives } from '@/features/classification/CandidateAlternatives'
import { CodeResult } from '@/features/classification/CodeResult'
import { ControlsPanel } from '@/features/classification/ControlsPanel'
import { GateQuestion } from '@/features/classification/GateQuestion'
import { ReviewRoutedBanner } from '@/features/classification/ReviewRoutedBanner'
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

  const overrideForm = useForm<OverrideValues>({
    resolver: zodResolver(overrideSchema),
    defaultValues: { hsCode: '', description: '' },
  })

  const extractionConfirmed = Boolean(extractionQuery.data?.confirmed)
  const cls = classificationQuery.data
  const confidence = cls ? normalizeConfidence(cls.confidence) : null

  async function startFlow() {
    const qa = await startMutation.mutateAsync()
    setQaState(qa)
    // If backend resolved immediately (pre-filled from MTC/invoice), show result
    if (qa.is_complete) {
      setQaState(qa)
    }
  }

  async function sendAnswer(answer: string) {
    const qa = await answerMutation.mutateAsync(answer)
    setQaState(qa)
  }

  const submitOverride = overrideForm.handleSubmit(async (values) => {
    await overrideMutation.mutateAsync({
      hs_code: values.hsCode,
      description: values.description?.trim() || undefined,
    })
    overrideForm.reset({ hsCode: values.hsCode, description: values.description })
  })

  return (
    <div className="space-y-6">
      {!extractionConfirmed ? (
        <div className="rounded-[var(--radius)] border border-[var(--warning)]/15 bg-[var(--warning-soft)] px-5 py-4 text-sm text-[var(--warning)]">
          Classification is locked until extracted fields are confirmed. Go back to{' '}
          <Link className="font-semibold underline" to="../intake">intake</Link> to confirm.
        </div>
      ) : null}

      {/* ── Attribute summary (always visible when available) ── */}
      {qaState?.attributes && qaState.attributes.length > 0 ? (
        <SectionCard title="Extracted attributes" eyebrow="What we know">
          <AttributeSummary attributes={qaState.attributes} />
        </SectionCard>
      ) : null}

      {/* ── Q&A flow ── */}
      <SectionCard
        title="Steel HS classification"
        eyebrow="Guided disambiguation"
        description="The classifier resolves the commodity code from extracted attributes and gate questions."
        actions={
          <Button
            variant={qaState ? 'secondary' : 'default'}
            onClick={startFlow}
            disabled={!extractionConfirmed || startMutation.isPending}
          >
            {startMutation.isPending ? 'Starting…' : qaState ? 'Restart' : 'Start classification'}
          </Button>
        }
      >
        {qaState && !qaState.is_complete && qaState.question ? (
          <GateQuestion
            question={qaState.question}
            options={qaState.options}
            isPending={answerMutation.isPending}
            onAnswer={sendAnswer}
          />
        ) : null}

        {startMutation.error || answerMutation.error ? (
          <p className="mt-4 text-sm text-[var(--danger)]">
            Unable to continue classification. Retry or use the manual override below.
          </p>
        ) : null}

        {!qaState ? (
          <p className="text-sm text-[var(--muted)]">
            Start the classifier to receive a commodity code based on the extracted trade data and steel attributes.
          </p>
        ) : null}
      </SectionCard>

      {/* ── Result panels — switch on confidence tier ── */}
      {cls ? (
        <>
          {confidence === 'needs_human' ? (
            <ReviewRoutedBanner reason={cls.confidence_reason ?? null} />
          ) : cls.hs_code ? (
            <SectionCard title="Classification result" eyebrow={confidence === 'high' ? 'Resolved' : 'Pending confirmation'}>
              <CodeResult
                hsCode={cls.hs_code}
                description={cls.description}
                confidence={confidence!}
                confidenceReason={cls.confidence_reason ?? null}
                autoResolved={cls.auto_resolved ?? null}
                citationChain={cls.citation_chain}
                treeVersion={cls.tree_version ?? null}
                nomenclatureVersion={cls.nomenclature_version ?? null}
                onConfirm={
                  confidence === 'verify'
                    ? () => overrideMutation.mutate({ hs_code: cls.hs_code! })
                    : undefined
                }
                isConfirming={overrideMutation.isPending}
              />

              {/* Alternatives */}
              {cls.candidate_codes && cls.candidate_codes.length > 0 ? (
                <div className="mt-6">
                  <CandidateAlternatives
                    alternatives={cls.candidate_codes}
                    onSelect={(hsCode) => overrideMutation.mutate({ hs_code: hsCode })}
                    isSelecting={overrideMutation.isPending}
                  />
                </div>
              ) : null}

              {/* Controls */}
              <div className="mt-6">
                <ControlsPanel controls={cls.controls} />
              </div>
            </SectionCard>
          ) : null}

          {/* Also show QA-state alternatives if present and no stored result yet */}
          {!cls.hs_code && qaState?.is_complete && qaState.candidate_code ? (
            <SectionCard title="Candidate code" eyebrow="From Q&A">
              <CodeResult
                hsCode={qaState.candidate_code}
                confidence={normalizeConfidence(qaState.confidence ?? 'verify')}
                autoResolved={qaState.auto_resolved ?? null}
                citationChain={qaState.citation_chain}
                whyText={qaState.why_text ?? null}
                onConfirm={() => overrideMutation.mutate({ hs_code: qaState.candidate_code! })}
                isConfirming={overrideMutation.isPending}
              />
              {qaState.alternatives && qaState.alternatives.length > 0 ? (
                <div className="mt-6">
                  <CandidateAlternatives
                    alternatives={qaState.alternatives}
                    onSelect={(hsCode) => overrideMutation.mutate({ hs_code: hsCode })}
                    isSelecting={overrideMutation.isPending}
                  />
                </div>
              ) : null}
            </SectionCard>
          ) : null}
        </>
      ) : null}

      {/* ── Manual override (always available) ── */}
      <SectionCard
        title="Manual override"
        description="Set the HS code yourself. The backend records this as user-provided; confidence is set to verify."
      >
        <form className="space-y-4" onSubmit={submitOverride}>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">HS code</span>
            <Input
              {...overrideForm.register('hsCode')}
              placeholder="7208.51"
              disabled={!extractionConfirmed}
            />
            <p className="text-xs text-[var(--danger)]">{overrideForm.formState.errors.hsCode?.message}</p>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Description (optional)</span>
            <Textarea {...overrideForm.register('description')} disabled={!extractionConfirmed} />
          </label>
          <Button type="submit" disabled={!extractionConfirmed || overrideMutation.isPending}>
            {overrideMutation.isPending ? 'Saving…' : 'Save override'}
          </Button>
          {overrideMutation.error ? (
            <p className="text-sm text-[var(--danger)]">
              Unable to save the override. Check backend validation and retry.
            </p>
          ) : null}
        </form>
      </SectionCard>
    </div>
  )
}
