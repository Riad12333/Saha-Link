"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DoctorsListing } from "@/components/sections/doctors-listing"
import { useLanguage } from "@/providers/language-provider"

export default function DoctorsPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <section className="w-full py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">{t("doctors.title")}</h1>
              <p className="text-lg text-muted-foreground">{t("doctors.subtitle")}</p>
            </div>
            <DoctorsListing />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

