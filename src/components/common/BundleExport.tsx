import { Button } from '@/components/ui/button'

type BundleExportProps = {
  status?: 'pending' | 'ready' | 'failed'
  sha256?: string | null
  disclaimer?: string | null
  downloadRef?: string | null
  onGenerate?: () => void
  isGenerating?: boolean
}

export function BundleExport({
  status,
  sha256,
  disclaimer,
  downloadRef,
  onGenerate,
  isGenerating,
}: BundleExportProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
      <div>
        <h3 className="text-lg font-semibold text-[var(--ink)]">Barrister's Bundle</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Download the sealed bundle for your shipment.
        </p>
      </div>

      {status === 'ready' ? (
        <div className="space-y-4">
          {disclaimer && (
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <p className="text-xs text-[var(--muted)]">{disclaimer}</p>
            </div>
          )}
          {sha256 && (
            <div>
              <p className="text-xs text-[var(--muted)]">SHA-256</p>
              <p className="mt-1 text-xs font-mono text-[var(--ink)] break-all">{sha256}</p>
            </div>
          )}
          {downloadRef && (
            <Button asChild>
              <a href={downloadRef} download>
                Download Bundle
              </a>
            </Button>
          )}
        </div>
      ) : status === 'pending' || isGenerating ? (
        <p className="text-sm text-[var(--muted)]">Generating bundle...</p>
      ) : (
        <Button onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Bundle'}
        </Button>
      )}
    </div>
  )
}
