"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, MapPin, Filter, Search } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useLanguage } from "@/providers/language-provider"

const WILAYAS = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna', 'Djelfa', 'Tlemcen', 'Sidi Bel Abbès'];


export function DoctorsListing() {
  const { t, language } = useLanguage()
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [specialties, setSpecialties] = useState<string[]>([])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        let url = `${api.doctors}`
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (selectedSpecialty) params.append('specialty', selectedSpecialty)
        if (selectedCity) params.append('city', selectedCity)
        url += `?${params.toString()}`

        const response = await fetch(url)

        if (response.ok) {
          const result = await response.json()
          setDoctors(result.data || [])
        } else {
          setDoctors([])
        }
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchDoctors()
    }, 400)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedSpecialty, selectedCity])

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch(api.specialties)
        if (response.ok) {
          const result = await response.json()
          const specs = result.data || []
          setSpecialties(specs.map((s: any) => s.name).sort())
        }
      } catch (e) {
        console.error("Error fetching specialties:", e)
      }
    }
    fetchSpecialties()
  }, [])

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("doctors.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="">{t("doctors.all_specialties") || "Toutes les spécialités"}</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="">{language === 'ar' ? "كل الولايات" : "Toutes les wilayas"}</option>
            {WILAYAS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {doctors.length} {language === 'ar' ? "طبيب متاح" : "médecins disponibles"}
        </p>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">{t("featured.loading")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="overflow-hidden hover:shadow-lg transition-all border-none shadow-md group">
              <CardHeader className="p-0">
                <div className="w-full h-52 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden relative">
                  {doctor.user?.avatar ? (
                    <img
                      src={doctor.user.avatar.startsWith('http') ? doctor.user.avatar : doctor.user.avatar.startsWith('/') ? doctor.user.avatar : `/${doctor.user.avatar}`}
                      alt={doctor.user?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-user.jpg";
                      }}
                    />
                  ) : (
                    <img src="/placeholder-user.jpg" alt="Doctor" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{doctor.averageRating?.toFixed(1) || "New"}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{doctor.user?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {doctor.specialty}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {doctor.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    {doctor.experience} {t("doctors.years")} {language === 'ar' ? "خبرة" : "d'expérience"}
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{t("doctors.clinic_fee")}</span>
                    <span className="font-bold text-primary">
                      {typeof doctor.consultationFees === 'object' ? doctor.consultationFees?.inPerson : doctor.consultationFees} {t("featured.currency")}
                    </span>
                  </div>
                  <Link href={`/booking/${doctor._id}`}>
                    <Button size="sm" className="shadow-md hover:shadow-lg transition-all">{t("featured.book_now")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && doctors.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("doctors.no_results")}</h3>
          <p className="text-muted-foreground">Essayez de modifier vos filtres ou de rechercher un autre terme.</p>
          <Button
            variant="outline"
            className="mt-6 bg-transparent"
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("");
              setSelectedCity("");
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  )
}
