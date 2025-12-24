"use client"

import { useDoctor } from "@/providers/doctor-provider"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, Calendar, Clock, FileText, Users, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/providers/language-provider"

export function DoctorSidebar() {
  const { doctorProfile } = useDoctor()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    {
      label: t("sidebar.dashboard"),
      href: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("sidebar.appointments"),
      href: "/doctor/appointments",
      icon: Calendar,
    },
    {
      label: t("sidebar.time_management"),
      href: "/doctor/schedule",
      icon: Clock,
    },
    {
      label: t("sidebar.patients"),
      href: "/doctor/patients",
      icon: Users,
    },
    {
      label: "Messages",
      href: "/doctor/messages",
      icon: FileText,
    },
    {
      label: t("sidebar.settings"),
      href: "/doctor/settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("doctor")
    router.push("/")
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50 text-foreground"
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
              <span className="font-bold">Dr</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm line-clamp-1">{doctorProfile?.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{doctorProfile?.specialty}</p>
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
          <Button variant="outline" className="w-full bg-transparent justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            {t("sidebar.logout")}
          </Button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  )
}

