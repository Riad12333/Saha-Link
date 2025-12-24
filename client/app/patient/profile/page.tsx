"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

export default function PatientProfilePage() {
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    useEffect(() => {
        const user = authService.getUser()
        if (user) {
            setProfile(prev => ({ ...prev, name: user.name, email: user.email, phone: user.phone || "" }))
        }
    }, [])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = authService.getToken()
            // Update basic info
            const response = await fetch(api.patientProfile, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone
                })
            })
            const data = await response.json()

            if (data.success) {
                toast.success("Profil mis à jour avec succès")
                // Update local storage user
                const currentUser = authService.getUser()
                authService.setUser({ ...currentUser, name: profile.name, phone: profile.phone })
            } else {
                toast.error(data.message || "Erreur lors de la mise à jour")
            }
        } catch (error) {
            toast.error("Erreur serveur")
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (profile.newPassword !== profile.confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas")
            return
        }

        setLoading(true)
        try {
            const token = authService.getToken()
            const response = await fetch(api.updatePassword, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: profile.currentPassword,
                    newPassword: profile.newPassword
                })
            })
            const data = await response.json()

            if (data.success) {
                toast.success("Mot de passe mis à jour")
                setProfile(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
            } else {
                toast.error(data.message || "Erreur lors du changement de mot de passe")
            }
        } catch (error) {
            toast.error("Erreur serveur")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Mon Profil</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                    id="name"
                                    value={profile.name}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={profile.email}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sécurité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={profile.currentPassword}
                                    onChange={e => setProfile({ ...profile, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={profile.newPassword}
                                    onChange={e => setProfile({ ...profile, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={profile.confirmPassword}
                                    onChange={e => setProfile({ ...profile, confirmPassword: e.target.value })}
                                />
                            </div>
                            <Button type="submit" variant="outline" disabled={loading}>
                                Changer le mot de passe
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
