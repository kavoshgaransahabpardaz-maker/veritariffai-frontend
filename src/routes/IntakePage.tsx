import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmptyState } from '@/components/common/EmptyState'
import { FieldConfirmTable } from '@/components/common/FieldConfirmTable'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/features/auth/AuthProvider'
import {
  useConfirmFieldsMutation,
  useDescribeShipmentMutation,
  useExtractionQuery,
  useUploadInvoiceMutation,
} from '@/features/intake/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import { isRecord } from '@/lib/utils'

const describeSchema = z.object({
  description: z.string().min(12, 'Describe the goods in plain language.'),
})

type DescribeValues = z.infer<typeof describeSchema>

export function IntakePage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const extractionQuery = useExtractionQuery(auth.tokens?.accessToken, shipment.id)
  const describeMutation = useDescribeShipmentMutation(auth.tokens?.accessToken, shipment.id)
  const uploadMutation = useUploadInvoiceMutation(auth.tokens?.accessToken, shipment.id)
  const confirmMutation = useConfirmFieldsMutation(auth.tokens?.accessToken, shipment.id)
  const [editableFields, setEditableFields] = useState<Record<string, unknown>>({})
  const [uploadError, setUploadError] = useState<string | null>(null)

  const form = useForm<DescribeValues>({
    resolver: zodResolver(describeSchema),
    defaultValues: { description: '' },
  })

  useEffect(() => {
    if (isRecord(extractionQuery.data?.fields_json)) {
      setEditableFields(extractionQuery.data.fields_json)
    }
  }, [extractionQuery.data?.fields_json])

  const submitDescription = form.handleSubmit(async (values) => {
    await describeMutation.mutateAsync(values.description)
  })

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setUploadError(null)

    try {
      await uploadMutation.mutateAsync(file)
    } catch {
      setUploadError('Upload failed. Check the file type and backend extractor status, then retry.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Describe the goods or upload an invoice"
        description="Downstream sections stay gated until extracted fields are confirmed."
        eyebrow="Intake"
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <form
            className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5"
            onSubmit={submitDescription}
          >
            <div>
              <h3 className="text-lg font-semibold text-[var(--ink)]">Describe your goods</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Use plain language about the product, materials, purpose, and packaging.
              </p>
            </div>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-[var(--ink)]">Goods description</span>
              <Textarea
                {...form.register('description')}
                placeholder="Women's cotton knit sweaters, boxed in units of 20, shipped from Germany to the UK."
              />
              <p className="text-xs text-[var(--danger)]">{form.formState.errors.description?.message}</p>
            </label>
            <Button type="submit" disabled={describeMutation.isPending}>
              {describeMutation.isPending ? 'Submitting...' : 'Extract fields from description'}
            </Button>
          </form>

          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <div>
              <h3 className="text-lg font-semibold text-[var(--ink)]">Upload invoice</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                This slice uses a direct file input. Drag/drop, previews, and multi-page PDF review are next decisions.
              </p>
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-white px-6 py-12 text-center">
              <span className="text-sm font-medium text-[var(--ink)]">Choose a PDF or image invoice</span>
              <span className="mt-2 text-xs text-[var(--muted)]">PDF, PNG, JPG, JPEG</span>
              <input className="sr-only" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} />
            </label>
            <p className="text-xs text-[var(--muted)]">Extraction source: invoice upload posts directly to the live multipart endpoint.</p>
            {uploadError ? <p className="text-sm text-[var(--danger)]">{uploadError}</p> : null}
          </div>
        </div>
      </SectionCard>

      {extractionQuery.isLoading ? (
        <div className="h-64 animate-pulse rounded-[2rem] bg-[var(--surface-muted)]" />
      ) : extractionQuery.data?.status === 'pending' ? (
        <SectionCard
          title="Extraction in progress"
          description="The page polls the backend until fields are ready. Classification, cost, and origin remain unavailable until you confirm them."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
            ))}
          </div>
        </SectionCard>
      ) : extractionQuery.data?.fields_json && isRecord(extractionQuery.data.fields_json) ? (
        <SectionCard
          title="Confirm extracted fields"
          description="Edit anything the extractor got wrong, especially any amber or red confidence rows."
          actions={
            <Button onClick={() => confirmMutation.mutate(editableFields)} disabled={confirmMutation.isPending}>
              {confirmMutation.isPending ? 'Confirming...' : 'Confirm and continue'}
            </Button>
          }
        >
          <div className="mb-5 rounded-2xl border border-[var(--warning)]/15 bg-[var(--warning-soft)] px-4 py-4 text-sm text-[var(--warning)]">
            Downstream steps stay locked until extraction is confirmed. The app never computes classification or cost from unconfirmed fields.
          </div>
          <FieldConfirmTable
            values={editableFields}
            confidenceByField={isRecord(extractionQuery.data.per_field_confidence_json) ? extractionQuery.data.per_field_confidence_json : null}
            onChange={(key, value) => setEditableFields((current) => ({ ...current, [key]: value }))}
          />
          {extractionQuery.data.confirmed ? (
            <p className="mt-4 text-sm text-[var(--success)]">Fields already confirmed. Classification and cost are now available.</p>
          ) : null}
          {confirmMutation.error ? (
            <p className="mt-4 text-sm text-[var(--danger)]">Unable to confirm fields. Review backend validation details and retry.</p>
          ) : null}
        </SectionCard>
      ) : (
        <EmptyState
          title="No extraction yet"
          description="Start with a plain-language description or upload an invoice, then confirm the extracted fields before moving on."
        />
      )}
    </div>
  )
}

