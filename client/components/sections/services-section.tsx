"use client"

import { useLanguage } from "@/providers/language-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Calendar, Brain, FileText } from "lucide-react"
import Link from "next/link"

export function ServicesSection() {
  const { t } = useLanguage()

  const services = [
    {
      icon: Video,
      titleKey: "services.consultation",
      description: t("services.consultation_desc"),
      href: "/doctors",
    },
    {
      icon: Calendar,
      titleKey: "services.appointment",
      description: t("services.appointment_desc"),
      href: "/doctors",
    },
    {
      icon: Brain,
      titleKey: "services.ai",
      description: t("services.ai_desc"),
      href: "/ai-assistant",
    },
    {
      icon: FileText,
      titleKey: "services.records",
      description: t("services.records_desc"),
      href: "/patient/records",
    },
  ]

  return (
    <section className="w-full py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("services.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Link key={index} href={service.href}>
                <Card className="h-full hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{t(service.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
