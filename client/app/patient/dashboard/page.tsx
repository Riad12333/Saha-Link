"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  FileText,
  User,
  ArrowRight,
  Clock,
  Search,
  Heart,
  Activity,
  Bell,
  Stethoscope,
  Video,
  ShieldCheck,
  PlusCircle,
  Clock4,
  Droplet,
  Weight,
  Ruler
} from "lucide-react"
import Link from "next/link"
import authService from "@/lib/auth"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default function PatientDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = authService.getToken()
        const response = await fetch(api.patientDashboard, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const result = await response.json()
          setData(result.data)
        }
      } catch (error) {
        console.error("Error fetching patient dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50/50">
        <Activity className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  const { stats, nextAppointment, lastConsultation, followedDoctors, medicalRecord, favorites } = data || {}
  const user = authService.getUser()

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50 min-h-screen">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Bonjour, {user?.name?.split(' ')[0]} <span className="text-primary">👋</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Votre santé est notre priorité.</p>
        </div>
        <Link href="/doctors">
          <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouveau Rendez-vous
          </Button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "RDV Confirmés", value: stats?.upcomingAppointments || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "En Attente", value: stats?.pendingAppointments || 0, icon: Clock4, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Consultations", value: stats?.completedAppointments || 0, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Medical Record Quick View */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Dossier Médical (Aperçu)
                </CardTitle>
                <Link href="/patient/medical-record">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-primary italic">Détails</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {medicalRecord ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
                    <Droplet className="w-5 h-5 mx-auto text-red-500" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Groupe</p>
                    <p className="text-lg font-black text-slate-900">{medicalRecord.bloodType || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
                    <Ruler className="w-5 h-5 mx-auto text-blue-500" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Taille</p>
                    <p className="text-lg font-black text-slate-900">{medicalRecord.height || '--'} cm</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-1">
                    <Weight className="w-5 h-5 mx-auto text-emerald-500" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Poids</p>
                    <p className="text-lg font-black text-slate-900">{medicalRecord.weight || '--'} kg</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl text-center">
                  <p className="text-sm text-slate-500 italic">Complétez votre dossier pour un meilleur suivi.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Appointment Premium Card */}
          <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-primary to-blue-600 p-1" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Prochain Rendez-vous
                </CardTitle>
                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">Aujourd'hui / À venir</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {nextAppointment ? (
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary border border-slate-200">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Dr. {nextAppointment.doctor?.user?.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(nextAppointment.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200">
                        <Clock className="w-4 h-4 text-primary" />
                        {nextAppointment.slot?.start || nextAppointment.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {nextAppointment.type === 'online' && nextAppointment.status === 'confirmed' && (
                      <Button asChild className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                        <Link href={`/teleconsultation/${nextAppointment._id}`}>
                          <Video className="w-4 h-4 mr-2" />
                          Rejoindre
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" asChild className="rounded-xl border-slate-200 bg-white">
                      <Link href="/patient/appointments">
                        Détails
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <p className="text-slate-500 font-medium">Pas de rendez-vous programmé.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Mes RDV", icon: Calendar, href: "/patient/appointments", color: "bg-blue-50 text-blue-600" },
              { label: "Dossier Médical", icon: FileText, href: "/patient/medical-record", color: "bg-emerald-50 text-emerald-600" },
              { label: "Profil & Sécurité", icon: User, href: "/patient/settings", color: "bg-purple-50 text-purple-600" },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <div className="group p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-2">
                  <div className={`p-3 rounded-2xl ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-tighter">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-8">

          {/* Last Consultation */}
          {lastConsultation && (
            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-bold">Dernier passage</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {lastConsultation.doctor?.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">Dr. {lastConsultation.doctor?.user?.name}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {lastConsultation.doctor?.specialty}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-bold italic">"{lastConsultation.reason || 'Symptômes non précisés'}"</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Secure Health Data Badge */}
          <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl border-t-4 border-primary">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-sm uppercase tracking-tight">Données Protégées</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-medium">
                Votre dossier médical et vos informations personnelles sont chiffrés sur les serveurs sécurisés de Shifa Algérie.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
