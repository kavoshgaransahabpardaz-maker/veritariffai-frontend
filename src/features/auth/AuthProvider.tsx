import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import type { User } from '@/lib/api/types'
import { queryClient } from '@/lib/queryClient'

const AUTH_STORAGE_KEY = 'veritariffai.auth'

type AuthTokens = {
  accessToken: string
  refreshToken?: string | null
}

type AuthContextValue = {
  tokens: AuthTokens | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setTokens: (tokens: AuthTokens | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredTokens(): AuthTokens | null {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as AuthTokens
    return parsed.accessToken ? parsed : null
  } catch {
    return null
  }
}

function persistTokens(tokens: AuthTokens | null) {
  if (!tokens) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens))
}

function consumeTokensFromLocation(): AuthTokens | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const search = new URLSearchParams(window.location.search)

  const accessToken =
    hash.get('access') ??
    hash.get('access_token') ??
    search.get('access') ??
    search.get('access_token')

  const refreshToken =
    hash.get('refresh') ??
    hash.get('refresh_token') ??
    search.get('refresh') ??
    search.get('refresh_token')

  if (!accessToken) {
    return null
  }

  const cleanUrl = new URL(window.location.href)
  cleanUrl.hash = ''
  cleanUrl.searchParams.delete('access')
  cleanUrl.searchParams.delete('access_token')
  cleanUrl.searchParams.delete('refresh')
  cleanUrl.searchParams.delete('refresh_token')
  window.history.replaceState({}, document.title, `${cleanUrl.pathname}${cleanUrl.search}`)

  const tokens = { accessToken, refreshToken }
  persistTokens(tokens)
  return tokens
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [tokens, setTokenState] = useState<AuthTokens | null>(() => {
    return consumeTokensFromLocation() ?? readStoredTokens()
  })

  const meQuery = useQuery({
    queryKey: ['auth', 'me', tokens?.accessToken],
    enabled: Boolean(tokens?.accessToken),
    queryFn: () => getMe(tokens!.accessToken),
    retry: false,
  })

  useEffect(() => {
    if (meQuery.error instanceof ApiError && meQuery.error.status === 401) {
      setTokenState(null)
      persistTokens(null)
      queryClient.removeQueries({ queryKey: ['auth'] })
    }
  }, [meQuery.error])

  const value = useMemo<AuthContextValue>(
    () => ({
      tokens,
      user: meQuery.data ?? null,
      isAuthenticated: Boolean(tokens?.accessToken),
      isLoading: Boolean(tokens?.accessToken) && meQuery.isLoading,
      setTokens(nextTokens) {
        setTokenState(nextTokens)
        persistTokens(nextTokens)
      },
      logout() {
        setTokenState(null)
        persistTokens(null)
        queryClient.clear()
      },
    }),
    [meQuery.data, meQuery.isLoading, tokens],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
