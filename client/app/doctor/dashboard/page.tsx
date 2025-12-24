"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { DashboardHeader } from "@/components/doctor-dashboard/DashboardHeader"
import { StatsCards } from "@/components/doctor-dashboard/StatsCards"
import { NextAppointment } from "@/components/doctor-dashboard/NextAppointment"
import { RecentAppointments } from "@/components/doctor-dashboard/RecentAppointments"
import { RecentReviews } from "@/components/doctor-dashboard/RecentReviews"
import { QuickActions } from "@/components/doctor-dashboard/QuickActions"
import { Loader2 } from "lucide-react"

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>({
    stats: {},
    appointments: [],
    nextAppointment: null
  })
  const [reviews, setReviews] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)

        if (!currentUser) return

        const token = authService.getToken()

        // Fetch dashboard stats from backend
        // Note: Make sure api.doctorDashboard is defined in specific API file or replace with literal if needed
        const dashboardResponse = await fetch(api.doctorDashboard, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (dashboardResponse.ok) {
          const result = await dashboardResponse.json()
          if (result.success) {
            setData(result.data)
          }
        }

        // Fetch reviews
        if (currentUser.doctorProfile?._id) {
          const reviewsResponse = await fetch(api.doctorReviews(currentUser.doctorProfile._id), {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (reviewsResponse.ok) {
            const reviewsResult = await reviewsResponse.json()
            const reviewsData = reviewsResult.data || reviewsResult || []
            setReviews(Array.isArray(reviewsData) ? reviewsData.slice(0, 5) : [])
          }
        }

      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <DashboardHeader doctorName={user?.name || "Médecin"} />

      <StatsCards stats={data.stats} />

      <NextAppointment appointment={data.nextAppointment} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments appointments={data.appointments} />
        <RecentReviews reviews={reviews} />
      </div>

      <QuickActions />
    </div>
  )
}
