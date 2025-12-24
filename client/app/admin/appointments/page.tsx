"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchAppointments = async () => {
        try {
            const token = authService.getToken()
            const response = await fetch(api.appointments, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            if (result.success && Array.isArray(result.data)) {
                setAppointments(result.data)
            }
        } catch (error) {
            console.error("Error fetching appointments:", error)
            toast.error("Erreur lors du chargement des rendez-vous")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const filteredAppointments = appointments.filter((app) =>
        app.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.doctor?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"><CheckCircle className="w-3 h-3" /> Confirmé</span>
            case 'pending':
                return <span className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full"><Clock className="w-3 h-3" /> En attente</span>
            case 'cancelled':
                return <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full"><XCircle className="w-3 h-3" /> Annulé</span>
            case 'completed':
                return <span className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"><CheckCircle className="w-3 h-3" /> Terminé</span>
            default:
                return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">{status}</span>
        }
    }

    return (
        <main className="flex-1 p-6 md:p-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gestion des Rendez-vous</h1>
                    <p className="text-muted-foreground">Consulter et gérer tous les rendez-vous médicaux de la plateforme</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un patient ou un médecin..."
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
                                        <th className="text-left py-3 px-4 font-semibold">Patient</th>
                                        <th className="text-left py-3 px-4 font-semibold">Médecin</th>
                                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                                        <th className="text-left py-3 px-4 font-semibold">Heure</th>
                                        <th className="text-left py-3 px-4 font-semibold">Statut</th>
                                        <th className="text-left py-3 px-4 font-semibold">Tarif</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">Chargement...</td>
                                        </tr>
                                    ) : filteredAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">Aucun rendez-vous trouvé</td>
                                        </tr>
                                    ) : (
                                        filteredAppointments.map((app) => (
                                            <tr key={app._id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">{app.patient?.name || 'Inconnu'}</p>
                                                            <p className="text-xs text-muted-foreground">{app.patient?.phone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-muted-foreground" />
                                                        <p>{app.doctor?.user?.name || 'Inconnu'}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                                        {new Date(app.date).toLocaleDateString("fr-FR")}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        {app.time || app.slot?.start}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {getStatusBadge(app.status)}
                                                </td>
                                                <td className="py-3 px-4 font-medium">
                                                    {app.price || app.doctor?.consultationFees} دج
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
