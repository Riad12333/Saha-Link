"use client"

import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import authService from "@/lib/auth"
import { useRouter } from "next/navigation"

export function Header() {
  const { language, toggleLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check auth status on mount and when local storage changes
    const checkAuth = () => {
      const currentUser = authService.getUser()
      setUser(currentUser)
    }

    checkAuth()

    // Listen for storage events (in case login happens in another tab)
    window.addEventListener('storage', checkAuth)

    // Custom event for same-tab login updates
    window.addEventListener('auth-change', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    router.push('/')
    window.dispatchEvent(new Event('auth-change'))
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'doctor') return '/doctor/dashboard'
    return '/patient/dashboard'
  }

  // Navigation items - always show public pages
  const publicNavItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.services", href: "/services" },
    { key: "nav.doctors", href: "/doctors" },
    { key: "nav.ai_assistant", href: "/ai-assistant" },
    { key: "nav.blog", href: "/blog" },
    { key: "nav.about", href: "/about" },
    { key: "nav.contact", href: "/contact" },
  ]

  // Get navigation items based on user role
  const getNavItems = () => {
    // All users (logged in or not) can access public pages
    return publicNavItems
  }

  const navItems = getNavItems()

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container h-16 flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-horizontal.svg" alt="SahaLink Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href}>
              <Button variant="ghost" size="sm">
                {t(item.key)}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="hidden sm:flex bg-transparent">
            {language === "ar" ? "FR" : "ع"}
          </Button>

          {/* Auth Buttons */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href={getDashboardLink()}>
                <Button variant="default" size="sm" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  {user.role === 'admin' ? 'Admin' : user.role === 'doctor' ? 'Agenda' : 'Dashboard'}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Déconnexion">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm">{t("nav.register")}</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.key} href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  {t(item.key)}
                </Button>
              </Link>
            ))}
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <Button variant="outline" onClick={toggleLanguage}>
                {language === "ar" ? "Français" : "العربية"}
              </Button>

              {user ? (
                <>
                  <Link href={getDashboardLink()}>
                    <Button className="w-full gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      {user.role === 'admin' ? 'Admin' : user.role === 'doctor' ? 'Agenda' : 'Dashboard'}
                    </Button>
                  </Link>
                  <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full">{t("nav.register")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
