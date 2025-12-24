"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Stethoscope, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { api } from "@/lib/api"
import authService from "@/lib/auth"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = authService.getToken()
        const response = await fetch(api.adminStats, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-8">Chargement...</div>
  if (!stats) return <div className="p-8">Erreur de chargement des statistiques</div>

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patients</p>
                  <p className="text-2xl font-bold">{stats.totalPatients}</p>
                </div>
                <Users className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Médecins</p>
                  <p className="text-2xl font-bold">{stats.totalDoctors}</p>
                  <p className="text-xs text-muted-foreground">{stats.pendingDoctors} en attente</p>
                </div>
                <Stethoscope className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rendez-vous</p>
                  <p className="text-2xl font-bold">{stats.totalAppointments}</p>
                  <p className="text-xs text-muted-foreground">{stats.pendingAppointments} en attente</p>
                </div>
                <Calendar className="w-8 h-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold">{stats.satisfactionRate}/5</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {(stats.pendingDoctors > 0 || stats.unreadMessages > 0) && (
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Actions Requises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.pendingDoctors > 0 && (
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span>{stats.pendingDoctors} médecins en attente de validation</span>
                    <a href="/admin/doctors" className="text-sm font-semibold text-yellow-700 hover:underline">Voir</a>
                  </div>
                )}
                {stats.unreadMessages > 0 && (
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>{stats.unreadMessages} nouveaux messages de contact</span>
                    <a href="/admin/contacts" className="text-sm font-semibold text-blue-700 hover:underline">Voir</a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
