"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, Shield, Database, LayoutDashboard, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import authService from "@/lib/auth"

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "SahaLink",
        siteEmail: "contact@sahalink.com",
        sitePhone: "+213 XXX XXX XXX",
        enableRegistration: true,
        requireEmailVerification: false,
        enableNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        maintenanceMode: false,
        maxAppointmentsPerDay: 10,
        appointmentDuration: 30,
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = authService.getToken()
                const response = await fetch(`${api.admin}/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const result = await response.json()
                if (result.success && result.data) {
                    setSettings(result.data)
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
                toast.error("Erreur lors du chargement des paramètres")
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = authService.getToken()
            const response = await fetch(`${api.admin}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            })
            const result = await response.json()
            if (result.success) {
                toast.success("Paramètres enregistrés avec succès")
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error("Error saving settings:", error)
            toast.error("Erreur lors de l'enregistrement")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Chargement des configurations...</span>
            </div>
        )
    }

    return (
        <main className="flex-1 p-6 md:p-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Configuration Système</h1>
                    <p className="text-muted-foreground">Gérez les paramètres globaux et les configurations de la plateforme</p>
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="general" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Général
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="security" className="gap-2">
                            <Shield className="w-4 h-4" />
                            Sécurité
                        </TabsTrigger>
                        <TabsTrigger value="appointments" className="gap-2">
                            <Database className="w-4 h-4" />
                            Rendez-vous
                        </TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-4">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Informations du site</CardTitle>
                                <CardDescription>Configurez les informations publiques et l'état du site</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Nom de la Plateforme</Label>
                                    <Input
                                        id="siteName"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="bg-muted/30"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="siteEmail">Email de contact officiel</Label>
                                    <Input
                                        id="siteEmail"
                                        type="email"
                                        value={settings.siteEmail}
                                        onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                        className="bg-muted/30"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sitePhone">Numéro de téléphone</Label>
                                    <Input
                                        id="sitePhone"
                                        value={settings.sitePhone}
                                        onChange={(e) => setSettings({ ...settings, sitePhone: e.target.value })}
                                        className="bg-muted/30"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-dashed">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Mode maintenance</Label>
                                        <p className="text-sm text-muted-foreground">Désactiver l'accès public pendant les mises à jour</p>
                                    </div>
                                    <Switch
                                        checked={settings.maintenanceMode}
                                        onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Settings */}
                    <TabsContent value="notifications" className="space-y-4">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Canaux de Communication</CardTitle>
                                <CardDescription>Gérez comment la plateforme communique avec les membres</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3">
                                    <div className="space-y-0.5">
                                        <Label>Système global de notifications</Label>
                                        <p className="text-sm text-muted-foreground">Activer/Désactiver toutes les alertes</p>
                                    </div>
                                    <Switch
                                        checked={settings.enableNotifications}
                                        onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-4 border rounded-xl">
                                        <div className="space-y-0.5">
                                            <Label>Alertes Email</Label>
                                            <p className="text-xs text-muted-foreground">Envoi de rapports et confirmations</p>
                                        </div>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                                            disabled={!settings.enableNotifications}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-xl">
                                        <div className="space-y-0.5">
                                            <Label>Alertes SMS</Label>
                                            <p className="text-xs text-muted-foreground">Rappels urgents (frais applicables)</p>
                                        </div>
                                        <Switch
                                            checked={settings.smsNotifications}
                                            onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                                            disabled={!settings.enableNotifications}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="space-y-4">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Protection & Accès</CardTitle>
                                <CardDescription>Sécurité des comptes et validation des utilisateurs</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Autoriser les nouvelles inscriptions</Label>
                                        <p className="text-sm text-muted-foreground">Permet aux visiteurs de créer un compte</p>
                                    </div>
                                    <Switch
                                        checked={settings.enableRegistration}
                                        onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Vérification d'identité obligatoire</Label>
                                        <p className="text-sm text-muted-foreground">Exiger la validation de l'email avant accès</p>
                                    </div>
                                    <Switch
                                        checked={settings.requireEmailVerification}
                                        onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appointments Settings */}
                    <TabsContent value="appointments" className="space-y-4">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <CardTitle>Règles de Réservation</CardTitle>
                                <CardDescription>Configuration par défaut des créneaux médicaux</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="maxAppointments">Limite de RDV / jour / médecin</Label>
                                    <Input
                                        id="maxAppointments"
                                        type="number"
                                        value={settings.maxAppointmentsPerDay}
                                        onChange={(e) => setSettings({ ...settings, maxAppointmentsPerDay: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Durée moyenne d'une séance (min)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={settings.appointmentDuration}
                                        onChange={(e) => setSettings({ ...settings, appointmentDuration: parseInt(e.target.value) })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline">Annuler</Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="min-w-[150px]"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer les modifications"
                        )}
                    </Button>
                </div>
            </div>
        </main>
    )
}
