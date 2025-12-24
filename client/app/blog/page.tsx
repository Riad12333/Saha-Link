"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Search, ArrowRight, Loader2 } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"
import { api } from "@/lib/api"
import Link from "next/link"

interface BlogPost {
    _id: string
    title: string
    excerpt: string
    content: string
    category: string
    author: {
        name: string
        avatar?: string
    }
    createdAt: string
    slug: string
    image?: string
}

export default function BlogPage() {
    const { t } = useLanguage()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("Tous")
    const [searchQuery, setSearchQuery] = useState("")

    const categories = [
        "Tous",
        "Maladies",
        "Style de vie",
        "Santé Mentale",
        "Nutrition",
        "Sport",
        "Autres"
    ]

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {
                let url = `${api.blog}`
                const params = new URLSearchParams()
                if (selectedCategory !== "Tous") params.append("category", selectedCategory)
                if (searchQuery) params.append("search", searchQuery)

                if (params.toString()) url += `?${params.toString()}`

                const response = await fetch(url)
                const result = await response.json()
                if (result.success) {
                    setPosts(result.data)
                }
            } catch (error) {
                console.error("Error fetching blog posts:", error)
            } finally {
                setLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchPosts, 300)
        return () => clearTimeout(timeoutId)
    }, [selectedCategory, searchQuery])

    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-20 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
                    <div className="container px-4 md:px-6 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Le Blog Santé SahaLink</h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Retrouvez nos derniers articles, conseils et actualités médicales rédigés par des experts.
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-xl mx-auto group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher un article..."
                                    className="pl-12 h-12 text-lg rounded-full shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Filter */}
                <section className="w-full py-8 bg-background border-b sticky top-[64px] z-30 backdrop-blur-sm bg-white/80">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    onClick={() => setSelectedCategory(category)}
                                    className="rounded-full px-6 transition-all"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Blog Posts Grid */}
                <section className="w-full py-12 bg-background">
                    <div className="container px-4 md:px-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground">Chargement des articles...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
                                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                                <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou votre recherche.</p>
                                <Button
                                    variant="link"
                                    onClick={() => { setSelectedCategory("Tous"); setSearchQuery("") }}
                                    className="mt-4"
                                >
                                    Réinitialiser les filtres
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <Card key={post._id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-none shadow-md group h-full flex flex-col">
                                        <div className="relative h-52 bg-muted overflow-hidden">
                                            {post.image ? (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                    <FileText className="w-12 h-12 text-primary/20" />
                                                </div>
                                            )}
                                            <Badge className="absolute top-4 right-4 bg-white/90 text-primary hover:bg-white">{post.category}</Badge>
                                        </div>
                                        <CardHeader className="flex-grow">
                                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl font-bold leading-tight">
                                                {post.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-3 text-sm leading-relaxed mt-2">
                                                {post.excerpt}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0 border-t mt-4 bg-muted/5">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {post.author?.name?.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-foreground">{post.author?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            <Link href={`/blog/${post.slug}`}>
                                                <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-white transition-all rounded-xl mt-2">
                                                    Lire l'article
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="w-full py-20 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="container px-4 md:px-6 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                                <Clock className="w-4 h-4" />
                                <span>Restez informé</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Abonnez-vous à notre Newsletter</h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                                Recevez les meilleurs conseils santé et les nouveautés de SahaLink directement dans votre boîte mail.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <Input
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl"
                                />
                                <Button size="lg" className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90">
                                    S'abonner
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}

import { FileText } from "lucide-react"
