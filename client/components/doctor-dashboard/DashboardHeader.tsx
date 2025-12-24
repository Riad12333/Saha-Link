import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
    doctorName: string
}

export function DashboardHeader({ doctorName }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, Dr. {doctorName} 👋</h1>
                <p className="text-muted-foreground">Voici votre résumé d'activité pour aujourd'hui.</p>
            </div>
            <Link href="/">
                <Button variant="outline" size="sm">
                    <Home className="w-4 h-4 mr-2" />
                    Page d'accueil
                </Button>
            </Link>
        </div>
    )
}
