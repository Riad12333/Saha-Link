"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Video, Filter, X, Download, Trash2, Search, MessageSquare } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"
import Link from "next/link"
import { ChatDialog } from "@/components/chat/ChatDialog"

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const [chatOpen, setChatOpen] = useState(false)
  const [chatRecipient, setChatRecipient] = useState<{ id: string, name: string } | null>(null)

  const openChat = (doctorId: string, doctorName: string) => {
    setChatRecipient({ id: doctorId, name: doctorName })
    setChatOpen(true)
  }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = authService.getToken()
        const response = await fetch(api.patientAppointments, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const result = await response.json()
        if (result.success && result.data) {
          const appointmentsData = Array.isArray(result.data) ? result.data : []
          setAppointments(appointmentsData)
          setFilteredAppointments(appointmentsData)
        } else {
          console.error("Failed to fetch appointments:", result)
          setAppointments([])
          setFilteredAppointments([])
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // Filter appointments
  useEffect(() => {
    let filtered = [...appointments]

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Filter by date
    if (dateFilter === "upcoming") {
      filtered = filtered.filter(apt => new Date(apt.date) >= new Date())
    } else if (dateFilter === "past") {
      filtered = filtered.filter(apt => new Date(apt.date) < new Date())
    }

    // Filter by search term (doctor name or specialty)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(apt =>
        apt.doctor?.user?.name?.toLowerCase().includes(searchLower) ||
        apt.doctor?.specialty?.toLowerCase().includes(searchLower) ||
        apt.reason?.toLowerCase().includes(searchLower)
      )
    }

    setFilteredAppointments(filtered)
  }, [appointments, statusFilter, dateFilter, searchTerm])

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      return
    }

    setCancellingId(appointmentId)
    try {
      const token = authService.getToken()
      const response = await fetch(api.appointment(appointmentId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Rendez-vous annulé avec succès")
        // Refresh appointments
        const refreshResponse = await fetch(api.patientAppointments, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const refreshResult = await refreshResponse.json()
        if (refreshResult.success && refreshResult.data) {
          setAppointments(Array.isArray(refreshResult.data) ? refreshResult.data : [])
        }
      } else {
        toast.error(result.message || "Erreur lors de l'annulation")
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Erreur lors de l'annulation")
    } finally {
      setCancellingId(null)
    }
  }

  const canCancelAppointment = (appointment: any) => {
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return false
    }
    const appointmentDate = new Date(appointment.date)
    const now = new Date()
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilAppointment >= 24
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge className="bg-green-500">Confirmé</Badge>
      case 'pending': return <Badge className="bg-yellow-500">En attente</Badge>
      case 'cancelled': return <Badge className="bg-red-500">Annulé</Badge>
      case 'completed': return <Badge className="bg-blue-500">Terminé</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) return <div className="p-8">Chargement des rendez-vous...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mes Rendez-vous</h1>
        <Link href="/doctors">
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Prendre un rendez-vous
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par docteur ou motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="past">Passés</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Vous n'avez aucun rendez-vous prévu.
          </CardContent>
        </Card>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Aucun rendez-vous ne correspond aux filtres sélectionnés.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt._id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">Dr. {apt.doctor?.user?.name || "Médecin"}</h3>
                      {getStatusBadge(apt.status)}
                    </div>
                    <p className="text-muted-foreground">{apt.doctor?.specialty || "Spécialité non renseignée"}</p>

                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(apt.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {apt.slot?.start || "N/A"} - {apt.slot?.end || "N/A"}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        {apt.type === 'online' ? (
                          <>
                            <Video className="w-4 h-4 mr-1" />
                            Consultation Vidéo
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 mr-1" />
                            Cabinet
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => openChat(
                          apt.doctor?.user?._id, // Controller populates doctor -> user, so we need doctor.user._id
                          apt.doctor?.user?.name || "Médecin"
                        )}
                        className="bg-primary"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    )}
                    {apt.type === 'online' && apt.status === 'confirmed' && (
                      <Link href={`/teleconsultation/${apt._id}`}>
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Rejoindre la vidéo
                        </Button>
                      </Link>
                    )}
                    {canCancelAppointment(apt) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelAppointment(apt._id)}
                        disabled={cancellingId === apt._id}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {cancellingId === apt._id ? "Annulation..." : "Annuler"}
                      </Button>
                    )}
                    {apt.status === 'completed' && apt.paymentStatus === 'paid' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement PDF download
                          toast.info("Téléchargement de la facture bientôt disponible")
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Facture PDF
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {chatRecipient && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
        />
      )}
    </div>
  )
}
