import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock, User, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
    const actions = [
        {
            title: "Mon Agenda",
            icon: Calendar,
            href: "/doctor/appointments",
            color: "text-blue-500",
            bgColor: "bg-blue-50 hover:bg-blue-100"
        },
        {
            title: "Mes Patients",
            icon: Users,
            href: "/doctor/patients",
            color: "text-green-500",
            bgColor: "bg-green-50 hover:bg-green-100"
        },
        {
            title: "Planning",
            icon: Clock,
            href: "/doctor/schedule",
            color: "text-orange-500",
            bgColor: "bg-orange-50 hover:bg-orange-100"
        },
        {
            title: "Mon Profil",
            icon: User,
            href: "/profile", // Adjusted to match likely profile route or generic
            color: "text-purple-500",
            bgColor: "bg-purple-50 hover:bg-purple-100"
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Accès Rapide</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action, index) => (
                        <Link key={index} href={action.href} className="w-full">
                            <div className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors cursor-pointer ${action.bgColor} h-full gap-3 border border-transparent hover:border-${action.color}/20`}>
                                <div className={`p-3 rounded-full bg-white shadow-sm ${action.color}`}>
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-sm text-center text-slate-700">{action.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
