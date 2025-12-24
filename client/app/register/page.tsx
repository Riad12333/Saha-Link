"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import authService from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("patient")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    specialty: "",
    city: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setLoading(true)

    try {
      const result = await authService.register(
        formData.name,
        formData.email,
        formData.password,
        role,
        formData.phone,
        role === 'doctor' ? { specialty: formData.specialty, city: formData.city } : undefined
      )

      console.log('Registration successful:', result)
      toast.success("Inscription réussie !")

      // Trigger update in Header
      window.dispatchEvent(new Event('auth-change'))

      // Small delay to ensure localStorage is updated
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect based on role
      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'doctor') router.push('/doctor/dashboard')
      else router.push('/patient/dashboard')

    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || "Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>Rejoignez la plateforme Medecine App</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patient" onValueChange={(v) => setRole(v)} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Médecin</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="0555..." required value={formData.phone} onChange={handleChange} />
            </div>

            {role === 'doctor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Spécialité</Label>
                  <Select onValueChange={(v) => handleSelectChange(v, 'specialty')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Médecine Générale</SelectItem>
                      <SelectItem value="cardiology">Cardiologie</SelectItem>
                      <SelectItem value="dermatology">Dermatologie</SelectItem>
                      <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                      <SelectItem value="neurology">Neurologie</SelectItem>
                      <SelectItem value="ophthalmology">Ophtalmologie</SelectItem>
                      <SelectItem value="orthopedics">Orthopédie</SelectItem>
                      <SelectItem value="psychiatry">Psychiatrie</SelectItem>
                      <SelectItem value="dentistry">Dentisterie</SelectItem>
                      <SelectItem value="gynecology">Gynécologie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Select onValueChange={(v) => handleSelectChange(v, 'city')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alger">Alger</SelectItem>
                      <SelectItem value="Oran">Oran</SelectItem>
                      <SelectItem value="Constantine">Constantine</SelectItem>
                      <SelectItem value="Annaba">Annaba</SelectItem>
                      <SelectItem value="Blida">Blida</SelectItem>
                      <SelectItem value="Setif">Sétif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" minLength={6} required value={formData.password} onChange={handleChange} />
              <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" minLength={6} required value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création du compte..." : "S'inscrire"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
