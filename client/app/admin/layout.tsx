"use client"

import type React from "react"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
