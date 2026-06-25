import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type GateQuestionProps = {
  question: string
  options?: string[] | null
  isPending: boolean
  onAnswer: (answer: string) => void
}

export function GateQuestion({ question, options, isPending, onAnswer }: GateQuestionProps) {
  const [freeText, setFreeText] = useState('')

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-white p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Disambiguation
        </p>
        <p className="mt-2 text-base font-semibold text-[var(--ink)]">{question}</p>
      </div>

      {options && options.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              key={option}
              variant="outline"
              onClick={() => onAnswer(option)}
              disabled={isPending}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : null}

      <div className="space-y-2 border-t border-[var(--border)] pt-4">
        <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Or type your answer
        </label>
        <Textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Describe in plain language…"
          disabled={isPending}
        />
        <Button
          onClick={() => {
            if (freeText.trim().length >= 2) {
              onAnswer(freeText.trim())
              setFreeText('')
            }
          }}
          disabled={isPending || freeText.trim().length < 2}
        >
          {isPending ? 'Sending…' : 'Send answer'}
        </Button>
      </div>
    </div>
  )
}
