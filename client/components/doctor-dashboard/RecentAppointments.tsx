import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MoreHorizontal, Calendar } from "lucide-react"
import Link from "next/link"

interface RecentAppointmentsProps {
    appointments: any[]
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Rendez-vous Récents</CardTitle>
                <Link href="/doctor/appointments">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        Tout voir
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {appointments && appointments.length > 0 ? (
                    <div className="space-y-4 pt-2">
                        {appointments.map((app) => (
                            <div key={app._id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {app.patient?.name || app.patient?.user?.name || 'Patient'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(app.date).toLocaleDateString()} - {app.slot?.start || app.time || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${app.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                                            app.status === 'pending' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                                app.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                    'bg-gray-50 text-gray-700 border border-gray-200'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Calendar className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">Aucun rendez-vous récent.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
