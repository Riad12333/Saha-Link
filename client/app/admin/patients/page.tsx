"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Ban, Trash2, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPatients = async () => {
    try {
      const token = authService.getToken()
      const response = await fetch(`${api.adminUsers}?role=patient`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setPatients(data.data)
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      toast.error("Erreur lors du chargement des patients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) return

    try {
      const token = authService.getToken()
      const response = await fetch(api.adminUser(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success("Patient supprimé avec succès")
        fetchPatients()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const token = authService.getToken()
      const response = await fetch(api.adminToggleStatus(id), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        toast.success("Statut mis à jour")
        fetchPatients()
      }
    } catch (error) {
      console.error("Error toggling status:", error)
    }
  }

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Patients</h1>
          <p className="text-muted-foreground">Administrer tous les comptes patients de la plateforme</p>
        </div>

        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-4 pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Date d'inscription</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Chargement...</td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Aucun patient trouvé</td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient._id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm font-medium">{patient.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{patient.email}</td>
                        <td className="py-3 px-4 text-sm">{new Date(patient.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${patient.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                          >
                            {patient.isActive ? "Actif" : "Suspendu"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(patient._id)}
                              title={patient.isActive ? "Suspendre" : "Activer"}
                            >
                              {patient.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDelete(patient._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
