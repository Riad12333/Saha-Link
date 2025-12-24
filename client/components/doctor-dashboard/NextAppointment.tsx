import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Video, ArrowRight, User, Calendar } from "lucide-react"
import Link from "next/link"

interface NextAppointmentProps {
    appointment: any
}

export function NextAppointment({ appointment }: NextAppointmentProps) {
    // If no appointment, show placeholder
    if (!appointment) {
        return (
            <Card className="border-l-4 border-l-muted shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        Prochain Rendez-vous
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg text-muted-foreground">
                        <Calendar className="w-12 h-12 mb-3 opacity-20" />
                        <p>Pas de rendez-vous programmé prochainement.</p>
                        <Link href="/doctor/appointments" className="mt-4">
                            <Button variant="outline" size="sm">
                                Voir l'agenda
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const isConfirmed = appointment.status === 'confirmed'
    const isOnline = appointment.type === 'online'

    return (
        <Card className="border-l-4 border-l-primary shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Prochain Rendez-vous
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-4 bg-muted/30 rounded-lg">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    {appointment.patient?.name || appointment.patient?.user?.name || 'Patient'}
                                </h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Clock className="w-4 h-4" />
                                    {new Date(appointment.date).toLocaleDateString('fr-FR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long'
                                    })} à {appointment.slot?.start || appointment.time || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {appointment.reason && (
                            <div className="text-sm pl-15">
                                <span className="font-medium text-muted-foreground">Motif:</span> {appointment.reason}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isConfirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {isConfirmed ? 'Confirmé' : 'En attente'}
                            </span>
                            {isOnline && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 font-medium flex items-center gap-1">
                                    <Video className="w-3 h-3" /> Vidéo
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                        {isOnline && isConfirmed && (
                            <Link href={`/teleconsultation/${appointment._id}`}>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    <Video className="w-4 h-4 mr-2" />
                                    Lancer la vidéo
                                </Button>
                            </Link>
                        )}
                        <Link href="/doctor/appointments">
                            <Button variant="outline" className="w-full">
                                Voir détails
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
