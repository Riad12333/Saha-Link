"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save, User, MapPin, Stethoscope, Languages, BadgeDollarSign, Info } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import authService from "@/lib/auth"
import { api } from "@/lib/api"

const doctorProfileSchema = z.object({
    bio: z.string().min(10, "La bio doit contenir au moins 10 caractères").optional(),
    city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
    clinicAddress: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    experience: z.coerce.number().min(0, "L'expérience ne peut pas être négative"),
    consultationFeesOnline: z.coerce.number().min(0),
    consultationFeesInPerson: z.coerce.number().min(0),
    languages: z.string().min(2, "Veuillez indiquer au moins une langue"),
})

type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>

export default function DoctorSettingsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [doctorProfile, setDoctorProfile] = useState<any>(null)
    const [avatarPreview, setAvatarPreview] = useState("")
    const [avatarBase64, setAvatarBase64] = useState("")

    const form = useForm<DoctorProfileFormValues>({
        resolver: zodResolver(doctorProfileSchema),
        defaultValues: {
            bio: "",
            city: "",
            clinicAddress: "",
            experience: 0,
            consultationFeesOnline: 0,
            consultationFeesInPerson: 0,
            languages: "",
        },
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const currentUser = await authService.getCurrentUser()
            if (!currentUser) {
                router.push("/login")
                return
            }
            setUser(currentUser)
            setAvatarPreview(currentUser.avatar || "")
            setAvatarBase64(currentUser.avatar || "")

            // Fetch full doctor profile if available
            if (currentUser.doctorProfile) {
                // If we have an ID, fetch the latest details
                const doctorId = typeof currentUser.doctorProfile === 'string'
                    ? currentUser.doctorProfile
                    : currentUser.doctorProfile._id

                const token = authService.getToken()
                const response = await fetch(api.doctor(doctorId), {
                    headers: { Authorization: `Bearer ${token}` }
                })

                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        const doc = result.data
                        setDoctorProfile(doc)
                        if (doc.user?.avatar) {
                            setAvatarPreview(doc.user.avatar)
                            setAvatarBase64(doc.user.avatar)
                        }

                        // Set form values
                        form.reset({
                            bio: doc.bio || "",
                            city: doc.city || "",
                            clinicAddress: doc.clinicAddress || "",
                            experience: doc.experience || 0,
                            consultationFeesOnline: doc.consultationFees?.online || 0,
                            consultationFeesInPerson: doc.consultationFees?.inPerson || 0,
                            languages: Array.isArray(doc.languages) ? doc.languages.join(", ") : (doc.languages || ""),
                        })
                    }
                }
            }
        } catch (error) {
            console.error("Error loading settings:", error)
            toast.error("Erreur lors du chargement de vos paramètres")
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("L'image ne doit pas dépasser 2 Mo")
            return
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Veuillez sélectionner un fichier image valide")
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            setAvatarPreview(base64String)
            setAvatarBase64(base64String)
        }
        reader.readAsDataURL(file)
    }

    const clearAvatar = () => {
        setAvatarPreview("")
        setAvatarBase64("")
    }

    const onSubmit = async (data: DoctorProfileFormValues) => {
        if (!doctorProfile?._id) return

        setSaving(true)
        try {
            const token = authService.getToken()

            const payload = {
                bio: data.bio,
                city: data.city,
                clinicAddress: data.clinicAddress,
                experience: data.experience,
                languages: data.languages.split(",").map(lang => lang.trim()).filter(Boolean),
                consultationFees: {
                    online: data.consultationFeesOnline,
                    inPerson: data.consultationFeesInPerson
                },
                avatar: avatarBase64
            }

            const response = await fetch(api.doctor(doctorProfile._id), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (result.success) {
                const updatedUser = {
                    ...user,
                    avatar: result.data?.user?.avatar || result.data?.avatar || avatarBase64 || user.avatar
                }
                authService.setUser(updatedUser)
                setUser(updatedUser)
                window.dispatchEvent(new Event('auth-change'))
                toast.success("Profil mis à jour avec succès")
            } else {
                toast.error(result.message || "Erreur lors de la mise à jour")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Erreur lors de la mise à jour")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Paramètres</h1>
                <p className="text-muted-foreground">Gérez votre profil professionnel et vos préférences</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profil Public</TabsTrigger>
                    <TabsTrigger value="account">Compte</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations Professionnelles</CardTitle>
                            <CardDescription>
                                Ces informations seront visibles par les patients sur votre profil public.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* Photo de profil */}
                                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary shadow-inner">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Photo de profil" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-8 h-8 text-slate-300" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-bold text-slate-800">Photo de profil</h4>
                                        <p className="text-xs text-slate-400">PNG, JPG ou JPEG. Maximum 2 Mo.</p>
                                        <div className="flex gap-2 pt-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="relative rounded-lg text-xs h-8"
                                            >
                                                Changer la photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </Button>
                                            {avatarPreview && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearAvatar}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs h-8"
                                                >
                                                    Supprimer
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Info className="w-5 h-5" />
                                        <h3>À propos</h3>
                                    </div>
                                    <Separator />

                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Biographie</label>
                                        <Textarea
                                            placeholder="Décrivez votre parcours, votre approche..."
                                            className="min-h-[120px]"
                                            {...form.register("bio")}
                                        />
                                        {form.formState.errors.bio && (
                                            <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                        <MapPin className="w-5 h-5" />
                                        <h3>Localisation & Contact</h3>
                                    </div>
                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Ville</label>
                                            <Input {...form.register("city")} placeholder="Alger, Oran..." />
                                            {form.formState.errors.city && (
                                                <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Adresse du Cabinet</label>
                                            <Input {...form.register("clinicAddress")} placeholder="123 Rue de la Santé..." />
                                            {form.formState.errors.clinicAddress && (
                                                <p className="text-sm text-destructive">{form.formState.errors.clinicAddress.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                        <Stethoscope className="w-5 h-5" />
                                        <h3>Détails Médicaux</h3>
                                    </div>
                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Années d&apos;expérience</label>
                                            <Input type="number" {...form.register("experience")} />
                                            {form.formState.errors.experience && (
                                                <p className="text-sm text-destructive">{form.formState.errors.experience.message}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Langues parlées</label>
                                            <Input {...form.register("languages")} placeholder="Français, Arabe, Anglais..." />
                                            <p className="text-xs text-muted-foreground">Séparez les langues par des virgules</p>
                                            {form.formState.errors.languages && (
                                                <p className="text-sm text-destructive">{form.formState.errors.languages.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                                        <BadgeDollarSign className="w-5 h-5" />
                                        <h3>Tarifs (DA)</h3>
                                    </div>
                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Consultation en ligne</label>
                                            <Input type="number" {...form.register("consultationFeesOnline")} />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-sm font-medium">Consultation au cabinet</label>
                                            <Input type="number" {...form.register("consultationFeesInPerson")} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={saving} className="min-w-[150px]">
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Enregistrer les modifications
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du Compte</CardTitle>
                            <CardDescription>
                                Vos informations de connexion personnelles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Nom complet</label>
                                <Input value={user?.name || ""} disabled readOnly className="bg-muted" />
                                <p className="text-xs text-muted-foreground">Pour modifier votre nom, veuillez contacter l&apos;administrateur.</p>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input value={user?.email || ""} disabled readOnly className="bg-muted" />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Téléphone</label>
                                <Input value={user?.phone || ""} disabled readOnly className="bg-muted" />
                            </div>

                            <div className="pt-4">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Changer le mot de passe
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
