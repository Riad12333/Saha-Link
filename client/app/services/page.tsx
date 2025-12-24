"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsSection } from "@/components/sections/stats-section"
import {
    Stethoscope,
    Heart,
    Brain,
    Baby,
    Eye,
    Bone,
    Activity,
    Pill,
    Users,
    Clock,
    Shield,
    Video,
    Calendar,
    FileText,
    Headphones,
    Award,
    Syringe,
    ClipboardList
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/providers/language-provider"
import { api } from "@/lib/api"

const iconMap: { [key: string]: any } = {
    "Cardiologie": Heart,
    "Neurologie": Brain,
    "Orthopédie": Activity,
    "Ophtalmologie": Eye,
    "Dermatologie": Bone,
    "Pédiatrie": Baby,
    "Médecine Générale": Stethoscope,
    "Dentisterie": Pill,
    "Gynécologie": Syringe,
    "Psychiatrie": Brain,
};

const defaultIcon = ClipboardList;

export default function ServicesPage() {
    const { t, language } = useLanguage()
    const [specialties, setSpecialties] = useState<any[]>([])
    const [loadingSpecialties, setLoadingSpecialties] = useState(true)

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await fetch(api.specialties)
                if (response.ok) {
                    const data = await response.json()
                    setSpecialties(data.data || [])
                }
            } catch (error) {
                console.error("Error fetching specialties:", error)
            } finally {
                setLoadingSpecialties(false)
            }
        }
        fetchSpecialties()
    }, [])

    const mainServices = [
        {
            icon: Video,
            title: t("services.consultation_title") || (language === 'fr' ? "Consultations en ligne" : "الاستشارات عبر الإنترنت"),
            description: t("services.consultation_desc"),
            features: language === 'fr' ? [
                "Appels vidéo de haute qualité",
                "Confidentialité et sécurité totale",
                "Gain de temps et d'effort",
                "Disponible 24/7"
            ] : [
                "مكالمات فيديو عالية الجودة",
                "خصوصية وأمان تام",
                "توفير الوقت والجهد",
                "متاح 24/7"
            ]
        },
        {
            icon: Calendar,
            title: t("services.appointment_title") || (language === 'fr' ? "Prise de rendez-vous" : "حجز المواعيد"),
            description: t("services.appointment_desc"),
            features: language === 'fr' ? [
                "Réservation immédiate et confirmée",
                "Choix de l'horaire approprié",
                "Rappels automatiques de rendez-vous",
                "Possibilité de reprogrammation"
            ] : [
                "حجز فوري ومؤكد",
                "اختيار الوقت المناسب",
                "تذكير تلقائي بالمواعيد",
                "إمكانية إعادة الجدولة"
            ]
        },
        {
            icon: FileText,
            title: t("services.records_title") || (language === 'fr' ? "Dossier médical électronique" : "السجل الطبي الإلكتروني"),
            description: t("services.records_desc"),
            features: language === 'fr' ? [
                "Stockage sûr et crypté",
                "Accès de n'importe où",
                "Partage facile avec les médecins",
                "Organisation automatique des fichiers"
            ] : [
                "تخزين آمن ومشفر",
                "الوصول من أي مكان",
                "مشاركة سهلة مع الأطباء",
                "تنظيم تلقائي للملفات"
            ]
        },
        {
            icon: Headphones,
            title: language === 'fr' ? "Support Technique" : "الدعم الفني",
            description: language === 'fr' ? "Une équipe de support toujours disponible pour vous aider pour toute question ou problème technique." : "فريق دعم متاح دائماً لمساعدتك في أي استفسار أو مشكلة تقنية",
            features: language === 'fr' ? [
                "Support technique 24/7",
                "Réponse rapide",
                "Solutions efficaces",
                "Instructions claires"
            ] : [
                "دعم فني 24/7",
                "استجابة سريعة",
                "حلول فعالة",
                "إرشادات واضحة"
            ]
        }
    ]

    const whyChooseUs = [
        {
            icon: Users,
            title: language === 'fr' ? "Médecins Certifiés" : "أطباء معتمدون",
            description: language === 'fr' ? "Tous nos médecins possèdent des certificats accrédités et une vaste expérience." : "جميع أطبائنا حاصلون على شهادات معتمدة وخبرة واسعة"
        },
        {
            icon: Clock,
            title: language === 'fr' ? "Toujours Disponible" : "متاح دائماً",
            description: language === 'fr' ? "Nos services sont disponibles 24 heures sur 24, 7 jours sur 7." : "خدماتنا متاحة على مدار الساعة طوال أيام الأسبوع"
        },
        {
            icon: Shield,
            title: language === 'fr' ? "Sécurité et Confidentialité" : "أمان وخصوصية",
            description: language === 'fr' ? "Nous protégeons vos données médicales avec les plus hauts standards de sécurité." : "نحمي بياناتك الطبية بأعلى معايير الأمان والتشفير"
        },
        {
            icon: Award,
            title: language === 'fr' ? "Haute Qualité" : "جودة عالية",
            description: language === 'fr' ? "Nous nous engageons à fournir le meilleur service médical selon les normes internationales." : "نلتزم بتقديم أفضل خدمة طبية بمعايير عالمية"
        }
    ]

    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("services.hero_title")}</h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                {t("services.hero_subtitle")}
                            </p>
                            <Link href="/doctors">
                                <Button size="lg" className="text-lg px-8">
                                    {t("services.cta_find_doctor") || (language === 'fr' ? "Trouver un médecin maintenant" : "ابحث عن طبيب الآن")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Real Stats Section Added Here */}
                <StatsSection />

                {/* Main Services */}
                <section className="w-full py-16 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">{t("services.main_title")}</h2>
                            <p className="text-lg text-muted-foreground">
                                {t("services.main_subtitle")}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {mainServices.map((service, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <service.icon className="w-7 h-7 text-primary" />
                                        </div>
                                        <CardTitle className="text-2xl">{service.title}</CardTitle>
                                        <CardDescription className="text-base">{service.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Medical Specialties - Dynamic */}
                <section className="w-full py-16 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">{t("services.specialties_title")}</h2>
                            <p className="text-lg text-muted-foreground">
                                {t("services.specialties_subtitle")}
                            </p>
                        </div>
                        {loadingSpecialties ? (
                            <div className="text-center py-12">{t("featured.loading")}</div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {specialties.map((specialty, index) => {
                                    const Icon = iconMap[specialty.name] || defaultIcon
                                    return (
                                        <Link key={index} href={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}>
                                            <Card className="text-center hover:shadow-md transition-shadow cursor-pointer group">
                                                <CardContent className="pt-6 pb-6">
                                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                                                        <Icon className="w-8 h-8 text-primary group-hover:text-white" />
                                                    </div>
                                                    <h3 className="font-semibold mb-2">{specialty.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {specialty.doctorCount || 0} {language === 'fr' ? "médecins" : "طبيب"}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="w-full py-16 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">{t("services.why_title")}</h2>
                            <p className="text-lg text-muted-foreground">
                                {t("services.why_subtitle")}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {whyChooseUs.map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-16 bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-4">{t("services.cta_title")}</h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                {t("services.cta_desc")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/doctors">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        {t("about.cta_find_doctor")}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                                        {t("about.cta_register")}
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
