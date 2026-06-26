import { useState } from 'react'
import { BundleExport } from '@/components/common/BundleExport'
import { CodeChip } from '@/components/common/CodeChip'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusPill } from '@/components/common/StatusPill'
import { Stepper } from '@/components/common/Stepper'
import { useAuth } from '@/features/auth/AuthProvider'
import { useBundleQuery, useGenerateBundleMutation } from '@/features/bundle/hooks'
import {
  useCertifyDocumentMutation,
  useDocumentQuery,
  useDocumentsQuery,
  useGenerateDocumentMutation,
  useRequestDeclarationMutation,
} from '@/features/documents/hooks'
import { useWorkspaceShipment } from '@/features/shipments/workspace'
import type { DocType } from '@/lib/api/types'
import { formatDateTime } from '@/lib/utils'

const DOC_TYPE_LABELS: Record<string, string> = {
  statement_of_origin: 'Statement of Origin (TCA ORIG-4)',
  statement_on_origin: 'Statement of Origin (TCA ORIG-4)',
  certificate_of_origin: 'Certificate of Origin',
  commercial_invoice: 'Commercial Invoice',
  packing_list: 'Packing List',
  customs_data: 'Customs Data',
  import_declaration: 'Import Declaration',
  export_declaration: 'Export Declaration',
  mtc_audit_report: 'MTC Audit Report',
  barristers_bundle: "Barrister's Bundle",
}

function docTypeLabel(docType: string): string {
  return DOC_TYPE_LABELS[docType] ?? docType
}

export function DocumentsPage() {
  const { shipment } = useWorkspaceShipment()
  const auth = useAuth()
  const documentsQuery = useDocumentsQuery(auth.tokens?.accessToken, shipment.id)
  const bundleQuery = useBundleQuery(auth.tokens?.accessToken, shipment.id)
  const generateBundleMutation = useGenerateBundleMutation(auth.tokens?.accessToken, shipment.id)
  const [selectedDocType, setSelectedDocType] = useState<DocType | null>(null)
  const documentQuery = useDocumentQuery(auth.tokens?.accessToken, shipment.id, selectedDocType)
  const generateMutation = useGenerateDocumentMutation(auth.tokens?.accessToken, shipment.id)
  const requestMutation = useRequestDeclarationMutation(auth.tokens?.accessToken, shipment.id)
  const certifyMutation = useCertifyDocumentMutation(auth.tokens?.accessToken, shipment.id)

  const selectedDoc = documentQuery.data

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <SectionCard title="Required documents" eyebrow="Documents" description="Each record comes from the backend-required document set.">
          <div className="space-y-3">
            {documentsQuery.data?.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setSelectedDocType(doc.doc_type as DocType)}
                className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {docTypeLabel(doc.doc_type)}
                  </p>
                  {doc.blocker ? <p className="mt-1 text-xs text-[var(--danger)]">{doc.blocker}</p> : null}
                </div>
                <StatusPill status={doc.status} />
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={selectedDocType ? `Document detail: ${docTypeLabel(selectedDocType)}` : 'Document detail'}
          description="Generation and certification are separate. Certification is always an explicit user act."
          actions={selectedDocType ? <CodeChip value={selectedDocType} /> : null}
        >
          {selectedDocType && selectedDoc ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={selectedDoc.status} />
                {selectedDoc.certified_by_user_at ? (
                  <span className="text-sm text-[var(--muted)]">
                    Certified {formatDateTime(selectedDoc.certified_by_user_at)}
                  </span>
                ) : null}
              </div>

              <Stepper
                items={[
                  {
                    key: 'generate',
                    title: 'Generate draft',
                    description: 'Create or refresh the backend document draft without certifying it.',
                    status: selectedDoc.draft_json ? 'ready' : 'needs_input',
                    actionLabel: 'Generate draft',
                    onAction: () => generateMutation.mutate(selectedDocType),
                    disabled: generateMutation.isPending,
                  },
                  {
                    key: 'request',
                    title: 'Resolve evidence gaps',
                    description: 'Ensure MTC data is confirmed.',
                    status: selectedDoc.blocker ? 'blocked' : 'ready',
                    actionLabel: 'Request declaration',
                    onAction: () => requestMutation.mutate(selectedDocType),
                    disabled: requestMutation.isPending,
                  },
                  {
                    key: 'certify',
                    title: 'Explicit certification',
                    description: 'Only certify when the user is ready. This never runs automatically.',
                    status: selectedDoc.status,
                    actionLabel: 'Certify document',
                    onAction: () => {
                      if (window.confirm('Certify this document now? This is an explicit user action.')) {
                        certifyMutation.mutate(selectedDocType)
                      }
                    },
                    disabled: certifyMutation.isPending || selectedDoc.status !== 'ready',
                  },
                ]}
              />

              {selectedDoc.blocker ? (
                <div className="rounded-2xl border border-[var(--warning)]/15 bg-[var(--warning-soft)] px-4 py-4 text-sm text-[var(--warning)]">
                  {selectedDoc.blocker}
                </div>
              ) : null}

              {selectedDoc.draft_json ? (
                <pre className="overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs text-[var(--ink)]">
                  {JSON.stringify(selectedDoc.draft_json, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-[var(--muted)]">No draft has been generated yet.</p>
              )}
            </div>
          ) : selectedDocType ? (
            <p className="text-sm text-[var(--muted)]">Loading document detail...</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">Select a document from the left to inspect its status and next action.</p>
          )}
        </SectionCard>
      </div>

      <BundleExport
        status={bundleQuery.data?.status}
        sha256={bundleQuery.data?.sha256}
        disclaimer={bundleQuery.data?.disclaimer}
        downloadRef={bundleQuery.data?.download_ref}
        onGenerate={() => generateBundleMutation.mutate()}
        isGenerating={generateBundleMutation.isPending}
      />
    </div>
  )
}
