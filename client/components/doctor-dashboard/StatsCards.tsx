import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, Clock, DollarSign, CheckCircle, Video, Star, TrendingUp } from "lucide-react"

interface StatsType {
    appointmentsToday: number
    confirmedToday: number
    totalPatients: number
    activePatients: number
    pendingAppointments: number
    pendingTeleconsultations: number
    revenueWeek: number
    revenueMonth: number
    rating: number
    completedAppointments: number
}

interface StatsCardsProps {
    stats: StatsType
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="space-y-4">
            {/* Primary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">RDV Aujourd'hui</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">{stats.appointmentsToday || 0}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({stats.confirmedToday || 0} confirmés)
                                    </span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Patients Actifs</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">{stats.activePatients || 0}</span>
                                    <span className="text-xs text-muted-foreground">
                                        / {stats.totalPatients || 0} total
                                    </span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">En Attente</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">{stats.pendingAppointments || 0}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({stats.pendingTeleconsultations || 0} vidéo)
                                    </span>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-orange-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Revenus (Mois)</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">{(stats.revenueMonth || 0).toLocaleString('fr-FR')}</span>
                                    <span className="text-sm font-medium">DA</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {(stats.revenueWeek || 0).toLocaleString('fr-FR')} DA cette semaine
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-slate-50/50">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Note Moyenne</p>
                            <p className="text-2xl font-bold">{stats.rating?.toFixed(1) || '0.0'}/5</p>
                        </div>
                        <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">RDV Terminés</p>
                            <p className="text-2xl font-bold">{stats.completedAppointments || 0}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500/50" />
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/50">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Téléconsultations</p>
                            <p className="text-2xl font-bold">{stats.pendingTeleconsultations || 0}</p>
                            <p className="text-xs text-muted-foreground">En attente</p>
                        </div>
                        <Video className="h-8 w-8 text-purple-500/50" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
