"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DoctorProvider, useDoctor } from "@/providers/doctor-provider"
import { DoctorSidebar } from "@/components/layout/doctor-sidebar"
import { useLanguage } from "@/providers/language-provider"

function DoctorLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { doctorProfile, isLoading } = useDoctor()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated
      const authService = require("@/lib/auth").default
      const user = authService.getUser()
      const token = authService.getToken()

      // If no token or user, redirect to login
      if (!token || !user) {
        router.push("/login")
        return
      }

      // If user is not a doctor, redirect to home
      if (user.role !== 'doctor') {
        router.push("/")
        return
      }

      // If doctor profile doesn't exist yet, still allow access (they might need to create it)
      // The dashboard will handle showing appropriate message
    }
  }, [doctorProfile, isLoading, router])

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DoctorSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DoctorProvider>
      <DoctorLayoutContent>{children}</DoctorLayoutContent>
    </DoctorProvider>
  )
}
