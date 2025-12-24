"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Brain, Activity, Eye, Bone, Baby, Stethoscope, Pill, Syringe, ClipboardList } from "lucide-react"
import Link from "next/link"
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
  "Psychiatrie": Brain, // Or Smile/User if Brain is taken
};

const defaultIcon = ClipboardList;

export function SpecialtiesSection() {
  const { t } = useLanguage()
  const [specialties, setSpecialties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        setLoading(false)
      }
    }
    fetchSpecialties()
  }, [])

  return (
    <section className="w-full py-20 bg-primary/5">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("specialties.title")}</h2>
          <p className="text-lg text-muted-foreground">{t("specialties.subtitle")}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">{t("featured.loading")}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {specialties.map((specialty, index) => {
              const Icon = iconMap[specialty.name] || defaultIcon
              return (
                <Link key={index} href={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}>
                  <Card className="h-full hover:shadow-lg transition cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{specialty.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {specialty.doctorCount || 2} {t("specialties.doctor_count")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
