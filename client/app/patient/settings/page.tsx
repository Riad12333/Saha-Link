"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertCircle,
  User,
  Bell,
  Shield,
  Activity,
  Lock,
  Smartphone,
  CreditCard,
  Trash2,
  Save,
  Loader2,
  Clock,
  Heart,
  ArrowRight
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import authService from "@/lib/auth"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  })

  useEffect(() => {
    const userData = authService.getUser()
    if (userData) {
      setUser(userData)
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        city: userData.city || "",
        address: userData.address || "",
      })
    }
    setLoading(false)
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token = authService.getToken()
      const response = await fetch(api.patientProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      if (data.success) {
        authService.setUser(data.data)
        toast.success("Profil mis à jour avec succès")
      } else {
        toast.error(data.message || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast.error("Erreur serveur")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <main className="flex-1 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Paramètres <span className="text-primary">⚙️</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Gérez votre compte, vos préférences et votre sécurité.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto h-auto flex flex-wrap">
            <TabsTrigger value="profile" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              <Shield className="w-4 h-4 mr-2" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 pb-6">
                <CardTitle className="text-xl font-bold">Informations Personnelles</CardTitle>
                <CardDescription>Mettez à jour vos coordonnées de contact.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Nom Complet</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="rounded-xl bg-slate-50 border-slate-200 text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Téléphone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Wilaya (Ville)</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-primary/20"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest pl-1">Adresse Domicile</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="rounded-xl border-slate-200 focus:ring-primary/20"
                      placeholder="Rue, Numéro de porte..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving} className="rounded-full px-8 shadow-lg shadow-primary/20">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100">
                <CardTitle className="text-xl font-bold">Préférences de Notification</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez être alerté.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                <div className="space-y-4">
                  {[
                    { title: "Rappels de rendez-vous", desc: "Soyez prévenu 24h avant votre consultation.", icon: Clock },
                    { title: "Messages des médecins", desc: "Recevez une alerte quand un médecin vous écrit.", icon: Smartphone },
                    { title: "Nouvelles ordonnances", desc: "Validation de nouvelles prescriptions médicales.", icon: Activity },
                    { title: "Offres et Santé", desc: "Conseils bien-être et nouveautés plateforme.", icon: Heart },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-primary">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                        </div>
                      </div>
                      <Checkbox className="rounded-md border-slate-300 data-[state=checked]:bg-primary" defaultChecked={i < 2} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl font-bold">Sécurité du Compte</CardTitle>
                <CardDescription>Protégez vos données médicales sensibles.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid gap-4">
                  <Button variant="outline" className="h-auto py-4 px-6 rounded-2xl border-slate-100 bg-slate-50/50 justify-between items-center group hover:bg-white hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-primary transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Changer le mot de passe</p>
                        <p className="text-xs text-slate-500">Dernière modification il y a 3 mois.</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Button>

                  <Button variant="outline" className="h-auto py-4 px-6 rounded-2xl border-slate-100 bg-slate-50/50 justify-between items-center group hover:bg-white hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Méthodes de Paiement</p>
                        <p className="text-xs text-slate-500">Gérez vos cartes CIB et Edahabia.</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </Button>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100">
                  <Alert variant="destructive" className="rounded-3xl border-red-100 bg-red-50/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold">Zone Dangereuse</AlertTitle>
                    <AlertDescription className="text-xs font-medium">
                      La suppression du compte est irréversible et supprimera tout votre historique médical.
                    </AlertDescription>
                    <Button variant="destructive" className="mt-4 rounded-xl font-bold text-xs uppercase tracking-widest px-6 shadow-lg shadow-red-200">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer mon compte Shifa
                    </Button>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
