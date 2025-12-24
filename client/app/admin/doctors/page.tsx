"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, Clock, Ban, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchDoctors = async () => {
    try {
      const token = authService.getToken()
      const response = await fetch(api.adminDoctors, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setDoctors(data.data)
      }
    } catch (error) {
      console.error("Error fetching doctors:", error)
      toast.error("Erreur lors du chargement des médecins")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      const token = authService.getToken()
      const response = await fetch(api.adminApproveDoctor(id), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success("Médecin approuvé avec succès")
        fetchDoctors()
      }
    } catch (error) {
      console.error("Error approving doctor:", error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce médecin ?")) return

    try {
      const token = authService.getToken()
      const response = await fetch(api.adminUser(userId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success("Médecin supprimé avec succès")
        fetchDoctors()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting doctor:", error)
    }
  }

  const filteredDoctors = doctors.filter((d) =>
    d.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Médecins</h1>
          <p className="text-muted-foreground">Gérer et valider les comptes des médecins et spécialistes</p>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un médecin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-4 pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Chargement...</div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-4">Aucun médecin trouvé</div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{doctor.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {doctor.isApproved && (
                        <>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Note</p>
                            <p className="font-semibold">{doctor.averageRating?.toFixed(1) || 0}/5</p>
                          </div>
                        </>
                      )}
                      <div>
                        {doctor.isApproved ? (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Approuvé
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            <Clock className="w-3 h-3" />
                            En attente
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!doctor.isApproved && (
                          <Button size="sm" className="text-xs" onClick={() => handleApprove(doctor._id)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(doctor.user?._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
