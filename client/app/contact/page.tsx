"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useLanguage } from "@/providers/language-provider"

export default function ContactPage() {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(api.contact, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (data.success) {
                toast.success(t("language") === 'fr' ? "Message envoyé avec succès!" : "تم إرسال الرسالة بنجاح!")
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                })
            } else {
                toast.error(data.message || (t("language") === 'fr' ? "Erreur lors de l'envoi du message" : "خطأ أثناء إرسال الرسالة"))
            }
        } catch (error) {
            toast.error(t("language") === 'fr' ? "Erreur lors de l'envoi du message" : "خطأ أثناء إرسال الرسالة")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("contact.hero_title")}</h1>
                            <p className="text-xl text-muted-foreground">
                                {t("contact.hero_subtitle")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Info & Form */}
                <section className="w-full py-16 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contact Information */}
                            <div className="lg:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t("contact.info_title")}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Phone className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{t("contact.phone")}</h3>
                                                <p className="text-muted-foreground" dir="ltr">+213 555 123 456</p>
                                                <p className="text-muted-foreground" dir="ltr">+213 555 789 012</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{t("contact.email")}</h3>
                                                <p className="text-muted-foreground">contact@medecine-app.dz</p>
                                                <p className="text-muted-foreground">support@medecine-app.dz</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{t("contact.address")}</h3>
                                                <p className="text-muted-foreground whitespace-pre-line">
                                                    {t("contact.address_desc")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{t("contact.working_hours")}</h3>
                                                <p className="text-muted-foreground">{t("contact.working_hours_desc1")}</p>
                                                <p className="text-muted-foreground">{t("contact.working_hours_desc2")}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{t("contact.form_title")}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">{t("contact.name_label")} *</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder={t("contact.name_label")}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">{t("contact.email_label")} *</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="example@email.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">{t("contact.phone_label")}</Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+213 555 123 456"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="subject">{t("contact.subject_label")} *</Label>
                                                    <Input
                                                        id="subject"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder={t("contact.subject_label")}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">{t("contact.message_label")} *</Label>
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder={t("contact.message_label")}
                                                    rows={6}
                                                />
                                            </div>

                                            <Button type="submit" size="lg" disabled={loading} className="w-full md:w-auto">
                                                <Send className="w-4 h-4 ml-2 rtl:mr-2" />
                                                {loading ? t("contact.sending") : t("contact.send_btn")}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="w-full py-16 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8">{t("contact.map_title")}</h2>
                            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                                <p className="text-muted-foreground">{t("contact.map_placeholder")}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}

