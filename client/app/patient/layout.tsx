"use client"

import type React from "react"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { PatientSidebar } from "@/components/layout/patient-sidebar"
import { useLanguage } from "@/providers/language-provider"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role !== "patient") {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "patient") {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PatientSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
