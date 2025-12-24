"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, User } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export function FeaturedDoctorsSection() {
  const { t } = useLanguage()
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${api.doctors}?limit=4`)
        if (response.ok) {
          const data = await response.json()
          setDoctors(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center">{t("featured.loading")}</div>
        </div>
      </section>
    )
  }

  if (doctors.length === 0) {
    return null
  }

  return (
    <section className="w-full py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{t("featured.title")}</h2>
            <p className="text-muted-foreground">{t("featured.subtitle")}</p>
          </div>
          <Link href="/doctors">
            <Button variant="outline">{t("featured.view_all")}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doctor) => (
            <Card key={doctor._id} className="overflow-hidden hover:shadow-lg transition">
              <CardHeader className="p-0">
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  {doctor.user?.avatar && doctor.user.avatar.trim() ? (
                    <img
                      src={doctor.user.avatar.startsWith('http')
                        ? doctor.user.avatar
                        : doctor.user.avatar.startsWith('/')
                          ? doctor.user.avatar
                          : `/${doctor.user.avatar}`}
                      alt={doctor.user?.name || "Doctor"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-user.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src="/placeholder-user.jpg"
                      alt={doctor.user?.name || "Doctor"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{doctor.user?.name || "Dr. Unknown"}</h3>
                  <p className="text-sm text-primary">{doctor.specialty}</p>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {doctor.city}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{doctor.averageRating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({doctor.totalReviews || 0} {t("featured.reviews")})</span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="font-bold text-primary">
                    {typeof doctor.consultationFees === 'object'
                      ? `${doctor.consultationFees?.inPerson || doctor.consultationFees?.online || 'N/A'} ${t("featured.currency")}`
                      : `${doctor.consultationFees || 'N/A'} ${t("featured.currency")}`
                    }
                  </span>
                  <Link href={`/booking/${doctor._id}`}>
                    <Button size="sm">{t("featured.book_now")}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

