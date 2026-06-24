import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/AuthProvider'
import { useCreateShipmentMutation } from '@/features/shipments/hooks'
import { cleanOptionalNumber } from '@/lib/utils'

const shipmentFormSchema = z.object({
  name: z.string().min(2, 'Enter a shipment name.'),
  lane: z.enum(['EU_EU', 'EU_UK', 'UK_EU', 'EU_ROW', 'UK_ROW']),
  originCountry: z.string().min(2, 'Enter the origin country code.'),
  destinationCountry: z.string().min(2, 'Enter the destination country code.'),
  incoterms: z.string().optional(),
  currency: z.string().min(3, 'Enter a currency code.'),
  declaredValue: z.string().optional(),
  exWorksValue: z.string().optional(),
})

type ShipmentFormValues = z.infer<typeof shipmentFormSchema>

export function NewShipmentPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const createShipmentMutation = useCreateShipmentMutation(auth.tokens?.accessToken)

  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      name: '',
      lane: 'EU_UK',
      originCountry: 'DE',
      destinationCountry: 'GB',
      incoterms: 'DAP',
      currency: 'GBP',
      declaredValue: '',
      exWorksValue: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const shipment = await createShipmentMutation.mutateAsync({
      name: values.name,
      lane: values.lane,
      origin_country: values.originCountry.toUpperCase(),
      destination_country: values.destinationCountry.toUpperCase(),
      incoterms: values.incoterms?.trim() || undefined,
      currency: values.currency.toUpperCase(),
      declared_value: cleanOptionalNumber(values.declaredValue),
      ex_works_value: cleanOptionalNumber(values.exWorksValue),
    })

    navigate(`/shipments/${shipment.id}/intake`)
  })

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">New shipment</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--ink)] sm:text-4xl">Set the lane and commercial basics first.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
          The backend shipment record drives the left-hand workflow and determines whether the app shows the simplified intra-EU state or the
          customs workflow.
        </p>
      </section>

      <SectionCard title="Shipment details" description="These fields map directly to the live backend shipment create contract.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Shipment name</span>
            <Input {...form.register('name')} placeholder="April textile consignment" />
            <p className="text-xs text-[var(--danger)]">{form.formState.errors.name?.message}</p>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Lane</span>
            <select
              className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[var(--ink)]"
              {...form.register('lane')}
            >
              {['EU_EU', 'EU_UK', 'UK_EU', 'EU_ROW', 'UK_ROW'].map((lane) => (
                <option key={lane} value={lane}>
                  {lane}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Origin country</span>
            <Input {...form.register('originCountry')} maxLength={2} placeholder="DE" />
            <p className="text-xs text-[var(--danger)]">{form.formState.errors.originCountry?.message}</p>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Destination country</span>
            <Input {...form.register('destinationCountry')} maxLength={2} placeholder="GB" />
            <p className="text-xs text-[var(--danger)]">{form.formState.errors.destinationCountry?.message}</p>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Incoterms</span>
            <Input {...form.register('incoterms')} placeholder="DAP" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Currency</span>
            <Input {...form.register('currency')} maxLength={3} placeholder="GBP" />
            <p className="text-xs text-[var(--danger)]">{form.formState.errors.currency?.message}</p>
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Declared value</span>
            <Input {...form.register('declaredValue')} inputMode="decimal" placeholder="12500" />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium text-[var(--ink)]">Ex works value</span>
            <Input {...form.register('exWorksValue')} inputMode="decimal" placeholder="11000" />
          </label>
          <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-4 md:col-span-2">
            <p className="max-w-2xl text-sm text-[var(--muted)]">
              The next screen opens intake, where fields must be confirmed before classification or cost can run.
            </p>
            <Button type="submit" disabled={createShipmentMutation.isPending}>
              {createShipmentMutation.isPending ? 'Creating shipment...' : 'Create shipment'}
            </Button>
          </div>
          {createShipmentMutation.error ? (
            <p className="text-sm text-[var(--danger)] md:col-span-2">
              Unable to create the shipment. Check the backend validation rules and try again.
            </p>
          ) : null}
        </form>
      </SectionCard>
    </div>
  )
}

