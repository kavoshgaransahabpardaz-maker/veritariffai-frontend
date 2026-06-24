import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function formatCurrency(value: string | null | undefined, currency = 'GBP') {
  if (!value) {
    return 'Pending'
  }

  const numeric = Number(value)
  if (Number.isNaN(numeric)) {
    return value
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(numeric)
}

export function formatPercent(value: string | null | undefined) {
  if (!value) {
    return 'Pending'
  }

  const numeric = Number(value)
  if (Number.isNaN(numeric)) {
    return value
  }

  return `${numeric.toFixed(2)}%`
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'Pending'
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function cleanOptionalNumber(value: string | undefined) {
  if (!value?.trim()) {
    return undefined
  }

  return value.trim()
}
