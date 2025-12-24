"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Stethoscope, Calendar, User } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

export default function DoctorDetailPage() {
  const params = useParams()
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!params || !params.id) return
      const doctorId = Array.isArray(params.id) ? params.id[0] : params.id
      try {
        const response = await fetch(api.doctor(doctorId))
        if (response.ok) {
          const result = await response.json()
          setDoctor(result.data || result)
        } else {
          console.error("Failed to fetch doctor:", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching doctor:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Chargement...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!doctor) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">Médecin non trouvé</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-8">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Doctor Image & Quick Info */}
              <div className="md:col-span-1">
                <Card>
                  <CardContent className="pt-0 p-0">
                    <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden flex items-center justify-center">
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
                    <div className="p-6 space-y-4">
                      <div>
                        <h1 className="text-2xl font-bold">{doctor.user?.name}</h1>
                        <p className="text-primary text-lg">{doctor.specialty}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {doctor.city}
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          {doctor.experience} ans d'expérience
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{doctor.averageRating?.toFixed(1) || "N/A"}</span>
                          <span className="text-muted-foreground">({doctor.totalReviews || 0} avis)</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-1">Tarif consultation</p>
                        <p className="text-2xl font-bold text-primary">
                          {typeof doctor.consultationFees === 'object'
                            ? `${doctor.consultationFees?.inPerson || doctor.consultationFees?.online || 'N/A'} دج`
                            : `${doctor.consultationFees || 'N/A'} دج`
                          }
                        </p>
                      </div>

                      <Link href={`/booking/${doctor._id}`}>
                        <Button className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Prendre rendez-vous
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Doctor Details */}
              <div className="md:col-span-2 space-y-6">
                <Tabs defaultValue="about" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="about">À propos</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="info">Informations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about">
                    <Card>
                      <CardHeader>
                        <CardTitle>À propos du médecin</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-2">Biographie</h3>
                          <p className="text-muted-foreground">
                            {doctor.bio || `Dr. ${doctor.user?.name} est un(e) spécialiste en ${doctor.specialty} avec ${doctor.experience} ans d'expérience dans le domaine médical.`}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Spécialité</h3>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {doctor.specialty}
                          </span>
                        </div>

                        {doctor.qualifications && doctor.qualifications.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-2">Qualifications</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {doctor.qualifications.map((qual: string, idx: number) => (
                                <li key={idx}>{qual}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="services">
                    <Card>
                      <CardHeader>
                        <CardTitle>Services proposés</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Consultation au cabinet</p>
                            <p className="text-sm text-muted-foreground">Rendez-vous en présentiel</p>
                          </div>
                          <span className="text-primary font-bold">
                            {typeof doctor.consultationFees === 'object'
                              ? `${doctor.consultationFees?.inPerson || 'N/A'} دج`
                              : `${doctor.consultationFees || 'N/A'} دج`
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Téléconsultation</p>
                            <p className="text-sm text-muted-foreground">Consultation en ligne</p>
                          </div>
                          <span className="text-primary font-bold">
                            {typeof doctor.consultationFees === 'object'
                              ? `${doctor.consultationFees?.online || 'N/A'} دج`
                              : `${doctor.consultationFees || 'N/A'} دج`
                            }
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="info">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informations pratiques</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Adresse</h3>
                          <p className="text-muted-foreground">{doctor.address || doctor.city}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Téléphone</h3>
                          <p className="text-muted-foreground">{doctor.user?.phone || "Non renseigné"}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Email</h3>
                          <p className="text-muted-foreground">{doctor.user?.email}</p>
                        </div>
                        {doctor.workingHours && (
                          <div>
                            <h3 className="font-semibold mb-2">Horaires</h3>
                            <p className="text-muted-foreground">
                              {doctor.workingHours.start} - {doctor.workingHours.end}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
