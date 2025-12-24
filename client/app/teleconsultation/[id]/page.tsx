"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, User, ShieldCheck, Loader2, ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

declare global {
    interface Window {
        JitsiMeetExternalAPI: any
    }
}

export default function TeleconsultationPage() {
    const params = useParams()
    const router = useRouter()
    const [appointment, setAppointment] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const token = authService.getToken()
                const user = authService.getUser()

                if (!token || !user) {
                    router.push("/login")
                    return
                }

                const response = await fetch(api.appointment(params.id as string), {
                    headers: { Authorization: `Bearer ${token}` }
                })

                const result = await response.json()

                if (result.success && result.data) {
                    const apt = result.data
                    const currentUserId = user._id

                    // Check if patient or doctor of this appointment
                    const isPatient = apt.patient?._id === currentUserId || apt.patient === currentUserId
                    const isDoctor = apt.doctor?.user?._id === currentUserId || apt.doctor?.user === currentUserId || apt.doctor === currentUserId

                    if (isPatient || isDoctor) {
                        setAppointment(apt)
                        setIsAuthorized(true)
                        loadJitsiScript(apt._id)
                    } else {
                        toast.error("Vous n'êtes pas autorisé à rejoindre cette consultation")
                        router.push("/")
                    }
                } else {
                    toast.error("Rendez-vous non trouvé")
                    router.push("/")
                }
            } catch (error) {
                console.error("Error fetching appointment:", error)
                toast.error("Une erreur est survenue")
            } finally {
                setLoading(false)
            }
        }

        fetchAppointment()
    }, [params.id])

    const loadJitsiScript = (roomName: string) => {
        const script = document.createElement("script")
        script.src = "https://meet.jit.si/external_api.js"
        script.async = true
        script.onload = () => {
            const domain = "meet.jit.si"
            // Utilisation d'un préfixe unique pour éviter les restrictions de modération
            const secureRoomName = `ShifaTelemed_${roomName}_${roomName.substring(0, 8)}`

            const options = {
                roomName: secureRoomName,
                width: "100%",
                height: "100%",
                parentNode: document.querySelector("#jitsi-container"),
                userInfo: {
                    displayName: authService.getUser()?.name || "Participant Shifa"
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Participant Shifa',
                },
                configOverwrite: {
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    prejoinPageEnabled: false,
                    disableModeratorIndicator: true,
                    enableWelcomePage: false,
                    enableNoisyMicDetection: true,
                    p2p: {
                        enabled: true
                    }
                }
            }
            new window.JitsiMeetExternalAPI(domain, options)
        }
        document.body.appendChild(script)
    }

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Préparation de la salle de consultation...</p>
            </div>
        )
    }

    if (!isAuthorized) return null

    return (
        <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
            {/* Consultation Header */}
            <div className="bg-slate-800 text-white p-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-slate-700"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quitter
                    </Button>
                    <div className="h-6 w-px bg-slate-700 mx-2" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                            SC
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none">Consultation de {appointment.doctor?.user?.name || "Dr. Shifa"}</p>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-widest font-bold">
                                <ShieldCheck className="w-3 h-3 text-green-500" />
                                Connexion sécurisée bout-en-bout
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-xs text-slate-400">Patient: {appointment.patient?.name || "Patient"}</p>
                        <p className="text-xs text-slate-400 uppercase font-bold text-primary">ID: #{appointment._id?.substring(0, 8)}</p>
                    </div>
                </div>
            </div>

            {/* Video Container */}
            <div className="flex-1 relative">
                <div id="jitsi-container" className="absolute inset-0 w-full h-full bg-slate-900" />
            </div>

            {/* Footer Info (Mobile) */}
            <div className="md:hidden bg-slate-800 p-2 text-center border-t border-slate-700">
                <p className="text-[10px] text-slate-400">Pour une meilleure expérience, autorisez l'accès à votre caméra et microphone.</p>
            </div>
        </div>
    )
}
