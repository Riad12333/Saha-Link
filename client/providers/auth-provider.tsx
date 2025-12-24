"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import authService from "@/lib/auth"

export type UserRole = "patient" | "doctor" | "admin"

export interface User {
  _id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const data = await authService.login({ email, password })
      setUser(data as User)
      window.dispatchEvent(new Event('auth-change'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    window.dispatchEvent(new Event('auth-change'))
  }, [])

  // Load user from authService on mount and when auth changes
  useEffect(() => {
    const loadUser = () => {
      const currentUser = authService.getUser()
      setUser(currentUser)
      setIsLoading(false)
    }

    loadUser()

    // Listen for auth changes
    window.addEventListener('auth-change', loadUser)
    window.addEventListener('storage', loadUser)

    return () => {
      window.removeEventListener('auth-change', loadUser)
      window.removeEventListener('storage', loadUser)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
