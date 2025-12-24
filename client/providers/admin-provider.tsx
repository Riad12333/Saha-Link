"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface Admin {
  id: string
  email: string
  name: string
  role: "super-admin" | "moderator"
}

interface AdminContextType {
  admin: Admin | null
  loginAdmin: (email: string, password: string) => Promise<void>
  logoutAdmin: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)

  const loginAdmin = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (email === "admin@shifauk.com" && password === "admin123") {
      const adminUser: Admin = {
        id: "1",
        email,
        name: "مدير النظام",
        role: "super-admin",
      }
      setAdmin(adminUser)
      localStorage.setItem("admin", JSON.stringify(adminUser))
    } else {
      throw new Error("بيانات دخول خاطئة")
    }
  }

  const logoutAdmin = () => {
    setAdmin(null)
    localStorage.removeItem("admin")
  }

  return <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
