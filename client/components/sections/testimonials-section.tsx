"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/providers/language-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Star, MessageSquarePlus, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Testimonial {
  _id: string
  user: {
    name: string
    avatar?: string
    city?: string
  }
  rating: number
  content: string
  createdAt: string
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newContent, setNewContent] = useState("")

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(api.testimonials)
      const result = await response.json()
      if (result.success) {
        setTestimonials(result.data)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleSubmit = async () => {
    if (!newContent.trim()) {
      toast.error("Veuillez écrire un commentaire")
      return
    }

    setSubmitting(true)
    try {
      const currentToken = authService.getToken();
      if (!currentToken) {
        toast.error("Vous devez être connecté");
        return;
      }

      const response = await fetch(api.testimonials, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          rating: newRating,
          content: newContent
        })
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Avis publié avec succès !")
        setNewContent("")
        setNewRating(5)
        setIsDialogOpen(false)
        fetchTestimonials() // Refresh list
      } else {
        toast.error(result.message || "Erreur lors de la publication")
      }
    } catch (error) {
      toast.error("Erreur serveur")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="w-full py-20 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("testimonials.title")}</h2>
            <p className="text-muted-foreground">{t("testimonials.subtitle")}</p>
          </div>

          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-md hover:shadow-lg transition-all rounded-full px-6">
                  <MessageSquarePlus className="w-4 h-4" />
                  Donner mon avis
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Partagez votre expérience</DialogTitle>
                  <DialogDescription>
                    Votre avis aide les autres patients à trouver les meilleurs soins.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium">Votre note</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="content" className="text-sm font-medium">Votre témoignage</label>
                    <Textarea
                      id="content"
                      placeholder="Comment s'est passée votre expérience sur notre plateforme ?"
                      className="min-h-[120px]"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                  <Button onClick={handleSubmit} disabled={submitting} className="gap-2 px-6">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Publier
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {testimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                <p className="text-muted-foreground italic mb-2">Aucun avis pour le moment.</p>
                {user ? (
                  <p className="text-sm text-primary">Soyez le premier à donner votre avis !</p>
                ) : (
                  <p className="text-sm">Connectez-vous pour laisser un avis.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial: any) => (
                  <Card key={testimonial._id} className="hover:shadow-xl transition-all duration-300 border-none shadow-md bg-card/50 backdrop-blur-sm group">
                    <CardContent className="pt-8 pb-6 px-6 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                }`}
                            />
                          ))}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/20 group-hover:text-primary/40 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H12.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H7.017C6.46472 8 6.017 8.44772 6.017 9V12C6.017 12.5523 5.5693 13 5.017 13H3.017V21H5.017Z" />
                          </svg>
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed italic">
                        "{testimonial.content}"
                      </p>

                      <div className="flex items-center gap-4 border-t pt-6">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
                          <span className="text-primary font-bold text-sm">
                            {testimonial.user?.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{testimonial.user?.name || "Anonyme"}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                            {testimonial.user?.city || "Algérie"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>

  )
}
