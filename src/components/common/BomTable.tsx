import { Input } from '@/components/ui/input'

export type EditableBomItem = {
  material_name: string
  hs_code?: string | null
  claimed_origin_country: string
  value: string
  supplier_declaration_status: 'on_file' | 'pending' | 'none'
}

type BomTableProps = {
  items: EditableBomItem[]
  onChange: (index: number, next: EditableBomItem) => void
}

export function BomTable({ items, onChange }: BomTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
      <table className="min-w-full divide-y divide-[var(--border)]">
        <thead className="bg-[var(--surface-muted)] text-left text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3">Material</th>
            <th className="px-4 py-3">HS code</th>
            <th className="px-4 py-3">Origin</th>
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Declaration</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)] bg-white">
          {items.map((item, index) => (
            <tr key={`${item.material_name}-${index}`}>
              <td className="px-4 py-3">
                <Input value={item.material_name} onChange={(event) => onChange(index, { ...item, material_name: event.target.value })} />
              </td>
              <td className="px-4 py-3">
                <Input value={item.hs_code ?? ''} onChange={(event) => onChange(index, { ...item, hs_code: event.target.value })} />
              </td>
              <td className="px-4 py-3">
                <Input value={item.claimed_origin_country} onChange={(event) => onChange(index, { ...item, claimed_origin_country: event.target.value.toUpperCase() })} />
              </td>
              <td className="px-4 py-3">
                <Input value={item.value} onChange={(event) => onChange(index, { ...item, value: event.target.value })} />
              </td>
              <td className="px-4 py-3">
                <select
                  className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-[var(--ink)]"
                  value={item.supplier_declaration_status}
                  onChange={(event) =>
                    onChange(index, {
                      ...item,
                      supplier_declaration_status: event.target.value as EditableBomItem['supplier_declaration_status'],
                    })
                  }
                >
                  <option value="none">none</option>
                  <option value="pending">pending</option>
                  <option value="on_file">on file</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
