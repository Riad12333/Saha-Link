"use client"

import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export function DoctorRegistrationCTA() {
  const { t } = useLanguage()
  const benefits = [
    t("cta.benefit1"),
    t("cta.benefit2"),
    t("cta.benefit3"),
    t("cta.benefit4"),
  ]

  return (
    <section className="w-full py-20 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="container px-4 md:px-6">
        <Card className="border-primary/20">
          <CardContent className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("cta.title")}</h2>
                  <p className="text-lg text-muted-foreground">
                    {t("cta.desc")}
                  </p>
                </div>

                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register/doctor">
                  <Button size="lg">{t("cta.btn")}</Button>
                </Link>
              </div>

              {/* Right */}
              <div className="hidden md:flex items-center justify-center">
                <img src="/doctor-digital-platform-registration.jpg" alt="Doctor Registration" className="w-full h-auto rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
