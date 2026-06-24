import { apiRequest } from '@/lib/api/client'
import { googleAuthUrlSchema, userSchema } from '@/lib/api/schemas'

export function getGoogleAuthUrl() {
  return apiRequest({
    path: '/api/v1/auth/google',
    schema: googleAuthUrlSchema,
  })
}

export function getMe(token: string) {
  return apiRequest({
    path: '/api/v1/auth/me',
    token,
    schema: userSchema,
  })
}
