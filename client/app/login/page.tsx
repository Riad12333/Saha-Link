"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/auth"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError(t("auth.empty_fields"))
      return
    }

    setIsLoading(true)
    try {
      // Use authService directly instead of useAuth hook
      const data = await authService.login({ email, password })

      // Trigger update in Header
      window.dispatchEvent(new Event('auth-change'))

      // Redirect based on role
      if (data.role === 'admin') router.push('/admin/dashboard')
      else if (data.role === 'doctor') router.push('/doctor/dashboard')
      else router.push('/patient/dashboard')

    } catch (err: any) {
      setError(err.message || t("auth.login_failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">{t("auth.login_title")}</CardTitle>
          <CardDescription>{t("auth.login_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.email_label")}</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.password_label")}</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  dir="ltr"
                  className="pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <Link href="/forgot-password" className="text-primary hover:underline">
                {t("auth.forgot_password")}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("auth.logging_in") : t("auth.login_btn")}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t("auth.no_account")}{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                {t("auth.register_link")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

