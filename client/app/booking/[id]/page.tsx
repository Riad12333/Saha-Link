"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, Clock, User, Video, Landmark, AlertCircle } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function BookingPage() {
    const params = useParams()
    const router = useRouter()
    const [doctor, setDoctor] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState("")
    const [bookingType, setBookingType] = useState<"online" | "in-person">("online")
    const [reason, setReason] = useState("")
    const [notes, setNotes] = useState("")

    // Available time slots
    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ]

    useEffect(() => {
        const fetchDoctor = async () => {
            if (!params || !params.id) return
            const doctorId = Array.isArray(params.id) ? params.id[0] : params.id
            try {
                const response = await fetch(api.doctor(doctorId))
                if (response.ok) {
                    const result = await response.json()
                    setDoctor(result.data || result)
                } else {
                    toast.error("Impossible de charger les informations du médecin")
                }
            } catch (error) {
                console.error("Error fetching doctor:", error)
                toast.error("Erreur lors du chargement des informations du médecin")
            } finally {
                setLoading(false)
            }
        }

        fetchDoctor()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const user = authService.getUser()
        if (!user) {
            toast.error("Vous devez être connecté pour prendre un rendez-vous")
            router.push("/login")
            return
        }

        if (!selectedDate || !selectedTime) {
            toast.error("Veuillez sélectionner une date et une heure")
            return
        }

        if (!reason.trim()) {
            toast.error("Veuillez indiquer le motif de consultation")
            return
        }

        setSubmitting(true)

        try {
            const token = authService.getToken()
            if (!token) {
                toast.error("Session expirée, veuillez vous reconnecter")
                router.push("/login")
                return
            }

            const doctorId = Array.isArray(params?.id) ? params?.id[0] : params?.id

            const requestBody = {
                doctor: doctorId,
                date: selectedDate.toISOString(),
                time: selectedTime,
                type: bookingType,
                reason: reason.trim(),
                notes: notes.trim()
            }

            const response = await fetch(api.appointments, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            })

            const result = await response.json()

            if (response.ok && result.success) {
                toast.success("Rendez-vous envoyé avec succès! En attente de confirmation du médecin.")
                router.push("/patient/appointments")
            } else {
                toast.error(result.message || "Erreur lors de la création du rendez-vous")
            }
        } catch (error) {
            console.error("Error creating appointment:", error)
            toast.error("Une erreur est survenue")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-muted-foreground">Chargement des horaires...</p>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (!doctor) {
        return (
            <main className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8 bg-muted rounded-xl">
                        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-bold">Médecin non trouvé</h2>
                        <Button className="mt-4" onClick={() => router.push('/doctors')}>Retour aux médecins</Button>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    const currentFee = bookingType === 'online'
        ? doctor.consultationFees?.online
        : doctor.consultationFees?.inPerson

    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 bg-gradient-to-b from-primary/5 to-background py-12">
                <div className="container px-4 md:px-6 max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Prendre un rendez-vous</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            Réservez votre créneau avec <span className="font-semibold text-foreground">Dr. {doctor.user?.name}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar Info */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="overflow-hidden border-none shadow-lg">
                                <CardHeader className="bg-primary text-primary-foreground pb-8">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden mb-4 bg-white/10 flex items-center justify-center">
                                            {doctor.user?.avatar ? (
                                                <img
                                                    src={doctor.user.avatar.startsWith('/') ? doctor.user.avatar : `/${doctor.user.avatar}`}
                                                    alt={doctor.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-12 h-12" />
                                            )}
                                        </div>
                                        <CardTitle className="text-xl">Dr. {doctor.user?.name}</CardTitle>
                                        <p className="text-primary-foreground/80 text-sm">{doctor.specialty}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                            <Landmark className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Clinique / Wilaya</p>
                                            <p className="text-sm font-medium">{doctor.clinicAddress || "Cabinet médical"}</p>
                                            <p className="text-sm text-primary font-semibold">{doctor.city}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tarification Shifa</p>
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-muted">
                                            <div className="flex items-center gap-2">
                                                <Video className="w-4 h-4 text-primary" />
                                                <span className="text-sm">Consultation Vidéo</span>
                                            </div>
                                            <span className="font-bold">{doctor.consultationFees?.online} دج</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-muted">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-primary" />
                                                <span className="text-sm">En Cabinet</span>
                                            </div>
                                            <span className="font-bold">{doctor.consultationFees?.inPerson} دج</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm space-y-2">
                                <p className="font-bold text-primary flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Note importante
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    Votre rendez-vous sera effectif après confirmation du médecin. Vous recevrez une notification par email.
                                </p>
                            </div>
                        </div>

                        {/* Booking Form */}
                        <div className="lg:col-span-8">
                            <Card className="border-none shadow-xl">
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Type de Consultation */}
                                        <div className="space-y-4">
                                            <Label className="text-base font-bold">Mode de consultation</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div
                                                    onClick={() => setBookingType("online")}
                                                    className={cn(
                                                        "cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                                                        bookingType === "online" ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bookingType === "online" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                                        <Video className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">Vidéo sécurisée</p>
                                                        <p className="text-xs text-muted-foreground">Via la plateforme Shifa</p>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => setBookingType("in-person")}
                                                    className={cn(
                                                        "cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4",
                                                        bookingType === "in-person" ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bookingType === "in-person" ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                                        <Landmark className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">En présentiel</p>
                                                        <p className="text-xs text-muted-foreground">À la clinique du médecin</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Calendrier */}
                                            <div className="space-y-4">
                                                <Label className="text-base font-bold">Date de passage</Label>
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    disabled={(date) => date < new Date() || date.getDay() === 5} // Pas le vendredi
                                                    className="rounded-xl border shadow-inner"
                                                />
                                            </div>

                                            {/* Horaires */}
                                            <div className="space-y-4">
                                                <Label className="text-base font-bold">Créneau horaire</Label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {timeSlots.map((time) => (
                                                        <Button
                                                            key={time}
                                                            type="button"
                                                            variant={selectedTime === time ? "default" : "outline"}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={cn(
                                                                "w-full rounded-lg transition-all",
                                                                selectedTime === time ? "shadow-lg scale-105" : "hover:bg-primary/5 hover:text-primary hover:border-primary"
                                                            )}
                                                        >
                                                            {time}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Symptoms / Reason */}
                                        <div className="space-y-4 pt-4 border-t">
                                            <div className="grid grid-cols-1 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reason" className="font-bold">Motif de la consultation</Label>
                                                    <Input
                                                        id="reason"
                                                        value={reason}
                                                        onChange={(e) => setReason(e.target.value)}
                                                        placeholder="Ex: Douleurs abdominales, Fièvre, Contrôle périodique..."
                                                        className="rounded-lg h-12"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="notes" className="font-bold">Description des symptômes (optionnel)</Label>
                                                    <Textarea
                                                        id="notes"
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Veuillez décrire brièvement ce que vous ressentez..."
                                                        className="rounded-lg min-h-[120px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recap & Submit */}
                                        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total à régler</p>
                                                <p className="text-3xl font-extrabold text-primary">{currentFee} <span className="text-lg">دج</span></p>
                                            </div>
                                            <div className="flex gap-4 w-full sm:w-auto">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => router.back()}
                                                    className="flex-1 sm:px-8"
                                                >
                                                    Retour
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={submitting || !selectedDate || !selectedTime}
                                                    className="flex-1 sm:px-12 h-12 text-lg font-bold shadow-xl shadow-primary/20"
                                                >
                                                    {submitting ? "Traitement..." : "Valider la demande"}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}
