"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/providers/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, ArrowRight } from "lucide-react"

const WILAYAS = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna', 'Djelfa', 'Tlemcen', 'Sidi Bel Abbès'];

export function HeroSection() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [wilaya, setWilaya] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (wilaya) params.append('city', wilaya)
    router.push(`/doctors?${params.toString()}`)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-pretty">
              {t("hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mx-auto text-pretty">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Search Box */}
          <CardSearch handleSearch={handleSearch} search={search} setSearch={setSearch} wilaya={wilaya} setWilaya={setWilaya} t={t} language={language} />

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] overflow-hidden"
                  >
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className="text-primary font-bold">{t("hero.trust_text")}</span>
              </p>
            </div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Disponibilité 58 Wilayas
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CardSearch({ handleSearch, search, setSearch, wilaya, setWilaya, t, language }: any) {
  return (
    <div className="w-full max-w-3xl bg-white p-2 md:p-3 rounded-2xl shadow-2xl border flex flex-col md:flex-row gap-2 mt-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          className="border-none shadow-none focus-visible:ring-0 text-lg h-12 pl-10"
          placeholder={language === 'ar' ? "طبيب، تخصص..." : "Médecin, spécialité..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="hidden md:block w-px h-8 bg-border self-center" />
      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <select
          className="w-full bg-transparent border-none focus:ring-0 text-lg h-12 pl-10 outline-none appearance-none cursor-pointer"
          value={wilaya}
          onChange={(e) => setWilaya(e.target.value)}
        >
          <option value="">{language === 'ar' ? "كل الولايات" : "Toutes les wilayas"}</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <Button
        onClick={handleSearch}
        size="lg"
        className="rounded-xl px-8 h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
      >
        {t("common.search")}
      </Button>
    </div>
  )
}
