"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Video, MessageSquare, CheckCircle, XCircle, AlertCircle, Search, Filter } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"
import Link from "next/link"
import { ChatDialog } from "@/components/chat/ChatDialog"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [chatOpen, setChatOpen] = useState(false)
  const [chatRecipient, setChatRecipient] = useState<{ id: string, name: string } | null>(null)

  const openChat = (patientId: string, patientName: string) => {
    setChatRecipient({ id: patientId, name: patientName })
    setChatOpen(true)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    let filtered = [...appointments]

    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(apt => apt.type === typeFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, statusFilter, typeFilter])

  const fetchAppointments = async () => {
    try {
      const token = authService.getToken()
      const response = await fetch(api.appointments, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        const appointmentsData = result.data || result || []
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
        setFilteredAppointments(Array.isArray(appointmentsData) ? appointmentsData : [])
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast.error("Erreur lors du chargement des rendez-vous")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    try {
      const token = authService.getToken()
      const response = await fetch(api.appointment(id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      const result = await response.json()
      if (result.success) {
        toast.success(status === 'confirmed' ? 'Rendez-vous confirmé' : 'Rendez-vous refusé')
        await fetchAppointments()
      } else {
        toast.error(result.message || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setUpdatingId(null)
    }
  }

  const AppointmentCard = ({ apt }: { apt: any }) => (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-bold text-lg">{apt.patient?.name || apt.patient?.user?.name || 'Patient'}</p>
              <Badge className={
                apt.status === "confirmed" ? "bg-green-500" :
                  apt.status === "pending" ? "bg-yellow-500" :
                    apt.status === "completed" ? "bg-blue-500" :
                      "bg-red-500"
              }>
                {apt.status === "confirmed" ? "Confirmé" :
                  apt.status === "pending" ? "En attente" :
                    apt.status === "completed" ? "Terminé" :
                      "Annulé"}
              </Badge>
            </div>
            <div className="space-y-2 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(apt.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {apt.slot?.start || apt.time || 'N/A'} - {apt.slot?.end || 'N/A'}
              </div>
              <div className="flex items-center gap-2">
                {apt.type === "online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                {apt.type === "online" ? "Consultation en ligne" : "Consultation au cabinet"}
              </div>
              {apt.reason && (
                <div className="mt-2">
                  <span className="font-medium">Motif:</span> {apt.reason}
                </div>
              )}
            </div>
            {apt.notes && (
              <div className="mt-3 p-3 bg-muted rounded">
                <p className="text-sm">{apt.notes}</p>
              </div>
            )}
          </div>
        </div>

        {apt.status === "pending" && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(apt._id, "confirmed")}
              className="flex-1"
              disabled={updatingId === apt._id}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {updatingId === apt._id ? "Traitement..." : "Accepter"}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleUpdateStatus(apt._id, "cancelled")}
              className="flex-1"
              disabled={updatingId === apt._id}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Refuser
            </Button>
          </div>
        )}

        {apt.status === "confirmed" && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => openChat(
                apt.patient?._id, // Controller populates 'patient' with User document, so ._id IS the User ID
                apt.patient?.name || 'Patient'
              )}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            {apt.status === "confirmed" && apt.type === "online" && (
              <Link href={`/teleconsultation/${apt._id}`} className="flex-1">
                <Button size="sm" className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Démarrer consultation
                </Button>
              </Link>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleUpdateStatus(apt._id, "completed")}
            >
              Terminer
            </Button>
          </div>
        )}

        {apt.status === "completed" && (
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Link href={`/doctor/patients`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  Voir dossier patient
                </Button>
              </Link>
              {apt.prescription && (
                <Button size="sm" variant="outline">
                  Voir ordonnance
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const pendingApts = filteredAppointments.filter((a) => a.status === "pending")
  const confirmedApts = filteredAppointments.filter((a) => a.status === "confirmed")
  const completedApts = filteredAppointments.filter((a) => a.status === "completed")
  const upcomingApts = [...pendingApts, ...confirmedApts].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary animate-spin" />
        </div>
        <p className="text-muted-foreground mt-4">Chargement des rendez-vous...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mon Agenda</h1>
        <p className="text-muted-foreground">Gérez tous vos rendez-vous et consultations</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmés</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="online">En ligne</SelectItem>
                <SelectItem value="in-person">Au cabinet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Appointments Alert */}
      {pendingApts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Rendez-vous en Attente ({pendingApts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Vous avez {pendingApts.length} rendez-vous en attente de validation
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            À venir ({upcomingApts.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({pendingApts.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminés ({completedApts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingApts.length > 0 ? (
            upcomingApts.map((apt) => <AppointmentCard key={apt._id} apt={apt} />)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun rendez-vous à venir</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingApts.length > 0 ? (
            pendingApts.map((apt) => <AppointmentCard key={apt._id} apt={apt} />)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun rendez-vous en attente</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApts.length > 0 ? (
            completedApts.map((apt) => <AppointmentCard key={apt._id} apt={apt} />)
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">Aucun rendez-vous terminé</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
