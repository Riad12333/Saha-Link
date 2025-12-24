"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Users, Stethoscope, BookOpen, BarChart3, Settings, LogOut, Menu, X, Calendar } from "lucide-react"
import { useState } from "react"

export function AdminSidebar() {
  const { logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      label: "Tableau de Bord",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Gestion Patients",
      href: "/admin/patients",
      icon: Users,
    },
    {
      label: "Gestion Médecins",
      href: "/admin/doctors",
      icon: Stethoscope,
    },
    {
      label: "Gestion Contenu",
      href: "/admin/content",
      icon: BookOpen,
    },
    {
      label: "Rendez-vous",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      label: "Rapports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      label: "Paramètres",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </Button>

      <aside
        className={`w-64 bg-card border-r border-border flex flex-col transition-all duration-300 ${mobileMenuOpen ? "block" : "hidden"
          } md:block fixed md:static h-full z-40`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Administration</p>
              <p className="text-xs text-muted-foreground">SahaLink</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  )
}
