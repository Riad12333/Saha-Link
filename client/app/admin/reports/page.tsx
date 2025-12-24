"use client"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = authService.getToken()
        const response = await fetch(api.adminStats, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error("Error fetching report stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const COLORS = ["#0066cc", "#10b981"]

  if (loading) return <div className="p-8">Chargement des rapports...</div>
  if (!data) return <div className="p-8">Erreur de chargement des données opérationnelles.</div>

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rapports & Analytiques</h1>
          <p className="text-muted-foreground">Performance globale de la plateforme SahaLink</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus (DA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} DA`, 'Revenu']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="revenue" fill="#0066cc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des Consultations</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.consultationTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.consultationTypes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {data.consultationTypes.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-xs font-medium text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
