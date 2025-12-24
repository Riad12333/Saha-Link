"use client"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye, AlertCircle, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContentPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [specialties, setSpecialties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false)
  const [isSpecDialogOpen, setIsSpecDialogOpen] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<any>(null)
  const [currentSpec, setCurrentSpec] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [blogRes, specRes] = await Promise.all([
        fetch(api.blog),
        fetch(api.specialties)
      ])

      const blogData = await blogRes.json()
      const specData = await specRes.json()

      if (blogData.success) setArticles(blogData.data)
      if (specData.success) setSpecialties(specData.data)
    } catch (error) {
      console.error("Error fetching content:", error)
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return
    try {
      const token = authService.getToken()
      const res = await fetch(api.blogPost(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("Article supprimé")
        fetchData()
      }
    } catch (error) {
      toast.error("Erreur de suppression")
    }
  }

  const handleDeleteSpec = async (id: string) => {
    if (!confirm("Supprimer cette spécialité ?")) return
    try {
      const token = authService.getToken()
      const res = await fetch(api.specialty(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        toast.success("Spécialité supprimée")
        fetchData()
      }
    } catch (error) {
      toast.error("Erreur de suppression")
    }
  }

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    try {
      const token = authService.getToken()
      const url = currentArticle ? api.blogPost(currentArticle._id) : api.blog
      const method = currentArticle ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, isPublished: true })
      })

      if (res.ok) {
        toast.success(currentArticle ? "Article mis à jour" : "Article créé")
        setIsArticleDialogOpen(false)
        fetchData()
      }
    } catch (error) {
      toast.error("Erreur d'enregistrement")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSpecSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    try {
      const token = authService.getToken()
      const url = currentSpec ? api.specialty(currentSpec._id) : api.specialties
      const method = currentSpec ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        toast.success(currentSpec ? "Spécialité mise à jour" : "Spécialité créée")
        setIsSpecDialogOpen(false)
        fetchData()
      }
    } catch (error) {
      toast.error("Erreur d'enregistrement")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion du Contenu</h1>
            <p className="text-muted-foreground">Articles du blog, spécialités et FAQ</p>
          </div>
          <Button onClick={() => { setCurrentArticle(null); setIsArticleDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Article
          </Button>
        </div>

        <Tabs defaultValue="articles" className="space-y-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="articles">Articles Blog</TabsTrigger>
            <TabsTrigger value="categories">Spécialités</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">Aucun article publié.</div>
                  ) : (
                    articles.map((article) => (
                      <div
                        key={article._id}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{article.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {article.category} • {article.author?.name} • {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => { setCurrentArticle(article); setIsArticleDialogOpen(true); }}>
                            <Edit className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => handleDeleteArticle(article._id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specialties.map((spec) => (
                    <div key={spec._id} className="flex items-center justify-between p-4 border rounded-xl bg-card">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {spec.name.charAt(0)}
                        </div>
                        <p className="font-medium">{spec.name}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setCurrentSpec(spec); setIsSpecDialogOpen(true); }}>
                          <Edit className="w-3 h-3 text-muted-foreground" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDeleteSpec(spec._id)}>
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="border-dashed h-full min-h-[60px] rounded-xl border-2 flex flex-col gap-1"
                    onClick={() => { setCurrentSpec(null); setIsSpecDialogOpen(true); }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs">Ajouter une spécialité</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground">La gestion des questions fréquentes (FAQ) arrive bientôt.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentArticle ? "Modifier l'article" : "Nouvel Article"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleArticleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" defaultValue={currentArticle?.title} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input id="category" name="category" defaultValue={currentArticle?.category} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Lien de l'image</Label>
                <Input id="image" name="image" defaultValue={currentArticle?.image} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Résumé</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={currentArticle?.excerpt} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea id="content" name="content" defaultValue={currentArticle?.content} className="min-h-[200px]" required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsArticleDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Specialty Dialog */}
      <Dialog open={isSpecDialogOpen} onOpenChange={setIsSpecDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSpec ? "Modifier la spécialité" : "Nouvelle Spécialité"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSpecSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la spécialité</Label>
              <Input id="name" name="name" defaultValue={currentSpec?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optionnel)</Label>
              <Textarea id="description" name="description" defaultValue={currentSpec?.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icône (Nom Lucide-React)</Label>
              <Input id="icon" name="icon" defaultValue={currentSpec?.icon} placeholder="Stethoscope, Brain, etc." />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSpecDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
