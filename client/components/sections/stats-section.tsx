"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Users, CheckCircle, Stethoscope, Building2 } from "lucide-react"
import { api } from "@/lib/api"

export function StatsSection() {
  const { t } = useLanguage()
  const [statsData, setStatsData] = useState<any>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(api.stats)
        if (response.ok) {
          const data = await response.json()
          setStatsData(data.data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      icon: Users,
      value: statsData?.patients !== undefined ? statsData.patients.toLocaleString() : "...",
      label: t("stats.patients"),
    },
    {
      icon: CheckCircle,
      value: statsData?.appointments !== undefined ? statsData.appointments.toLocaleString() : "...",
      label: t("stats.consultations"),
    },
    {
      icon: Stethoscope,
      value: statsData?.doctors !== undefined ? statsData.doctors.toLocaleString() : "...",
      label: t("stats.doctors"),
    },
    {
      icon: Building2,
      value: statsData?.specialties !== undefined ? statsData.specialties.toLocaleString() : "...",
      label: "Spécialités", // Using specialties as a real stat instead of hardcoded partners
    },
  ]

  return (
    <section className="w-full py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
