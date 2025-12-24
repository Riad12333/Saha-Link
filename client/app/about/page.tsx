"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Award, Shield, Target, Eye, Sparkles, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useLanguage } from "@/providers/language-provider"
import { api } from "@/lib/api"

export default function AboutPage() {
    const { t } = useLanguage()
    const [realStats, setRealStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        specialties: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(api.stats)
                const result = await response.json()
                if (result.success) {
                    setRealStats(result.data)
                }
            } catch (error) {
                console.error("Error fetching stats:", error)
            }
        }
        fetchStats()
    }, [])

    const stats = [
        { label: t("about.stats_doctors"), value: `${realStats.doctors}+`, icon: Users, color: "text-blue-500" },
        { label: t("about.stats_patients"), value: `${realStats.patients}+`, icon: Heart, color: "text-emerald-500" },
        { label: t("about.stats_consultations"), value: `${realStats.appointments}+`, icon: Award, color: "text-amber-500" },
        { label: t("about.stats_experience"), value: "15+", icon: Shield, color: "text-primary" }
    ]

    const values = [
        {
            icon: Heart,
            title: t("about.value1_title"),
            description: t("about.value1_desc"),
            gradient: "from-emerald-500/20 to-emerald-500/5"
        },
        {
            icon: Shield,
            title: t("about.value2_title"),
            description: t("about.value2_desc"),
            gradient: "from-blue-500/20 to-blue-500/5"
        },
        {
            icon: Award,
            title: t("about.value3_title"),
            description: t("about.value3_desc"),
            gradient: "from-amber-500/20 to-amber-500/5"
        },
        {
            icon: Users,
            title: t("about.value4_title"),
            description: t("about.value4_desc"),
            gradient: "from-primary/20 to-primary/5"
        }
    ]

    const team = [
        {
            name: "Dr. Ahmed Ben Mohamed",
            role: "Fondateur & CEO",
            description: "Ancien Chef de Service, précurseur de la e-santé en Algérie."
        },
        {
            name: "M. Khaled El Arabi",
            role: "CTO",
            description: "Expert en architecture cloud et sécurité des données médicales."
        },
        {
            name: "Dr. Fatma Zahra",
            role: "Directrice Médicale",
            description: "Spécialiste en coordination de soins et protocoles de télémédecine."
        },
        {
            name: "Mme. Sarah Ben Ali",
            role: "Directrice UX/UI",
            description: "Passionnée par la création d'interfaces simples pour tous les patients."
        }
    ]

    return (
        <main className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1 overflow-hidden">
                {/* Hero Section - Premium Style */}
                <section className="relative w-full py-24 md:py-32 overflow-hidden border-b">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/5 -z-10" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -mr-64 -mt-64" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -ml-64 -mb-64" />

                    <div className="container px-4 md:px-6 relative">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 animate-pulse">
                                <Sparkles className="w-4 h-4" />
                                <span>L'innovation au service de votre santé</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                                {t("about.hero_title")}
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                                {t("about.hero_subtitle")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision - Modern Grid */}
                <section className="w-full py-20 bg-background relative">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-primary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
                                <Card className="relative border-none shadow-xl bg-white/70 backdrop-blur-md overflow-hidden h-full">
                                    <CardContent className="p-10">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                                            <Target className="w-8 h-8 text-emerald-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-6">{t("about.mission_title")}</h2>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            {t("about.mission_desc")}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-primary/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
                                <Card className="relative border-none shadow-xl bg-white/70 backdrop-blur-md overflow-hidden h-full">
                                    <CardContent className="p-10">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                                            <Eye className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold mb-6">{t("about.vision_title")}</h2>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            {t("about.vision_desc")}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section - Clean & Impactful */}
                <section className="w-full py-20 bg-slate-900 text-white overflow-hidden">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-500">
                                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Values - Cards with Gradient Borders */}
                <section className="w-full py-24 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight">{t("about.values_title")}</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {t("about.values_subtitle")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {values.map((value, index) => (
                                <div key={index} className="group relative">
                                    <div className={`absolute -inset-0.5 bg-gradient-to-br ${value.gradient} rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-500`} />
                                    <Card className="relative h-full border-none shadow-lg bg-card hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                                        <CardContent className="p-8">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                                <value.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <h3 className="font-bold text-xl mb-3">{value.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Story - Engaging Layout */}
                <section className="w-full py-24 bg-muted/30 relative">
                    <div className="container px-4 md:px-6 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                            <div className="space-y-8">
                                <h2 className="text-4xl font-bold tracking-tight">{t("about.story_title")}</h2>
                                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                    <p className="relative pl-6 border-l-4 border-primary/50">{t("about.story_p1")}</p>
                                    <p>{t("about.story_p2")}</p>
                                    <p className="font-medium text-foreground italic">"{t("about.story_p3")}"</p>
                                </div>
                                <div className="flex flex-wrap gap-4 pt-4 text-sm font-semibold">
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                                        <CheckCircle2 className="w-4 h-4 text-primary" /> Sécurisé
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                                        <CheckCircle2 className="w-4 h-4 text-primary" /> 100% Algérien
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
                                        <CheckCircle2 className="w-4 h-4 text-primary" /> Innovant
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-blue-600/40 mix-blend-multiply transition-opacity group-hover:opacity-70" />
                                <img
                                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                                    alt="Medical Innovation"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                    <p className="text-white text-sm font-medium">SahaLink : Pionnier de la santé numérique en Algérie depuis le premier jour.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section - Clean Grid */}
                <section className="w-full py-24 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight">{t("about.team_title")}</h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {t("about.team_subtitle")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {team.map((member, index) => (
                                <Card key={index} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-center bg-card">
                                    <CardContent className="p-8">
                                        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-background group-hover:ring-primary/20 transition-all duration-500">
                                            <Users className="w-12 h-12 text-primary/40" />
                                        </div>
                                        <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                                        <p className="text-sm font-bold text-primary mb-4 tracking-wider uppercase">{member.role}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA - Final Push */}
                <section className="w-full py-24 px-4">
                    <div className="max-w-6xl mx-auto relative rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/30 rounded-full blur-[100px] -mr-48 -mt-48" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -ml-24 -mb-24" />

                        <div className="relative z-10 p-12 md:p-20 text-center space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                Rejoignez l'élite de la <br /> <span className="text-primary">santé numérique</span>
                            </h2>
                            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                                Que vous soyez patient en quête de soins ou professionnel souhaitant moderniser sa pratique, SahaLink est votre partenaire.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-4">
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl w-full shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-105">
                                        {t("about.cta_register")}
                                    </Button>
                                </Link>
                                <Link href="/doctors" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl w-full border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm">
                                        {t("about.cta_find_doctor")}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}

