"use client"

import type React from "react"
import { DoctorProvider } from "@/providers/doctor-provider"

export default function DoctorRegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DoctorProvider>{children}</DoctorProvider>
}
