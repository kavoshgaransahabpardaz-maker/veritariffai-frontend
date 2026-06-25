import { useState } from 'react'

type MtcUploadProps = {
  onUpload: (file: File) => void
  isPending: boolean
  error?: string | null
}

export function MtcUpload({ onUpload, isPending, error }: MtcUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-5">
      <div>
        <h3 className="text-lg font-semibold text-[var(--ink)]">Upload Mill Test Certificate (MTC)</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Upload your MTC PDF to extract melt/pour country and chemical composition.
        </p>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-white px-6 py-12 text-center">
        {isPending ? (
          <span className="text-sm font-medium text-[var(--ink)]">Uploading and extracting...</span>
        ) : (
          <>
            <span className="text-sm font-medium text-[var(--ink)]">Choose a PDF MTC file</span>
            <span className="mt-2 text-xs text-[var(--muted)]">PDF, PNG, JPG, JPEG</span>
            <input
              className="sr-only"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </>
        )}
      </label>
      {file && !isPending && (
        <p className="text-sm text-[var(--ink)]">
          Selected: {file.name}
        </p>
      )}
      {error && (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      )}
    </div>
  )
}
