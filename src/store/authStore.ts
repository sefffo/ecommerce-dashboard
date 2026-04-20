import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import type { DecodedToken, AuthUser } from '@/features/auth/types'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isSuperAdmin: boolean
  setTokens: (accessToken: string, refreshToken: string, displayName?: string) => void
  logout: () => void
  hydrateFromStorage: () => void
  updateAccessToken: (token: string) => void
}

function parseUser(token: string, displayName?: string): AuthUser | null {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const role =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded.role ||
      'User'
    return {
      email: decoded.email || decoded.sub || '',
      displayName: displayName || decoded.email || 'User',
      role,
    }
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isSuperAdmin: false,

  setTokens: (accessToken, refreshToken, displayName) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    const user = parseUser(accessToken, displayName)
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
      isSuperAdmin: user?.role === 'SuperAdmin',
    })
  },

  updateAccessToken: (token) => {
    localStorage.setItem('accessToken', token)
    const user = parseUser(token)
    set((s) => ({ accessToken: token, user: user || s.user }))
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isSuperAdmin: false })
  },

  hydrateFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      const user = parseUser(accessToken)
      if (user) {
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          isSuperAdmin: user.role === 'SuperAdmin',
        })
      }
    }
  },
}))
