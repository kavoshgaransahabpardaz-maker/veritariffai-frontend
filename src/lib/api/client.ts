import type { ZodType } from 'zod'
import { apiErrorSchema } from '@/lib/api/schemas'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? window.location.origin

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, message: string, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

type QueryValue = string | number | boolean | null | undefined

type RequestOptions<T> = {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string | null
  body?: BodyInit | Record<string, unknown>
  query?: Record<string, QueryValue>
  schema?: ZodType<T>
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path, API_BASE_URL)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') {
        continue
      }

      url.searchParams.set(key, String(value))
    }
  }

  return url
}

export async function apiRequest<T>({
  path,
  method = 'GET',
  token,
  body,
  query,
  schema,
}: RequestOptions<T>) {
  const headers = new Headers()
  let payload: BodyInit | undefined

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (body instanceof FormData) {
    payload = body
  } else if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
    payload = JSON.stringify(body)
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: payload,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const parsedError = apiErrorSchema.safeParse(data)
    const fallbackMessage = typeof data === 'string' && data ? data : response.statusText
    const message =
      parsedError.success && parsedError.data.detail?.length
        ? parsedError.data.detail.map((item) => item.msg).join(', ')
        : fallbackMessage || 'Request failed'

    throw new ApiError(response.status, message, data)
  }

  if (!schema) {
    return data as T
  }

  return schema.parse(data)
}
